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
        const { data: user, error: fetchError } = await supabase
            .from('auth.users')
            .select('id')
            .eq('email', email)
            .single();

        if (fetchError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        await supabase.from('subscriptions').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}