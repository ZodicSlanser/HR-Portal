"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createTask } from "@/lib/actions";
import { X, UserPlus } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  projectId: z.string().min(1, "Project is required"),
  assignedEmployees: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface Project {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
}

interface TaskFormProps {
  children: React.ReactNode;
  projects: Project[];
  employees?: Employee[];
}

export default function TaskForm({ children, projects, employees = [] }: Readonly<TaskFormProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      projectId: "",
      assignedEmployees: [],
    },
  });
  async function onSubmit(data: TaskFormData) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("priority", data.priority);
      formData.append("projectId", data.projectId);
      
      // Add selected employees
      selectedEmployees.forEach((employeeId, index) => {
        formData.append(`assignedEmployees[${index}]`, employeeId);
      });

      const result = await createTask(formData);

      if (result.success) {
        setIsOpen(false);
        form.reset();
        setSelectedEmployees([]);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEmployeeSelect = (employeeId: string) => {
    if (!selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    }
  };

  const handleEmployeeRemove = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
  };

  const priorityColors = {
    LOW: "text-blue-600",
    MEDIUM: "text-yellow-600", 
    HIGH: "text-orange-600",
    URGENT: "text-red-600",
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to one of your projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Design homepage layout" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the task in detail..."
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          <span className={priorityColors[priority]}>
                            {priority}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Assignment Section */}
            {employees.length > 0 && (
              <div className="space-y-3">                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">Assign Team Members</FormLabel>
                  <span className="text-xs text-gray-500">
                    {selectedEmployees.length} selected
                  </span>
                </div>
                
                {/* Employee Selection Dropdown */}
                <Select onValueChange={handleEmployeeSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team members to assign..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees
                      .filter(employee => !selectedEmployees.includes(employee.id))
                      .map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-blue-600" />
                            <span>{employee.name}</span>
                            <span className="text-xs text-gray-500">({employee.employeeId})</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Selected Employees */}
                {selectedEmployees.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700">Selected Team Members:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployees.map((employeeId) => {
                        const employee = employees.find(e => e.id === employeeId);
                        if (!employee) return null;
                        
                        return (
                          <Badge 
                            key={employeeId} 
                            variant="secondary" 
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            <span>{employee.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-blue-300"
                              onClick={() => handleEmployeeRemove(employeeId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
