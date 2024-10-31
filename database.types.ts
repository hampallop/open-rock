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
      athletes: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      competePrograms: {
        Row: {
          createdAt: string
          discipline: Database['public']['Enums']['discipline']
          eventId: string
          id: string
          name: string
          rule: Database['public']['Enums']['rule']
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          discipline: Database['public']['Enums']['discipline']
          eventId: string
          id?: string
          name: string
          rule: Database['public']['Enums']['rule']
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          discipline?: Database['public']['Enums']['discipline']
          eventId?: string
          id?: string
          name?: string
          rule?: Database['public']['Enums']['rule']
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'competitionProgram_eventId_fkey'
            columns: ['eventId']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
        ]
      }
      competeResults: {
        Row: {
          athleteId: string
          competeRoundsId: string
          createdAt: string
          id: string
          routeNo: number | null
          score: string | null
          updatedAt: string
        }
        Insert: {
          athleteId: string
          competeRoundsId: string
          createdAt?: string
          id?: string
          routeNo?: number | null
          score?: string | null
          updatedAt?: string
        }
        Update: {
          athleteId?: string
          competeRoundsId?: string
          createdAt?: string
          id?: string
          routeNo?: number | null
          score?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'competeResults_athleteId_fkey'
            columns: ['athleteId']
            isOneToOne: false
            referencedRelation: 'athletes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'competeResults_competeRoundsId_fkey'
            columns: ['competeRoundsId']
            isOneToOne: false
            referencedRelation: 'competeRounds'
            referencedColumns: ['id']
          },
        ]
      }
      competeRoundAthletes: {
        Row: {
          athleteId: string
          competeRoundId: string
          createdAt: string
          id: number
          updatedAt: string
        }
        Insert: {
          athleteId: string
          competeRoundId: string
          createdAt?: string
          id?: number
          updatedAt?: string
        }
        Update: {
          athleteId?: string
          competeRoundId?: string
          createdAt?: string
          id?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: 'competeRoundAthletes_athleteId_fkey'
            columns: ['athleteId']
            isOneToOne: false
            referencedRelation: 'athletes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'competeRoundAthletes_competeRoundId_fkey'
            columns: ['competeRoundId']
            isOneToOne: false
            referencedRelation: 'competeRounds'
            referencedColumns: ['id']
          },
        ]
      }
      competeRounds: {
        Row: {
          competeProgramId: string
          createdAt: string
          endedAt: string | null
          id: string
          name: string
          routeAmount: number | null
          startedAt: string | null
          status: Database['public']['Enums']['roundStatus']
          type: string | null
          updatedAt: string
          videoUrl: string | null
        }
        Insert: {
          competeProgramId: string
          createdAt?: string
          endedAt?: string | null
          id?: string
          name: string
          routeAmount?: number | null
          startedAt?: string | null
          status?: Database['public']['Enums']['roundStatus']
          type?: string | null
          updatedAt?: string
          videoUrl?: string | null
        }
        Update: {
          competeProgramId?: string
          createdAt?: string
          endedAt?: string | null
          id?: string
          name?: string
          routeAmount?: number | null
          startedAt?: string | null
          status?: Database['public']['Enums']['roundStatus']
          type?: string | null
          updatedAt?: string
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'competitionRounds_competitionProgramId_fkey'
            columns: ['competeProgramId']
            isOneToOne: false
            referencedRelation: 'competePrograms'
            referencedColumns: ['id']
          },
        ]
      }
      events: {
        Row: {
          createdAt: string
          description: string | null
          endedAt: string
          id: string
          location: string | null
          locationUrl: string | null
          metadata: Json | null
          name: string | null
          startedAt: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          endedAt: string
          id?: string
          location?: string | null
          locationUrl?: string | null
          metadata?: Json | null
          name?: string | null
          startedAt: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          endedAt?: string
          id?: string
          location?: string | null
          locationUrl?: string | null
          metadata?: Json | null
          name?: string | null
          startedAt?: string
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      discipline: 'boulder' | 'lead' | 'speed'
      roundStatus: 'ACTIVE' | 'INACTIVE'
      rule:
        | 'boulder-top-zone'
        | 'boulder-point'
        | 'lead-hold-count'
        | 'speed-time'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
