import prisma from "@/lib/prisma";
import { JobListItem } from "./job-list-item";
import { JobFilterValues } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type JobListProps = {
  filterValues: JobFilterValues;
  page?: number;
};

const JOBS_PER_PAGE = 5;

export async function JobsList({ filterValues, page = 1 }: JobListProps) {
  const { q, location, remote, type } = filterValues;
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

  const skip = (page - 1) * JOBS_PER_PAGE;

  const jobsPromise = prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: JOBS_PER_PAGE,
    skip,
  });

  const countPromise = prisma.job.count({ where });

  const [jobs, jobsCount] = await Promise.all([jobsPromise, countPromise]);

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
      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(jobsCount / JOBS_PER_PAGE)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  filterValues: JobFilterValues;
};

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, location, remote, type },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(type && { type }),
      ...(location && { location }),
      ...(remote && { remote: String(remote) }),
      page: String(page),
    });

    return `/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
