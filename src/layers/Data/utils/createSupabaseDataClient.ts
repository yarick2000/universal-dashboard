import { createClient } from '@supabase/supabase-js';

import { isClient } from '@/utils';

import { SupabaseDataClient } from '../types';
import { Database } from '../types/SupabaseDatabaseTypes';

export function createSupabaseDataClient(): SupabaseDataClient {
  // Supabase should only be used on the server side
  if (isClient()) {
    return null;
  }
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_KEY as string;
  try {
    const client = createClient<Database>(supabaseUrl, supabaseKey);
    return client;
  } catch {
    return null;
  }
}

createSupabaseDataClient.inject = [] as const;
