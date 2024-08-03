import prisma from "@/lib/prisma";
import { JobListItem } from "./job-list-item";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type JobListProps = {
  filterValues: JobFilterValues;
};

export async function JobsList({
  filterValues: { q, location, remote, type },
}: JobListProps) {
  const searchTerm = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchTerm
    ? {
        OR: [
          {
            title: { search: searchTerm },
          },
          {
            companyName: { search: searchTerm },
          },
          {
            type: { search: searchTerm },
          },
          {
            location: { search: searchTerm },
          },
          {
            locationType: { search: searchTerm },
          },
        ],
      }
    : {};

  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };

  const jobs = await prisma.job.findMany({
    where,

    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grow space-y-4">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Link href={`/jobs/${job.slug}`} key={job.id} className="block">
            <JobListItem job={job} />
          </Link>
        ))
      ) : (
        <div className="flex h-full items-center justify-center">
          No results matching your search criteria.
        </div>
      )}
    </div>
  );
}
