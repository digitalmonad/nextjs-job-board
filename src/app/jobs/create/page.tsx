import { Metadata } from "next";
import { CreateJobForm } from "./_components/create-job-form";

export type CreateJobPageProps = {};

export const metadata: Metadata = {
  title: "Post new job",
};

export default function CreateJobPage(props: CreateJobPageProps) {
  return <CreateJobForm />;
}
