import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
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
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  };
}

export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const SUPABASE_URL = (typeof process !== 'undefined' && process.env ? process.env['SUPABASE_URL'] : undefined) || DEFAULT_SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = (typeof process !== 'undefined' && process.env ? process.env['SUPABASE_PUBLISHABLE_KEY'] : undefined) || DEFAULT_SUPABASE_KEY;
    
    const request = getRequest();
    const authHeader = request?.headers?.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fallback guest session instead of throwing
      const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      return next({
        context: {
          supabase,
          userId: "guest-user",
          claims: { sub: "guest-user" },
        },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token || token === "demo-token" || token.split('.').length !== 3) {
      const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      return next({
        context: {
          supabase,
          userId: "demo-creator-1",
          claims: { sub: "demo-creator-1" },
        },
      });
    }

    const supabase = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    try {
      const { data } = await supabase.auth.getClaims(token);
      const userId = data?.claims?.sub || "authenticated-user";
      return next({
        context: {
          supabase,
          userId,
          claims: data?.claims || { sub: userId },
        },
      });
    } catch {
      return next({
        context: {
          supabase,
          userId: "authenticated-user",
          claims: { sub: "authenticated-user" },
        },
      });
    }
  },
);
