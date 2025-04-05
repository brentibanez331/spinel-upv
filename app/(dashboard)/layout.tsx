import Nav from "@/components/nav";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    // Keep cookies in the JS execution context for Next.js build
    const cookieStore = cookies();

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    return (<div className=''>
        <Nav params={{}}>
            <Suspense fallback={<div>Loading...</div>}>

            </Suspense>
        </Nav>
        <div>
            {children}
        </div>
    </div>);
}