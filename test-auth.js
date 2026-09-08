import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...rest] = line.split('=');
  if (k && rest.length > 0) env[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);

async function testAuth() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = `PromptlySeed_!2026_${Math.random()}`;
  
  console.log(`Signing up ${email}...`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  console.log("Signup success! User ID:", authData.user?.id);
  
  // wait a bit for trigger
  await new Promise(r => setTimeout(r, 1000));

  // try inserting a resource as this user
  const { data: resData, error: resError } = await supabase.from('resources').insert({
    title: 'Test Resource',
    type: 'Prompt',
    category: 'UI/UX',
    content: 'Test content',
    creator_id: authData.user?.id
  }).select();

  if (resError) {
    console.error("Resource insert error:", resError);
  } else {
    console.log("Resource insert success!", resData);
  }
}

testAuth();
