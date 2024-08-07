import { Metadata } from "next";
import { AdminNavbar } from "./_components/admin-navbar";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
