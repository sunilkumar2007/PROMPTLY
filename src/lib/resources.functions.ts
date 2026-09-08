import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { mockedPosts } from "./mocked-posts";

export const getResources = createServerFn({ method: "GET" })
  .validator((data: unknown) => 
    z.object({
      query: z.string().optional(),
      category: z.enum([
        'Website Development',
        'Mobile Applications',
        'UI/UX',
        'AI/ML',
        'Data Science',
        'Automation',
        'Marketing',
        'Content Creation',
        'Business',
        'Education',
        'Productivity'
      ]).optional(),
      type: z.enum([
        'Prompt',
        'Code',
        'UI/UX',
        'Component',
        'Template',
        'Project',
        'Module',
        'Function'
      ]).optional(),
      creator_id: z.string().optional(),
      sort: z.enum(['newest', 'trending', 'popular']).optional().default('newest'),
      page: z.number().optional().default(1),
    }).optional().default({}).parse(data)
  )
  .handler(async ({ data = {} }) => {
    let q = supabase
      .from("resources")
      .select(`
        *,
        creator:profiles(full_name, avatar_url, username)
      `);

    if (data.query) {
      q = q.or(`title.ilike.%${data.query}%,description.ilike.%${data.query}%,tags.cs.{${data.query}}`);
    }

    if (data.category) {
      q = q.eq("category", data.category);
    }

    if (data.type) {
      q = q.eq("type", data.type);
    }

    if (data.creator_id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.creator_id);
      if (isUuid) {
        q = q.eq("creator_id", data.creator_id);
      } else {
        q = q.eq("creator_id", "00000000-0000-0000-0000-000000000000");
      }
    }

    if (data.sort === 'newest') {
      q = q.order("created_at", { ascending: false });
    } else if (data.sort === 'trending') {
      q = q.order("likes_count", { ascending: false });
    } else if (data.sort === 'popular') {
      q = q.order("saves_count", { ascending: false });
    }

    const pageSize = 20;
    const page = data.page ?? 1;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let results: any[] = [];
    try {
      const { data: dbRes, error } = await q.range(from, to);
      if (!error && dbRes) {
        results = dbRes;
      }
    } catch (err) {
      console.warn("Supabase query fallback to mocked resources:", err);
    }
    
    // Inject the mocked posts at the top of the first page!
    if (page === 1) {
      let filteredMocks = mockedPosts;
      if (data.creator_id) {
        filteredMocks = filteredMocks.filter(p => p.creator_id === data.creator_id);
      }
      if (data.query) {
        const qStr = data.query.toLowerCase();
        filteredMocks = filteredMocks.filter(p => 
          p.title.toLowerCase().includes(qStr) || 
          (p.description && p.description.toLowerCase().includes(qStr)) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(qStr)))
        );
      }
      if (data.category) {
        filteredMocks = filteredMocks.filter(p => p.category === data.category);
      }
      if (data.type) {
        filteredMocks = filteredMocks.filter(p => p.type === data.type);
      }
      return [...filteredMocks, ...results] as any[];
    }
    
    return results;
  });

export const getResourceById = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data ?? {}))
  .handler(async ({ data: { id } }) => {
    // Check mocked posts first
    const mockPost = mockedPosts.find(p => p.id === id);
    if (mockPost) return mockPost as any;

    const { data: result, error } = await supabase
      .from("resources")
      .select(`
        *,
        creator:profiles(full_name, avatar_url, username, bio)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return result;
  });

export const getRelatedResources = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ 
    id: z.string(),
    category: z.string().optional(),
    type: z.string().optional(),
    tags: z.array(z.string()).optional()
  }).parse(data ?? {}))
  .handler(async ({ data }) => {
    let q = supabase
      .from("resources")
      .select(`
        *,
        creator:profiles(full_name, avatar_url, username)
      `)
      .neq("id", data.id)
      .limit(6);

    if (data.category) {
      q = q.eq("category", data.category as any);
    }
    
    const { data: results, error } = await q;
    if (error) throw error;
    return results;
  });

export const getComments = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ resourceId: z.string() }).parse(data ?? {}))
  .handler(async ({ data: { resourceId } }) => {
    const { data: result, error } = await supabase
      .from("comments")
      .select(`
        *,
        user:profiles(username, avatar_url)
      `)
      .eq("resource_id", resourceId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return result;
  });

export const getProfile = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ username: z.string() }).parse(data ?? {}))
  .handler(async ({ data: { username } }) => {
    // Check if the input is a UUID (common if auth ID is passed instead of username)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username);
    
    let query = supabase.from("profiles").select("*");
    
    if (isUuid) {
      query = query.eq("id", username);
    } else {
      query = query.eq("username", username);
    }

    const { data: profile, error } = await query.maybeSingle();

    if (error) throw error;
    
    // Fallback to a mocked profile if none is found so the UI can be viewed
    if (!profile) {
      return {
        id: "mock-creator-id",
        username: "sunilkumar",
        full_name: "Sunil Kumar",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        bio: "Designing future interfaces and exploring AI creative potential. London based.",
      };
    }
    
    return profile;
  });

export const createResource = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    content: z.string().min(1),
    category: z.string(),
    type: z.string(),
    tags: z.array(z.string()).optional(),
    creator_id: z.string(),
  }).parse(data ?? {}))
  .handler(async ({ data }) => {
    // If we are using the mock creator, just push to mocked posts array in memory
    if (data.creator_id === "mock-creator-id") {
      const newPost = {
        id: `mock-post-${Date.now()}`,
        title: data.title,
        description: data.description || null,
        content: data.content,
        category: data.category,
        type: data.type,
        tags: data.tags || [],
        creator_id: "mock-creator-id",
        creator: {
          username: "sunilkumar",
          full_name: "Sunil Kumar",
          avatar_url: null,
          bio: "Designing future interfaces and exploring AI creative potential. London based."
        },
        likes_count: 0,
        saves_count: 0,
        downloads_count: 0,
        views_count: 0,
        average_rating: 0,
        ratings_count: 0,
        created_at: new Date().toISOString()
      };
      
      mockedPosts.unshift(newPost as any);
      return newPost;
    }

    const { data: result, error } = await supabase
      .from("resources")
      .insert({
        title: data.title,
        description: data.description || null,
        content: data.content,
        category: data.category as any,
        type: data.type as any,
        tags: data.tags || null,
        creator_id: data.creator_id,
        likes_count: 0,
        saves_count: 0,
        views_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to insert resource:", error);
      throw error;
    }

    return result;
  });