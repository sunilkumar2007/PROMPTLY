import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const SUPABASE_URL = env.match(/SUPABASE_URL="(.*?)"/)?.[1];
const SUPABASE_PUBLISHABLE_KEY = env.match(/SUPABASE_PUBLISHABLE_KEY="(.*?)"/)?.[1];

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testInsert() {
  const { data, error } = await supabase.from('resources').insert([
    {
      title: 'Test RLS Bypass',
      description: 'Testing if anon can insert',
      type: 'Prompt',
      category: 'AI/ML',
      creator_id: 'e6b528b1-382a-4f40-8041-38ccdd5320c0' // Using random UUID format
    }
  ]);
  
  if (error) {
    console.error('Insert failed:', error.message);
  } else {
    console.log('Insert succeeded!', data);
  }
}

testInsert();
