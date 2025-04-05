import ChatSide from "@/components/chat-side";
import Nav from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default async function UserLayout({ children }: { children: ReactNode }) {
    // Keep cookies in the JS execution context for Next.js build
    const cookieStore = cookies();

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    return (<div className='flex w-screen'>
        <Nav params={{}}>
            <Suspense fallback={<div>Loading...</div>}>

            </Suspense>
        </Nav>

        <div className="min-h-screen w-full sm:pl-60 sm:pr-96">
            {children}
        </div>
    </div>);
}