import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const SUPABASE_URL = env.match(/SUPABASE_URL="(.*?)"/)?.[1];
const SUPABASE_PUBLISHABLE_KEY = env.match(/SUPABASE_PUBLISHABLE_KEY="(.*?)"/)?.[1];

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkData() {
  const { data, error } = await supabase
    .from('resources')
    .select('id, title, category, type')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('Query failed:', error);
  } else {
    console.log('Last 10 resources:');
    console.table(data);
  }
}

checkData();
