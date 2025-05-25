import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Plus, FolderOpen, Clock, CheckCircle } from "lucide-react";
import ProjectForm from "@/components/project-form";
import KanbanBoard from "@/components/kanban-board";
import TaskForm from "@/components/task-form";

export default async function ProjectsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div>Please log in to access projects.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
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
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      employees: true,
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  const allTasks = user.projects.flatMap(project => 
    project.tasks.map(task => ({
      ...task,
      project: {
        id: project.id,
        name: project.name,
      },
    }))
  );
  const tasksByStatus = {
    TODO: allTasks.filter(task => task.status === "TODO"),
    IN_PROGRESS: allTasks.filter(task => task.status === "IN_PROGRESS"),
    IN_REVIEW: allTasks.filter(task => task.status === "IN_REVIEW"),
    DONE: allTasks.filter(task => task.status === "DONE"),
  };

  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects & Tasks</h1>
        <div className="flex gap-2">
          <TaskForm projects={user.projects}>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </TaskForm>
          <ProjectForm>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </ProjectForm>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.projects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksByStatus.TODO.length + tasksByStatus.IN_PROGRESS.length + tasksByStatus.IN_REVIEW.length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.DONE.length}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Task Board</CardTitle>
          <CardDescription>Drag and drop tasks to update their status</CardDescription>
        </CardHeader>        <CardContent>
          <KanbanBoard 
            tasks={allTasks}
            projects={user.projects}
            employees={user.employees}
          />
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user.projects.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <ProjectForm>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </ProjectForm>
            </CardContent>
          </Card>
        ) : (
          user.projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <ProjectForm project={project}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </ProjectForm>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tasks: {project.tasks.length}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {project.tasks.filter(t => t.status === "TODO").length} To Do
                      </Badge>
                      <Badge variant="default">
                        {project.tasks.filter(t => t.status === "IN_PROGRESS").length} In Progress
                      </Badge>
                      <Badge variant="outline">
                        {project.tasks.filter(t => t.status === "DONE").length} Done
                      </Badge>
                    </div>
                  </div>
                  
                  {project.tasks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Tasks:</h4>
                      {project.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center justify-between text-sm">
                          <span className="truncate">{task.title}</span>
                          <Badge 
                            variant={
                              task.status === "DONE" ? "default" :
                              task.status === "IN_PROGRESS" ? "secondary" :
                              "outline"
                            }
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
