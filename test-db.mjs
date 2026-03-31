import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('healers')
    .select('*, profiles(full_name, email)');
  
  if (error) {
    console.error('ERROR FETCHING:', error.message);
  } else {
    console.log('FETCHED ROWS:', data.length);
    console.log(data);
  }
}

test();
