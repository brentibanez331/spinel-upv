'use client'

import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { createClient } from '@/utils/supabase/client';


export default function CandidatePage() {
  const supabase = createClient();

  return (
    <div>
      <Input
        type="file"
        name="file"
        accept="image/png, image/jpg, image/jpeg"
        onChange={async (e) => {
          const selectedFile = e.target.files?.[0];

          if (selectedFile) {
            const { error } = await supabase.storage
              .from('images')
              .upload(
                `${crypto.randomUUID()}/${selectedFile.name}`,
                selectedFile
              );

            if (error) {
              toast({
                variant: 'destructive',
                description:
                  'There was an error uploading the file. Please try again.',
              });
              return;
            }
          }
        }}
      />
    </div>

  )
}