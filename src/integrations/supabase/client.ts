// This file provides the Supabase client with graceful fallback if environment variables are not set.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = "https://judycrzfkrpkvtjdzphq.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_GiwPxUmVlx-QIwtGioL6Eg_cW4Q85zQ";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers }).catch(() => {
      // Return empty response on network failure in offline/no-supabase mode
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  };
}

function createSupabaseClient() {
  const SUPABASE_URL = 
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env['VITE_SUPABASE_URL'] : undefined) ||
    (typeof process !== 'undefined' && process.env ? process.env['SUPABASE_URL'] : undefined) ||
    DEFAULT_SUPABASE_URL;

  const SUPABASE_PUBLISHABLE_KEY = 
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    (typeof process !== 'undefined' && process.env ? process.env['SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    DEFAULT_SUPABASE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
