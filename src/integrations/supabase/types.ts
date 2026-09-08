export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_archived: boolean
          is_pinned: boolean
          metadata: Json | null
          model: Database["public"]["Enums"]["ai_model_type"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          is_pinned?: boolean
          metadata?: Json | null
          model?: Database["public"]["Enums"]["ai_model_type"]
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          is_pinned?: boolean
          metadata?: Json | null
          model?: Database["public"]["Enums"]["ai_model_type"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_knowledge_sources: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          metadata: Json | null
          name: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          metadata?: Json | null
          name: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          resource_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          resource_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          resource_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          resource_id: string
          user_id: string
        }
        Insert: {
          resource_id: string
          user_id: string
        }
        Update: {
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string | null
          id: string
          rating: number
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rating: number
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rating?: number
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          average_rating: number | null
          category: Database["public"]["Enums"]["resource_category"]
          content: string
          created_at: string | null
          creator_id: string
          description: string | null
          difficulty: string | null
          download_url: string | null
          downloads_count: number | null
          framework: string | null
          id: string
          language: string | null
          license_type: string | null
          likes_count: number | null
          preview_url: string | null
          ratings_count: number | null
          readme_content: string | null
          saves_count: number | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          average_rating?: number | null
          category: Database["public"]["Enums"]["resource_category"]
          content: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          difficulty?: string | null
          download_url?: string | null
          downloads_count?: number | null
          framework?: string | null
          id?: string
          language?: string | null
          license_type?: string | null
          likes_count?: number | null
          preview_url?: string | null
          ratings_count?: number | null
          readme_content?: string | null
          saves_count?: number | null
          tags?: string[] | null
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          average_rating?: number | null
          category?: Database["public"]["Enums"]["resource_category"]
          content?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          difficulty?: string | null
          download_url?: string | null
          downloads_count?: number | null
          framework?: string | null
          id?: string
          language?: string | null
          license_type?: string | null
          likes_count?: number | null
          preview_url?: string | null
          ratings_count?: number | null
          readme_content?: string | null
          saves_count?: number | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saves: {
        Row: {
          resource_id: string
          user_id: string
        }
        Insert: {
          resource_id: string
          user_id: string
        }
        Update: {
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saves_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_resource_views: {
        Args: { resource_id: string }
        Returns: undefined
      }
    }
    Enums: {
      ai_model_type: "default" | "fast" | "reasoning" | "coding" | "creative"
      ai_output_type:
        | "Prompt"
        | "Source Code"
        | "Function"
        | "Component"
        | "Module"
        | "API"
        | "Database Schema"
        | "UI/UX Specification"
        | "Project Architecture"
        | "Documentation"
        | "README"
        | "JSON"
        | "Markdown"
        | "Automation Workflow"
        | "Image-generation prompt"
        | "Video-generation prompt"
      resource_category:
        | "Website Development"
        | "Mobile Applications"
        | "UI/UX"
        | "AI/ML"
        | "Data Science"
        | "Automation"
        | "Marketing"
        | "Content Creation"
        | "Business"
        | "Education"
        | "Productivity"
      resource_type:
        | "Prompt"
        | "Code"
        | "UI/UX"
        | "Component"
        | "Template"
        | "Project"
        | "Module"
        | "Function"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_model_type: ["default", "fast", "reasoning", "coding", "creative"],
      ai_output_type: [
        "Prompt",
        "Source Code",
        "Function",
        "Component",
        "Module",
        "API",
        "Database Schema",
        "UI/UX Specification",
        "Project Architecture",
        "Documentation",
        "README",
        "JSON",
        "Markdown",
        "Automation Workflow",
        "Image-generation prompt",
        "Video-generation prompt",
      ],
      resource_category: [
        "Website Development",
        "Mobile Applications",
        "UI/UX",
        "AI/ML",
        "Data Science",
        "Automation",
        "Marketing",
        "Content Creation",
        "Business",
        "Education",
        "Productivity",
      ],
      resource_type: [
        "Prompt",
        "Code",
        "UI/UX",
        "Component",
        "Template",
        "Project",
        "Module",
        "Function",
      ],
    },
  },
} as const
