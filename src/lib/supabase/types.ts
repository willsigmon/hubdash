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
      devices: {
        Row: {
          id: string
          serial_number: string
          model: string
          manufacturer: string
          status: 'donated' | 'received' | 'data_wipe' | 'refurbishing' | 'qa_testing' | 'ready' | 'distributed'
          location: string
          assigned_to: string | null
          received_date: string
          distributed_date: string | null
          partner_id: string | null
          tech_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          serial_number: string
          model: string
          manufacturer: string
          status?: 'donated' | 'received' | 'data_wipe' | 'refurbishing' | 'qa_testing' | 'ready' | 'distributed'
          location: string
          assigned_to?: string | null
          received_date: string
          distributed_date?: string | null
          partner_id?: string | null
          tech_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          serial_number?: string
          model?: string
          manufacturer?: string
          status?: 'donated' | 'received' | 'data_wipe' | 'refurbishing' | 'qa_testing' | 'ready' | 'distributed'
          location?: string
          assigned_to?: string | null
          received_date?: string
          distributed_date?: string | null
          partner_id?: string | null
          tech_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          company: string
          contact_name: string
          contact_email: string
          device_count: number
          location: string
          priority: 'urgent' | 'high' | 'normal'
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed'
          requested_date: string
          scheduled_date: string | null
          completed_date: string | null
          assigned_tech_id: string | null
          certificate_issued: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: string
          contact_name: string
          contact_email: string
          device_count: number
          location: string
          priority?: 'urgent' | 'high' | 'normal'
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed'
          requested_date: string
          scheduled_date?: string | null
          completed_date?: string | null
          assigned_tech_id?: string | null
          certificate_issued?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string
          contact_name?: string
          contact_email?: string
          device_count?: number
          location?: string
          priority?: 'urgent' | 'high' | 'normal'
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed'
          requested_date?: string
          scheduled_date?: string | null
          completed_date?: string | null
          assigned_tech_id?: string | null
          certificate_issued?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
          id: string
          name: string
          type: 'school' | 'library' | 'nonprofit' | 'veteran_org' | 'other'
          contact_email: string
          contact_phone: string | null
          address: string
          county: string
          devices_received: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'school' | 'library' | 'nonprofit' | 'veteran_org' | 'other'
          contact_email: string
          contact_phone?: string | null
          address: string
          county: string
          devices_received?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'school' | 'library' | 'nonprofit' | 'veteran_org' | 'other'
          contact_email?: string
          contact_phone?: string | null
          address?: string
          county?: string
          devices_received?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      training_sessions: {
        Row: {
          id: string
          title: string
          date: string
          location: string
          instructor: string
          attendee_count: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          location: string
          instructor: string
          attendee_count?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          location?: string
          instructor?: string
          attendee_count?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string | null
          user_name: string
          action: string
          target: string
          type: 'success' | 'warning' | 'info'
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_name: string
          action: string
          target: string
          type?: 'success' | 'warning' | 'info'
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          user_name?: string
          action?: string
          target?: string
          type?: 'success' | 'warning' | 'info'
          icon?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
