CREATE TYPE public.ai_model_type AS ENUM ('default', 'fast', 'reasoning', 'coding', 'creative');
CREATE TYPE public.ai_output_type AS ENUM ('Prompt', 'Source Code', 'Function', 'Component', 'Module', 'API', 'Database Schema', 'UI/UX Specification', 'Project Architecture', 'Documentation', 'README', 'JSON', 'Markdown', 'Automation Workflow', 'Image-generation prompt', 'Video-generation prompt');

CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    model ai_model_type NOT NULL DEFAULT 'default',
    category TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_knowledge_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    content TEXT,
    file_path TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_knowledge_sources TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
GRANT ALL ON public.ai_messages TO service_role;
GRANT ALL ON public.ai_knowledge_sources TO service_role;

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" ON public.ai_conversations
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage messages in their conversations" ON public.ai_messages
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.ai_conversations
            WHERE id = ai_messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own knowledge sources" ON public.ai_knowledge_sources
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();