export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    role: 'hr' | 'employee'
                    company_id: string | null
                    status: 'active' | 'invited' | 'pending'
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    role?: 'hr' | 'employee'
                    company_id?: string | null
                    status?: 'active' | 'invited' | 'pending'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    role?: 'hr' | 'employee'
                    company_id?: string | null
                    status?: 'active' | 'invited' | 'pending'
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "users_company_id_fkey"
                        columns: ["company_id"]
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    }
                ]
            }
            companies: {
                Row: {
                    id: string
                    name: string
                    hr_owner_id: string | null
                    created_at: string
                    reminder_enabled: boolean
                    reminder_times: string[]
                    timezone: string
                }
                Insert: {
                    id?: string
                    name: string
                    hr_owner_id?: string | null
                    created_at?: string
                    reminder_enabled?: boolean
                    reminder_times?: string[]
                    timezone?: string
                }
                Update: {
                    id?: string
                    name?: string
                    hr_owner_id?: string | null
                    created_at?: string
                    reminder_enabled?: boolean
                    reminder_times?: string[]
                    timezone?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "companies_hr_owner_id_fkey"
                        columns: ["hr_owner_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            memberships: {
                Row: {
                    id: string
                    user_id: string
                    company_id: string
                    status: 'active' | 'invited'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_id: string
                    status?: 'active' | 'invited'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_id?: string
                    status?: 'active' | 'invited'
                    created_at?: string
                }
                Relationships: []
            }
            exercises: {
                Row: {
                    id: string
                    name: string
                    difficulty: 'basic' | 'medium' | 'complex'
                    description: string | null
                    gif_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    difficulty?: 'basic' | 'medium' | 'complex'
                    description?: string | null
                    gif_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    difficulty?: 'basic' | 'medium' | 'complex'
                    description?: string | null
                    gif_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            invitations: {
                Row: {
                    id: string
                    email: string
                    company_id: string
                    token: string
                    status: 'pending' | 'accepted'
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    company_id: string
                    token?: string
                    status?: 'pending' | 'accepted'
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    company_id?: string
                    token?: string
                    status?: 'pending' | 'accepted'
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "invitations_company_id_fkey"
                        columns: ["company_id"]
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    }
                ]
            }
            session_logs: {
                Row: {
                    id: string
                    user_id: string
                    company_id: string
                    exercise_id: string | null
                    timestamp: string
                    source: string
                    duration_seconds: number
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_id: string
                    exercise_id?: string | null
                    timestamp?: string
                    source?: string
                    duration_seconds?: number
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_id?: string
                    exercise_id?: string | null
                    timestamp?: string
                    source?: string
                    duration_seconds?: number
                }
                Relationships: []
            }
            reminder_logs: {
                Row: {
                    id: string
                    user_id: string
                    company_id: string
                    sent_at: string
                    method: 'email' | 'slack' | 'sms'
                }
                Insert: {
                    id?: string
                    user_id: string
                    company_id: string
                    sent_at?: string
                    method: 'email' | 'slack' | 'sms'
                }
                Update: {
                    id?: string
                    user_id?: string
                    company_id?: string
                    sent_at?: string
                    method?: 'email' | 'slack' | 'sms'
                }
                Relationships: [
                    {
                        foreignKeyName: "reminder_logs_company_id_fkey"
                        columns: ["company_id"]
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reminder_logs_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'hr' | 'employee'
            user_status: 'active' | 'invited' | 'pending'
            membership_status: 'active' | 'invited'
            exercise_difficulty: 'basic' | 'medium' | 'complex'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
