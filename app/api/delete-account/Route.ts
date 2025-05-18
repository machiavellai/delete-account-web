import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function POST(request: Request) {
    const { email } = await request.json();
    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
        const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        const user = users.users.find((u) => u.email === email);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        await supabase.from('subscriptions').delete().eq('user_id', user.id);
        await supabase.from('users').delete().eq('id', user.id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}