import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { MessageCircle, Users, Briefcase, DollarSign, CheckSquare } from "lucide-react";
import ChatInterface from "@/components/chat-interface";
import type { Employee } from "@/lib/types/salary-types";

interface Project {
  id: string;
  name: string;
  description: string | null;
  tasks: Array<{
    id: string;
    status: string;
  }>;
}

export default async function ChatPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div>Please log in to access the AI assistant.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      employees: {
        include: {
          salaryRecords: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
      projects: {
        include: {
          tasks: {
            include: {
              assignments: {
                include: {
                  employee: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }
  // Prepare context data for the AI
  const contextData = {
    employees: user.employees.map((emp: Employee) => ({
      id: emp.id,
      name: emp.name,
      employeeId: emp.employeeId,
      joiningDate: emp.joiningDate,
      basicSalary: emp.basicSalary,      latestSalary: emp.salaryRecords?.[0] ? {
        month: emp.salaryRecords[0].month,
        year: emp.salaryRecords[0].year,
        bonus: emp.salaryRecords[0].bonus,
        deduction: emp.salaryRecords[0].deduction,
        total: emp.salaryRecords[0].basicSalary + emp.salaryRecords[0].bonus - emp.salaryRecords[0].deduction,
      } : null,
    })),    projects: user.projects.map((proj: Project) => ({
      id: proj.id,
      name: proj.name,
      description: proj.description,
      taskCount: proj.tasks.length,
      completedTasks: proj.tasks.filter(t => t.status === "DONE").length,
      inProgressTasks: proj.tasks.filter(t => t.status === "IN_PROGRESS").length,
    })),    summary: {
      totalEmployees: user.employees.length,
      totalProjects: user.projects.length,      totalTasks: user.projects.reduce((sum: number, p: Project) => sum + p.tasks.length, 0),
      completedTasks: user.projects.reduce((sum: number, p: Project) => sum + p.tasks.filter(t => t.status === "DONE").length, 0),
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions about your employees, projects, and HR data
          </p>
        </div>
        <MessageCircle className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Quick Stats for Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contextData.summary.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contextData.summary.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contextData.summary.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {contextData.summary.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>            <div className="text-2xl font-bold">            ${contextData.employees.length > 0 ? 
                Math.round(contextData.employees.reduce((sum: number, emp: Employee) => sum + emp.basicSalary, 0) / contextData.employees.length).toLocaleString() : 
                0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>
            Ask questions about your HR data. The assistant has access to employee, project, and salary information.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <ChatInterface contextData={contextData} />
        </CardContent>
      </Card>
    </div>
  );
}
