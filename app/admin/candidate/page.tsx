// THE PURPOSE OF THIS PAGE IS JUST FOR POPULATING THE DATABASE

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { zfd } from "zod-form-data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreateCandidateFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  displayName: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters" }),
  politicalParty: z.string().min(1, { message: "Political party is required" }),
  birthdate: z.string().min(1, { message: "Birthdate is required" }),
  age: z.number().int().positive({ message: "Age must be a positive number" }),
  birthplace: z.string().min(1, { message: "Birthplace is required" }),
  residence: z.string().min(1, { message: "Residence is required" }),
  sex: z.string().min(1, { message: "Sex is required" }),
  civilStatus: z.string().min(1, { message: "Civil status is required" }),
  spouse: z.string().optional(),
  profession: z.string().min(1, { message: "Profession is required" }),
  positionSought: z.string().min(1, { message: "Position sought is required" }),
  periodOfResidence: z
    .string()
    .min(1, { message: "Period of residence is required" }),
  registeredVoterOf: z
    .string()
    .min(1, { message: "Registered voter of is required" }),
  image: zfd
    .file()
    .refine((file) => file.size < 5000000, {
      message: "File can't be bigger than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File format must be either jpg, jpeg, or png.",
      }
    )
    .optional(),
});

export default function CandidatePage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateCandidateFormSchema>>({
    resolver: zodResolver(CreateCandidateFormSchema as any),
    defaultValues: {
      fullName: "",
      displayName: "",
      politicalParty: "",
      birthdate: "",
      age: 0,
      birthplace: "",
      residence: "",
      sex: "",
      civilStatus: "",
      spouse: "",
      profession: "",
      positionSought: "",
      periodOfResidence: "",
      registeredVoterOf: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateCandidateFormSchema>) {
    setIsLoading(true);
    console.log(values.image!.name);
    let imagePath = null;
    if (values.image) {
      const { data: imageData, error: imageError } = await supabase.storage
        .from("images")
        .upload(`${crypto.randomUUID()}/${values.image.name}`, values.image);

      if (imageError) {
        toast({
          variant: "destructive",
          description:
            "There was an error uploading the image. Please try again.",
        });
        return;
      }

      imagePath = imageData?.path;
      console.log(imagePath);
    }

    console.log("ADDING DUMMY DATAA");

    const candidateId = crypto.randomUUID();

    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .insert({
        id: candidateId,
        full_name: values.fullName,
        display_name: values.displayName,
        political_party: values.politicalParty,
        image_path: imagePath,
      })
      .select("id")
      .single();

    console.log(candidateError);

    if (candidateError) {
      toast({
        variant: "destructive",
        description:
          "Error creating candidate record: " + candidateError.message,
      });
      return;
    }

    const { error: personalInfoError } = await supabase
      .from("personal_info")
      .insert({
        id: crypto.randomUUID(),
        candidate_id: candidateData.id,
        birthdate: values.birthdate,
        age_on_election_day: values.age,
        birthplace: values.birthplace,
        residence: values.residence,
        sex: values.sex,
        civil_status: values.civilStatus,
        spouse: values.spouse || null,
        profession: values.profession,
      });

    if (personalInfoError) {
      toast({
        variant: "destructive",
        description:
          "Error creating personal info record: " + personalInfoError.message,
      });
      return;
    }

    const { error: candidacyError } = await supabase.from("candidacy").insert({
      id: crypto.randomUUID(),
      candidate_id: candidateData.id,
      position_sought: values.positionSought,
      period_of_residence: values.periodOfResidence, // Make sure this is in proper interval format
      registered_voter_of: values.registeredVoterOf,
    });

    if (candidacyError) {
      toast({
        variant: "destructive",
        description:
          "Error creating candidacy record: " + candidacyError.message,
      });
      return;
    }

    toast({
      description: "Candidate information successfully saved.",
    });

    // Reset form after successful submission
    form.reset();
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid-cols-4 grid">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Display Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="politicalParty"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Political Party
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">Birthdate</FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">Age</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="birthplace"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Birthplace
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="residence"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">Residence</FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">Sex</FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="civilStatus"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Civil Status
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="spouse"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">Spouse</FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Profession
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="positionSought"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Position Sought
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="periodOfResidence"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Period of Residence
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="registeredVoterOf"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-bold">
                    Registered Voter of
                  </FormLabel>
                  <FormControl>
                    <Input className="w-[300px]" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">
                    Profile Picture
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-[350px]"
                      type="file"
                      {...fieldProps}
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            {/* <div>
              <Label>Image</Label>
              <Input
                className="w-[300px]"
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
            </div> */}
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
