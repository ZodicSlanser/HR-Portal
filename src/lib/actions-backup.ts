"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema validations
const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  basicSalary: z.number().min(0, "Salary must be positive"),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  projectId: z.string().min(1, "Project is required"),
});

const salaryRecordSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  bonus: z.number().min(0).default(0),
  deduction: z.number().min(0).default(0),
});

// Helper function to get current user ID
async function getCurrentUserId() {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect("/login");
  }
  
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  
  if (!dbUser) {
    redirect("/login");
  }
  
  return dbUser.id;
}

// Employee Actions
export async function createEmployee(formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      employeeId: formData.get("employeeId") as string,
      joiningDate: formData.get("joiningDate") as string,
      basicSalary: parseFloat(formData.get("basicSalary") as string),
    };

    const validatedData = employeeSchema.parse(data);
    
    const employee = await prisma.employee.create({
      data: {
        ...validatedData,
        joiningDate: new Date(validatedData.joiningDate),
        userId,
      },
    });

    revalidatePath("/dashboard/employees");
    return { success: true, data: employee };
  } catch (error) {
    console.error("Error creating employee:", error);
    return { success: false, error: "Failed to create employee" };
  }
}

export async function updateEmployee(id: string, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      employeeId: formData.get("employeeId") as string,
      joiningDate: formData.get("joiningDate") as string,
      basicSalary: parseFloat(formData.get("basicSalary") as string),
    };

    const validatedData = employeeSchema.parse(data);
    
    const employee = await prisma.employee.update({
      where: { id, userId },
      data: {
        ...validatedData,
        joiningDate: new Date(validatedData.joiningDate),
      },
    });

    revalidatePath("/dashboard/employees");
    return { success: true, data: employee };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: "Failed to update employee" };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const userId = await getCurrentUserId();
    
    await prisma.employee.delete({
      where: { id, userId },
    });

    revalidatePath("/dashboard/employees");
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: "Failed to delete employee" };
  }
}

// Project Actions
export async function createProject(formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const validatedData = projectSchema.parse(data);
    
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const validatedData = projectSchema.parse(data);
    
    const project = await prisma.project.update({
      where: { id, userId },
      data: validatedData,
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    const userId = await getCurrentUserId();
    
    await prisma.project.delete({
      where: { id, userId },
    });

    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

// Task Actions
export async function createTask(formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      projectId: formData.get("projectId") as string,
    };

    const validatedData = taskSchema.parse(data);
    
    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: validatedData.projectId, userId },
    });
    
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    
    const task = await prisma.task.create({
      data: validatedData,
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE") {
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
      return { success: false, error: "Task not found" };
    }
    
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: updatedTask };  } catch (error) {
    console.error("Error updating task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function updateTask(taskId: string, updates: {
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
}) {
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
      return { success: false, error: "Task not found" };
    }    // Filter out undefined values to only update provided fields
    const updateData: {
      title?: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
      status?: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    } = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.status !== undefined) updateData.status = updates.status;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(id: string) {
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
      return { success: false, error: "Task not found" };
    }
    
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

// Salary Actions
export async function createOrUpdateSalaryRecord(formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      employeeId: formData.get("employeeId") as string,
      month: parseInt(formData.get("month") as string),
      year: parseInt(formData.get("year") as string),
      bonus: parseFloat(formData.get("bonus") as string) || 0,
      deduction: parseFloat(formData.get("deduction") as string) || 0,
    };

    const validatedData = salaryRecordSchema.parse(data);
    
    // Verify employee belongs to user
    const employee = await prisma.employee.findFirst({
      where: { id: validatedData.employeeId, userId },
    });
    
    if (!employee) {
      return { success: false, error: "Employee not found" };
    }    const salaryRecord = await prisma.salaryRecord.upsert({
      where: {
        employeeId_month_year: {
          employeeId: validatedData.employeeId,
          month: validatedData.month,
          year: validatedData.year,
        },
      },
      update: {
        basicSalary: employee.basicSalary,
        bonus: validatedData.bonus,
        deduction: validatedData.deduction,
      },
      create: {
        ...validatedData,
        basicSalary: employee.basicSalary,
      },
    });

    revalidatePath("/dashboard/salary");
    return { success: true, data: salaryRecord };
  } catch (error) {
    console.error("Error creating/updating salary record:", error);
    return { success: false, error: "Failed to save salary record" };
  }
}

// Alias for createOrUpdateSalaryRecord for consistency
export const createSalaryRecord = createOrUpdateSalaryRecord;

// Update salary record
export async function updateSalaryRecord(recordId: string, updates: {
  bonus?: number;
  deduction?: number;
}) {
  try {
    const userId = await getCurrentUserId();
    
    // Verify salary record belongs to user's employee
    const salaryRecord = await prisma.salaryRecord.findFirst({
      where: { 
        id: recordId,
        employee: { userId }
      },
      include: { employee: true }
    });
    
    if (!salaryRecord) {
      return { success: false, error: "Salary record not found" };
    }
    
    const updatedRecord = await prisma.salaryRecord.update({
      where: { id: recordId },
      data: {
        bonus: updates.bonus ?? salaryRecord.bonus,
        deduction: updates.deduction ?? salaryRecord.deduction,
      },
    });

    revalidatePath("/dashboard/salary");
    return { success: true, data: updatedRecord };
  } catch (error) {
    console.error("Error updating salary record:", error);
    return { success: false, error: "Failed to update salary record" };
  }
}

// Delete salary record
export async function deleteSalaryRecord(recordId: string) {
  try {
    const userId = await getCurrentUserId();
    
    // Verify salary record belongs to user's employee
    const salaryRecord = await prisma.salaryRecord.findFirst({
      where: { 
        id: recordId,
        employee: { userId }
      },
    });
    
    if (!salaryRecord) {
      return { success: false, error: "Salary record not found" };
    }
    
    await prisma.salaryRecord.delete({
      where: { id: recordId },
    });

    revalidatePath("/dashboard/salary");
    return { success: true };
  } catch (error) {
    console.error("Error deleting salary record:", error);
    return { success: false, error: "Failed to delete salary record" };
  }
}

// Task Assignment Actions
export async function assignTaskToEmployee(taskId: string, employeeId: string) {
  try {
    const userId = await getCurrentUserId();
    
    // Verify both task and employee belong to user
    const task = await prisma.task.findFirst({
      where: { id: taskId, project: { userId } },
    });
    
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, userId },
    });
    
    if (!task || !employee) {
      return { success: false, error: "Task or employee not found" };
    }
    
    const assignment = await prisma.taskAssignment.create({
      data: {
        taskId,
        employeeId,
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: assignment };
  } catch (error) {
    console.error("Error assigning task:", error);
    return { success: false, error: "Failed to assign task" };
  }
}

export async function removeTaskAssignment(taskId: string, employeeId: string) {
  try {
    const userId = await getCurrentUserId();
    
    // Verify both task and employee belong to user
    const task = await prisma.task.findFirst({
      where: { id: taskId, project: { userId } },
    });
    
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, userId },
    });
    
    if (!task || !employee) {
      return { success: false, error: "Task or employee not found" };
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
    return { success: true };
  } catch (error) {
    console.error("Error removing task assignment:", error);
    return { success: false, error: "Failed to remove task assignment" };
  }
}
