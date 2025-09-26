import { createClient } from '@supabase/supabase-js';

import { isClient } from '@/utils/system';

import { SupabaseDataClient } from '../types';
import { Database } from '../types/SupabaseDatabaseTypes';

/**
 * Creates and configures a Supabase client for server-side data operations.
 *
 * This function creates a Supabase client instance specifically designed for server-side usage.
 * It includes safety checks to prevent client-side instantiation and configures the client
 * to not persist authentication sessions, which is important for server-side operations.
 *
 * @returns {SupabaseDataClient} A configured Supabase client instance, or null if:
 *   - Called from client-side environment
 *   - Required environment variables are missing
 *   - Client creation fails
 *
 * @remarks
 * This function requires the following environment variables to be set:
 * - `SUPABASE_URL`: The URL of your Supabase project
 * - `SUPABASE_KEY`: The service key for your Supabase project
 *
 * The client is configured with `persistSession: false` to prevent session persistence,
 * which is crucial for server-side operations to avoid session conflicts.
 *
 * @example
 * ```typescript
 * const supabase = createSupabaseDataClient();
 * if (supabase) {
 *   // Safe to use supabase client
 *   const { data, error } = await supabase.from('table').select('*');
 * }
 * ```
 */
export function createSupabaseDataClient(): SupabaseDataClient {
  // Supabase should only be used on the server side
  if (isClient()) {
    return null;
  }
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_KEY as string;
  try {
    const client = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        // Important to prevent the service client from persisting sessions
        persistSession: false,
      },
    });
    return client;
  } catch {
    return null;
  }
}

createSupabaseDataClient.inject = [] as const;
