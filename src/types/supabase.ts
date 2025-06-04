export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          role: 'USER' | 'ADMIN'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          role?: 'USER' | 'ADMIN'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          role?: 'USER' | 'ADMIN'
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          code: string
          client: string
          start_date: string
          end_date: string
          status: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          client: string
          start_date: string
          end_date: string
          status: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          client?: string
          start_date?: string
          end_date?: string
          status?: string
          created_by?: string
          created_at?: string
        }
      }
      project_users: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'PMO' | 'PM' | 'DESIGNER' | 'DEVELOPER' | 'QA' | 'CONSULTANT'
          joined_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role: 'PMO' | 'PM' | 'DESIGNER' | 'DEVELOPER' | 'QA' | 'CONSULTANT'
          joined_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'PMO' | 'PM' | 'DESIGNER' | 'DEVELOPER' | 'QA' | 'CONSULTANT'
          joined_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          title: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          title?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
          tags?: string[] | null
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      collection_bookmarks: {
        Row: {
          collection_id: string
          bookmark_id: string
          created_at: string
        }
        Insert: {
          collection_id: string
          bookmark_id: string
          created_at?: string
        }
        Update: {
          collection_id?: string
          bookmark_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          nickname: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
