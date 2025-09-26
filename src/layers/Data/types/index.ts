import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from './SupabaseDatabaseTypes';

// Supabase client type alias
export type SupabaseDataClient = SupabaseClient<Database> | null;
export * from './ApiDataClientTypes';
