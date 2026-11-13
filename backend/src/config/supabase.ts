import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

const isValidSupabaseKey = (key: string): boolean => {
  return typeof key === 'string' && key.length > 20 && !key.startsWith('mock_');
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseClient && isValidSupabaseKey(ENV.SUPABASE_ANON_KEY)) {
    supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  }
  return supabaseClient;
};

export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (!supabaseAdminClient && isValidSupabaseKey(ENV.SUPABASE_SERVICE_ROLE_KEY)) {
    supabaseAdminClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdminClient;
};

export const isLiveSupabaseActive = (): boolean => {
  return Boolean(isValidSupabaseKey(ENV.SUPABASE_SERVICE_ROLE_KEY) || isValidSupabaseKey(ENV.SUPABASE_ANON_KEY));
};
