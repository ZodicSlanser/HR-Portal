"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "./shared";
import { createSuccessResponse, createErrorResponse, type ActionResponse } from "@/lib/types/action-types";

// Type aliases
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

// Schema validation
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  projectId: z.string().min(1, "Project is required"),
});

export async function createTask(formData: FormData): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
      const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as TaskPriority,
      projectId: formData.get("projectId") as string,
    };

    const validatedData = taskSchema.parse(data);
    
    // Extract assigned employees
    const assignedEmployees: string[] = [];
    let index = 0;
    while (formData.has(`assignedEmployees[${index}]`)) {
      const employeeId = formData.get(`assignedEmployees[${index}]`) as string;
      if (employeeId) assignedEmployees.push(employeeId);
      index++;
    }
    
    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: validatedData.projectId, userId },
    });
    
    if (!project) {
      return createErrorResponse("Project not found");
    }

    // Verify all employees belong to the user
    if (assignedEmployees.length > 0) {
      const employeeCount = await prisma.employee.count({
        where: {
          id: { in: assignedEmployees },
          userId
        }
      });
      
      if (employeeCount !== assignedEmployees.length) {
        return createErrorResponse("One or more employees not found");
      }
    }    // Create task with assignments in a transaction
    await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        projectId: validatedData.projectId,
        status: "TODO",
        assignments: {
          create: assignedEmployees.map(employeeId => ({
            employeeId
          }))
        }
      },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error creating task:", error);
    return createErrorResponse("Failed to create task");
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    // Verify task belongs to user's project
    const task = await prisma.task.findFirst({
      where: { 
        id: taskId,
        project: { userId }
      },
    });
    
    if (!task) {
      return createErrorResponse("Task not found");
    }
      await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error updating task status:", error);
    return createErrorResponse("Failed to update task status");
  }
}

export async function updateTask(taskId: string, updates: {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    // Verify task belongs to user's project
    const task = await prisma.task.findFirst({
      where: { 
        id: taskId,
        project: { userId }
      },
    });
    
    if (!task) {
      return createErrorResponse("Task not found");
    }
      // Filter out undefined values to only update provided fields
    const updateData: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      status?: TaskStatus;
    } = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.status !== undefined) updateData.status = updates.status;

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error updating task:", error);
    return createErrorResponse("Failed to update task");
  }
}

export async function deleteTask(id: string): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    // Verify task belongs to user's project
    const task = await prisma.task.findFirst({
      where: { 
        id,
        project: { userId }
      },
    });
    
    if (!task) {
      return createErrorResponse("Task not found");
    }
    
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error deleting task:", error);
    return createErrorResponse("Failed to delete task");
  }
}

export async function assignTaskToEmployee(taskId: string, employeeId: string): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    // Verify task belongs to user's project
    const task = await prisma.task.findFirst({
      where: { 
        id: taskId,
        project: { userId }
      },
    });
    
    if (!task) {
      return createErrorResponse("Task not found");
    }
    
    // Verify employee belongs to user
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, userId },
    });
    
    if (!employee) {
      return createErrorResponse("Employee not found");
    }
    
    // Check if assignment already exists
    const existingAssignment = await prisma.taskAssignment.findUnique({
      where: {
        taskId_employeeId: {
          taskId,
          employeeId,
        },
      },
    });
    
    if (existingAssignment) {
      return createErrorResponse("Task is already assigned to this employee");
    }
      await prisma.taskAssignment.create({
      data: {
        taskId,
        employeeId,
      },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error assigning task:", error);
    return createErrorResponse("Failed to assign task to employee");
  }
}

export async function removeTaskAssignment(taskId: string, employeeId: string): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    // Verify task belongs to user's project
    const task = await prisma.task.findFirst({
      where: { 
        id: taskId,
        project: { userId }
      },
    });
    
    if (!task) {
      return createErrorResponse("Task not found");
    }
    
    await prisma.taskAssignment.delete({
      where: {
        taskId_employeeId: {
          taskId,
          employeeId,
        },
      },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error removing task assignment:", error);
    return createErrorResponse("Failed to remove task assignment");
  }
}
