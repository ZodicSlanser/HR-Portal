import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Users, FolderOpen, CheckSquare, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div>Please log in to access the dashboard.</div>;
  }

  // Get dashboard statistics
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      employees: true,
      projects: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  const totalEmployees = user.employees.length;
  const totalProjects = user.projects.length;
  const totalTasks = user.projects.reduce((acc, project) => acc + project.tasks.length, 0);
  const completedTasks = user.projects.reduce(
    (acc, project) => acc + project.tasks.filter(task => task.status === "DONE").length,
    0
  );

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">Ongoing projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">All tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {session?.user?.name || "User"}!</CardTitle>
            <CardDescription>Here&apos;s what&apos;s happening with your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Employees</span>
                <span className="text-sm text-muted-foreground">{totalEmployees} total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Projects</span>
                <span className="text-sm text-muted-foreground">{totalProjects} active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Task Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedTasks}/{totalTasks} completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest project activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet</p>
              ) : (
                user.projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {project.tasks.filter(t => t.status === "DONE").length} completed
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>        </Card>
      </div>
    </div>
  );
}