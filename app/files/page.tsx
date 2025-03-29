"use client"

import { createClient } from "@/supabase/functions/browser-client"


export default function Page() {
    const supabase = createClient()

    return (
        <div>
            Files Page
        </div>
    )
}