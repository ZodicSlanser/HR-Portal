"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "./shared";
import { createSuccessResponse, createErrorResponse, type ActionResponse } from "@/lib/types/action-types";

// Schema validation
const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  basicSalary: z.number().min(0, "Salary must be positive"),
});

export async function createEmployee(formData: FormData): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      employeeId: formData.get("employeeId") as string,
      joiningDate: formData.get("joiningDate") as string,
      basicSalary: parseFloat(formData.get("basicSalary") as string),
    };    const validatedData = employeeSchema.parse(data);
    
    await prisma.employee.create({
      data: {
        ...validatedData,
        joiningDate: new Date(validatedData.joiningDate),
        userId,
      },
    });

    revalidatePath("/dashboard/employees");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error creating employee:", error);
    return createErrorResponse("Failed to create employee");
  }
}

export async function updateEmployee(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      employeeId: formData.get("employeeId") as string,
      joiningDate: formData.get("joiningDate") as string,
      basicSalary: parseFloat(formData.get("basicSalary") as string),
    };    const validatedData = employeeSchema.parse(data);
    
    await prisma.employee.update({
      where: { id, userId },
      data: {
        ...validatedData,
        joiningDate: new Date(validatedData.joiningDate),
      },
    });

    revalidatePath("/dashboard/employees");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error updating employee:", error);
    return createErrorResponse("Failed to update employee");
  }
}

export async function deleteEmployee(id: string): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    await prisma.employee.delete({
      where: { id, userId },
    });

    revalidatePath("/dashboard/employees");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error deleting employee:", error);
    return createErrorResponse("Failed to delete employee");
  }
}
