import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length > 0) env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);

async function test() {
  console.log("Testing Supabase connection...");
  const { data, error } = await supabase.from('profiles').select('id').limit(1);
  if (error) {
    console.error("Select error:", error);
  } else {
    console.log("Select success, profiles found:", data.length);
  }

  // try inserting a dummy profile
  const dummyId = crypto.randomUUID();
  const { data: iData, error: iError } = await supabase.from('profiles').insert([
    { id: dummyId, username: 'test_seeder', full_name: 'Test Seeder' }
  ]).select();
  
  if (iError) {
    console.error("Insert error (RLS might be active):", iError);
  } else {
    console.log("Insert success:", iData);
    
    // cleanup
    await supabase.from('profiles').delete().eq('id', dummyId);
  }
}

test();
