import { jobTypes } from "@/lib/job-types";
import prisma from "@/lib/prisma";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFilterFormSubmitButton } from "./job-filter-form-submit-button";
import { CrossIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`/?${searchParams.toString()}`);
}

type JobFilterSidebarProps = {
  defaultValues: JobFilterValues;
};

export async function JobFilterSidebar({
  defaultValues,
}: JobFilterSidebarProps) {
  const distinctLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];

  return (
    <aside className="sticky top-10 h-fit rounded-sm border bg-background p-4 md:w-[260px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues?.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={defaultValues?.type || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              name="location"
              defaultValue={defaultValues?.location || ""}
            >
              <SelectTrigger className="flex w-full justify-between">
                <SelectValue placeholder="Select job location" />
              </SelectTrigger>
              <SelectContent>
                {distinctLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-h-10 items-center justify-between">
            <span className="flex items-center gap-2">
              <input
                id="remote"
                name="remote"
                type="checkbox"
                className="scale-125 accent-black"
                defaultChecked={!!defaultValues?.remote}
              />
              <Label htmlFor="remote">Remote jobs</Label>
            </span>

            {!!Object.values(defaultValues).filter(Boolean).length && (
              <Link href={"/"}>
                <Button variant={"ghost"}>
                  Clear <X className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>

          <JobFilterFormSubmitButton className="w-full">
            Filter jobs
          </JobFilterFormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
