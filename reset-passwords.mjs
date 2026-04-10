import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function resetPasswords() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const testUsers = ['admin@gmail.com', 'healer@gmail.com'];
    for (const email of testUsers) {
        const user = users.find(u => u.email === email);
        if (user) {
            const { data, error } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: '123456' }
            );
            if (error) {
                console.error(`Error updating password for ${email}:`, error);
            } else {
                console.log(`Successfully reset password for ${email} to 123456`);
            }
        }
    }
}

resetPasswords();
