import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const { data: profiles, error: profileError } = await supabase.from('profiles').select('*');

    console.log("USERS:");
    users.forEach(u => console.log(u.email));
    
    console.log("\nPROFILES:");
    console.log(profiles);
}

getUsers();
