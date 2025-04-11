import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function ChatLayout({ children }: PropsWithChildren) {
  // Keep cookies in the JS execution context for Next.js build
  const cookieStore = cookies();

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return <div className=''>{children}</div>;
}