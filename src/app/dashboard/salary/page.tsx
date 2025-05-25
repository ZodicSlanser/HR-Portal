import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SalaryManagementClient from "@/components/salary-management-client";

export default async function SalaryPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div>Please log in to access salary management.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      employees: {
        include: {
          salaryRecords: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }
  return <SalaryManagementClient user={{
    ...user,
    email: user.email!,
    name: user.name ?? undefined
  }} />;
}
