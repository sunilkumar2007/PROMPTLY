import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { aiGateway } from "@/lib/ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// In-memory storage for local mock user
let mockConversations: any[] = [];
let mockMessages: any[] = [];

export const getConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;

    if (userId === "demo-creator-1") {
      return mockConversations.filter(c => !c.is_archived).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data;
  });

export const getMessages = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ conversationId: z.string() }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;

    if (userId === "demo-creator-1") {
      const conv = mockConversations.find(c => c.id === data.conversationId);
      if (!conv) throw new Error("NotFound");
      return mockMessages.filter(m => m.conversation_id === data.conversationId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    // Verify ownership
    const { data: conv } = await supabase
      .from("ai_conversations")
      .select("id")
      .eq("id", data.conversationId)
      .eq("user_id", userId)
      .single();

    if (!conv) throw new Error("NotFound");

    const { data: messages, error } = await supabase
      .from("ai_messages")
      .select("*")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return messages;
  });

export const generateAIResponse = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    conversationId: z.string().optional(),
    message: z.string(),
    model: z.string().default("default"),
    category: z.string().optional(),
    systemPrompt: z.string().optional(),
  }).parse(data))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;

    let conversationId = data.conversationId;

    if (userId === "demo-creator-1") {
      if (!conversationId) {
        conversationId = `mock-conv-${Date.now()}`;
        mockConversations.push({
          id: conversationId,
          user_id: userId,
          title: data.message.substring(0, 50),
          model: data.model,
          category: data.category,
          is_archived: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else {
        const conv = mockConversations.find(c => c.id === conversationId);
        if (conv) conv.updated_at = new Date().toISOString();
      }

      const userMsg = {
        id: `msg-${Date.now()}-1`,
        conversation_id: conversationId,
        role: "user",
        content: data.message,
        created_at: new Date().toISOString()
      };
      mockMessages.push(userMsg);

      let assistantContent = "This is a simulated AI response for the mock environment. If you want real AI generation, please configure the LOVABLE_API_KEY environment variable and sign in with a real account.";
      if (data.message.toLowerCase().includes("srs") || data.message.toLowerCase().includes("phases")) {
        assistantContent = "I am ready. Please provide your Software Requirements Specification (SRS), and let me know how many phases you would like to break this into.";
      } else if (data.message.toLowerCase() === "hi" || data.message.toLowerCase() === "hello") {
        assistantContent = "Hello! I am Promptly AI. How can I help you build today?";
      }

      const assistantMsg = {
        id: `msg-${Date.now()}-2`,
        conversation_id: conversationId,
        role: "assistant",
        content: assistantContent,
        created_at: new Date().toISOString()
      };
      mockMessages.push(assistantMsg);

      return {
        conversationId,
        message: assistantMsg
      };
    }

    // Create conversation if it doesn't exist
    if (!conversationId) {
      const { data: newConv, error: convError } = await supabase
        .from("ai_conversations")
        .insert({
          user_id: userId,
          title: data.message.substring(0, 50),
          model: data.model as any,
          category: data.category
        })
        .select()
        .single();
      
      if (convError) throw convError;
      conversationId = newConv.id;
    }

    // Save user message
    await supabase.from("ai_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: data.message
    });

    // Get history for context
    const { data: history } = await supabase
      .from("ai_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    let assistantContent = "I encountered an issue generating a response.";
    try {
      // Call AI Gateway
      const response = await aiGateway.chat.completions.create({
        model: data.model === "coding" ? "gpt-4o" : "gpt-4o-mini",
        messages: [
          ...(data.systemPrompt ? [{ role: "system" as const, content: data.systemPrompt }] : []),
          ...(history?.map((m: any) => ({ role: m.role as "user" | "assistant" | "system", content: m.content })) || [])
        ],
      });
      assistantContent = response.choices[0]?.message?.content || assistantContent;
    } catch (e: any) {
      console.error("AI Gateway Error:", e);
      assistantContent = `Error communicating with AI: ${e.message || "Unknown error"}`;
    }

    // Save assistant response
    const { data: savedMsg, error: saveError } = await supabase
      .from("ai_messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: assistantContent
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return {
      conversationId,
      message: savedMsg
    };
  });