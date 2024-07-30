import { JobFilterSidebar } from "@/components/job-filter-sidebar";
import { JobsList } from "@/components/job-list";
import { JobListItem } from "@/components/job-list-item";

import prisma from "@/lib/prisma";
import { JobFilterValues } from "@/lib/validation";

type HomePageProps = {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
  };
};

export default async function Home({
  searchParams: { q, type, location, remote },
}: HomePageProps) {
  const filterValues: JobFilterValues = {
    q,
    type,
    location,
    remote: Boolean(remote),
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Developer jobs
        </h1>
        <p className="text-muted-foreground">Find your dream job.</p>
      </div>

      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobsList filterValues={filterValues} />
      </section>
    </main>
  );
}
