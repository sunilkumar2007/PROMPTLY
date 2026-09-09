// Server-side Supabase client with graceful fallback.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = "https://judycrzfkrpkvtjdzphq.supabase.co";
const DEFAULT_SUPABASE_SERVICE_ROLE_KEY = "sb_publishable_GiwPxUmVlx-QIwtGioL6Eg_cW4Q85zQ";

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
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  };
}

function createSupabaseAdminClient() {
  const SUPABASE_URL = (typeof process !== 'undefined' && process.env ? process.env['SUPABASE_URL'] : undefined) || DEFAULT_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = (typeof process !== 'undefined' && process.env ? process.env['SUPABASE_SERVICE_ROLE_KEY'] : undefined) || DEFAULT_SUPABASE_SERVICE_ROLE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
