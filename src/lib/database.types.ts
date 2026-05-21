export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
      talent_applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone: string
          city: string
          country: string
          specialization: string
          experience_level: string
          availability: string
          bio: string
          skills: string[]
          portfolio_url: string | null
          resume_url: string | null
          linkedin: string | null
          instagram: string | null
          twitter: string | null
          heard_from: string | null
          status: 'pending' | 'approved' | 'rejected'
          rejection_reason: string | null
          admin_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          accepted_terms: boolean
          user_id: string | null
          profile_photo_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          city: string
          country: string
          specialization: string
          experience_level: string
          availability: string
          bio: string
          skills?: string[]
          portfolio_url?: string | null
          resume_url?: string | null
          linkedin?: string | null
          instagram?: string | null
          twitter?: string | null
          heard_from?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          admin_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          accepted_terms: boolean
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          city?: string
          country?: string
          specialization?: string
          experience_level?: string
          availability?: string
          bio?: string
          skills?: string[]
          portfolio_url?: string | null
          resume_url?: string | null
          linkedin?: string | null
          instagram?: string | null
          twitter?: string | null
          heard_from?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          admin_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          accepted_terms?: boolean
          user_id?: string | null
          profile_photo_url?: string | null
        }
        Relationships: []
      }
      client_intake_submissions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          full_name: string
          company_name: string
          email: string
          phone: string
          website: string | null
          location: string
          social_media: string | null
          industry: string
          project_title: string
          project_type: string
          project_type_other: string | null
          objectives: string[]
          objective_other: string | null
          description: string
          start_date: string
          end_date: string | null
          important_dates: string | null
          digital_services: string[]
          visual_services: string[]
          video_services: string[]
          content_services: string[]
          media_services: string[]
          tech_services: string[]
          has_brand_guidelines: string
          brand_tone: string | null
          color_fonts: string | null
          inspirational_brands: string | null
          target_audience: string
          audience_location: string[]
          content_platforms: string[]
          content_platforms_other: string | null
          budget_range: string
          custom_budget: string | null
          payment_structure: string
          payment_structure_other: string | null
          deliverables: string
          kpis: string[]
          kpi_other: string | null
          primary_contact_name: string
          primary_contact_info: string
          communication_mode: string[]
          approval_timeline: string
          additional_notes: string | null
          status: 'new' | 'in_review' | 'closed'
          admin_notes: string | null
          client_account_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          company_name: string
          email: string
          phone: string
          website?: string | null
          location: string
          social_media?: string | null
          industry: string
          project_title: string
          project_type: string
          project_type_other?: string | null
          objectives?: string[]
          objective_other?: string | null
          description: string
          start_date: string
          end_date?: string | null
          important_dates?: string | null
          digital_services?: string[]
          visual_services?: string[]
          video_services?: string[]
          content_services?: string[]
          media_services?: string[]
          tech_services?: string[]
          has_brand_guidelines: string
          brand_tone?: string | null
          color_fonts?: string | null
          inspirational_brands?: string | null
          target_audience: string
          audience_location?: string[]
          content_platforms?: string[]
          content_platforms_other?: string | null
          budget_range: string
          custom_budget?: string | null
          payment_structure: string
          payment_structure_other?: string | null
          deliverables: string
          kpis?: string[]
          kpi_other?: string | null
          primary_contact_name: string
          primary_contact_info: string
          communication_mode?: string[]
          approval_timeline: string
          additional_notes?: string | null
          status?: 'new' | 'in_review' | 'closed'
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          company_name?: string
          email?: string
          phone?: string
          website?: string | null
          location?: string
          social_media?: string | null
          industry?: string
          project_title?: string
          project_type?: string
          project_type_other?: string | null
          objectives?: string[]
          objective_other?: string | null
          description?: string
          start_date?: string
          end_date?: string | null
          important_dates?: string | null
          digital_services?: string[]
          visual_services?: string[]
          video_services?: string[]
          content_services?: string[]
          media_services?: string[]
          tech_services?: string[]
          has_brand_guidelines?: string
          brand_tone?: string | null
          color_fonts?: string | null
          inspirational_brands?: string | null
          target_audience?: string
          audience_location?: string[]
          content_platforms?: string[]
          content_platforms_other?: string | null
          budget_range?: string
          custom_budget?: string | null
          payment_structure?: string
          payment_structure_other?: string | null
          deliverables?: string
          kpis?: string[]
          kpi_other?: string | null
          primary_contact_name?: string
          primary_contact_info?: string
          communication_mode?: string[]
          approval_timeline?: string
          additional_notes?: string | null
          status?: 'new' | 'in_review' | 'closed'
          admin_notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_accounts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          company_name: string
          email: string
          phone: string | null
          website: string | null
          industry: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name: string
          company_name: string
          email: string
          phone?: string | null
          website?: string | null
          industry?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          company_name?: string
          email?: string
          phone?: string | null
          website?: string | null
          industry?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          client_id: string
          title: string
          description: string
          specialization: string
          experience_level: string | null
          engagement_type: 'project' | 'part-time' | 'full-time' | 'retainer'
          location: string | null
          is_remote: boolean
          budget_range: string | null
          deadline: string | null
          status: 'draft' | 'open' | 'closed'
          published_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          client_id: string
          title: string
          description: string
          specialization: string
          experience_level?: string | null
          engagement_type: 'project' | 'part-time' | 'full-time' | 'retainer'
          location?: string | null
          is_remote?: boolean
          budget_range?: string | null
          deadline?: string | null
          status?: 'draft' | 'open' | 'closed'
          published_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          client_id?: string
          title?: string
          description?: string
          specialization?: string
          experience_level?: string | null
          engagement_type?: 'project' | 'part-time' | 'full-time' | 'retainer'
          location?: string | null
          is_remote?: boolean
          budget_range?: string | null
          deadline?: string | null
          status?: 'draft' | 'open' | 'closed'
          published_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          category: string
          short_description: string
          full_description: string
          goal_amount: number
          duration_days: number
          raised_amount: number
          backers_count: number
          slug: string | null
          image_url: string | null
          creator_name: string
          is_featured: boolean
          is_published: boolean
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          category: string
          short_description: string
          full_description: string
          goal_amount: number
          duration_days: number
          raised_amount?: number
          backers_count?: number
          slug?: string | null
          image_url?: string | null
          creator_name?: string
          is_featured?: boolean
          is_published?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          category?: string
          short_description?: string
          full_description?: string
          goal_amount?: number
          duration_days?: number
          raised_amount?: number
          backers_count?: number
          slug?: string | null
          image_url?: string | null
          creator_name?: string
          is_featured?: boolean
          is_published?: boolean
          created_by?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          published_at: string | null
          title: string
          slug: string
          excerpt: string
          body: string | null
          category: string
          author_name: string
          read_time: string | null
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          title: string
          slug: string
          excerpt: string
          body?: string | null
          category: string
          author_name: string
          read_time?: string | null
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          published_at?: string | null
          title?: string
          slug?: string
          excerpt?: string
          body?: string | null
          category?: string
          author_name?: string
          read_time?: string | null
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          created_by?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          category: string
          duration: string
          instructor: string
          video_url: string
          thumbnail_url: string | null
          sort_order: number
          is_published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          category: string
          duration: string
          instructor: string
          video_url: string
          thumbnail_url?: string | null
          sort_order?: number
          is_published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          category?: string
          duration?: string
          instructor?: string
          video_url?: string
          thumbnail_url?: string | null
          sort_order?: number
          is_published?: boolean
        }
        Relationships: []
      }
      webinars: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          host: string
          event_date: string
          registration_url: string
          is_published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          host: string
          event_date: string
          registration_url: string
          is_published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          host?: string
          event_date?: string
          registration_url?: string
          is_published?: boolean
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          created_at: string
          full_name: string | null
          role: 'admin' | 'super_admin'
          is_active: boolean
        }
        Insert: {
          id: string
          created_at?: string
          full_name?: string | null
          role?: 'admin' | 'super_admin'
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string | null
          role?: 'admin' | 'super_admin'
          is_active?: boolean
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          source: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          source?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          source?: string
          is_active?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type TalentApplication = Database['public']['Tables']['talent_applications']['Row']
export type TalentApplicationInsert = Database['public']['Tables']['talent_applications']['Insert']
export type TalentApplicationUpdate = Database['public']['Tables']['talent_applications']['Update']

export type ClientIntakeSubmission = Database['public']['Tables']['client_intake_submissions']['Row']
export type ClientIntakeInsert = Database['public']['Tables']['client_intake_submissions']['Insert']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']

export type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export type AdminUser = Database['public']['Tables']['admin_users']['Row']

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']

export type Webinar = Database['public']['Tables']['webinars']['Row']
export type WebinarInsert = Database['public']['Tables']['webinars']['Insert']
export type WebinarUpdate = Database['public']['Tables']['webinars']['Update']

export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']

export type ClientAccount = Database['public']['Tables']['client_accounts']['Row']
export type ClientAccountInsert = Database['public']['Tables']['client_accounts']['Insert']
export type ClientAccountUpdate = Database['public']['Tables']['client_accounts']['Update']

export type JobListing = Database['public']['Tables']['job_listings']['Row']
export type JobListingInsert = Database['public']['Tables']['job_listings']['Insert']
export type JobListingUpdate = Database['public']['Tables']['job_listings']['Update']
