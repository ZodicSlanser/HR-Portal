"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "./shared";
import { createSuccessResponse, createErrorResponse, type ActionResponse } from "@/lib/types/action-types";

// Schema validation
const salaryRecordSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  bonus: z.number().min(0).default(0),
  deduction: z.number().min(0).default(0),
});

export async function createOrUpdateSalaryRecord(formData: FormData): Promise<ActionResponse> {
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
      return createErrorResponse("Employee not found");
    }
      await prisma.salaryRecord.upsert({
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
    return createSuccessResponse();
  } catch (error) {
    console.error("Error creating/updating salary record:", error);
    return createErrorResponse("Failed to save salary record");
  }
}

// Alias for createOrUpdateSalaryRecord for consistency
export const createSalaryRecord = createOrUpdateSalaryRecord;

export async function updateSalaryRecord(recordId: string, updates: {
  bonus?: number;
  deduction?: number;
}): Promise<ActionResponse> {
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
      return createErrorResponse("Salary record not found");
    }
      await prisma.salaryRecord.update({
      where: { id: recordId },
      data: {
        bonus: updates.bonus ?? salaryRecord.bonus,
        deduction: updates.deduction ?? salaryRecord.deduction,
      },
    });

    revalidatePath("/dashboard/salary");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error updating salary record:", error);
    return createErrorResponse("Failed to update salary record");
  }
}

export async function deleteSalaryRecord(recordId: string): Promise<ActionResponse> {
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
      return createErrorResponse("Salary record not found");
    }
    
    await prisma.salaryRecord.delete({
      where: { id: recordId },
    });

    revalidatePath("/dashboard/salary");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error deleting salary record:", error);
    return createErrorResponse("Failed to delete salary record");
  }
}

// Export salary data utilities
export interface SalaryExportData {
  employeeName: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  totalPaid: number;
  period: string;
}

export async function getSalaryDataForExport(userId?: string): Promise<SalaryExportData[]> {
  const currentUserId = userId || await getCurrentUserId();
  
  const salaryRecords = await prisma.salaryRecord.findMany({
    where: {
      employee: { userId: currentUserId }
    },
    include: {
      employee: true
    },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' },
      { employee: { name: 'asc' } }
    ]
  });

  return salaryRecords.map(record => ({
    employeeName: record.employee.name,
    employeeId: record.employee.employeeId,
    month: record.month,
    year: record.year,
    basicSalary: record.basicSalary,
    bonus: record.bonus,
    deduction: record.deduction,
    totalPaid: record.basicSalary + record.bonus - record.deduction,
    period: new Date(record.year, record.month - 1).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }));
}
