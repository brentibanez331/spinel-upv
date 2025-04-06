"use client"

import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"


export default function Page() {
    const supabase = createClient()

    return (
        <div>
            Files Page
            <Input
                type="file"
                name="file"
                onChange={async (e) => {
                    const selectedFile = e.target.files?.[0]
                    if (selectedFile) {
                        await supabase.storage
                            .from('files')
                            .upload(`${crypto.randomUUID()}/${selectedFile.name}`, selectedFile);
                    }
                }}
            />
        </div>
    )
}