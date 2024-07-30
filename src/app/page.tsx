import { JobFilterSidebar } from "@/components/job-filter-sidebar";
import { JobsList } from "@/components/job-list";

import { Metadata } from "next";

import { JobFilterValues } from "@/lib/validation";

type HomePageProps = {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
  };
};

function getTitle({ q, type, location, remote }: JobFilterValues) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? "Remote developer jobs"
        : "All developer jobs";

  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
}

export function generateMetadata({
  searchParams: { q, type, location, remote },
}: HomePageProps): Metadata {
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | Flow Jobs`,
  };
}

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
    <main className="m-auto my-10 max-w-5xl flex-1 space-y-10 px-3">
      <div className="space-y-5 text-center">
        {/* <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {getTitle(filterValues)}
        </h1>
        <p className="text-muted-foreground">Find your dream job.</p> */}
      </div>

      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobsList filterValues={filterValues} />
      </section>
    </main>
  );
}
