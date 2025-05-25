"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "./shared";
import { createSuccessResponse, createErrorResponse, type ActionResponse } from "@/lib/types/action-types";

// Schema validation
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export async function createProject(formData: FormData): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };    const validatedData = projectSchema.parse(data);
    
    await prisma.project.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        userId,
      },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error creating project:", error);
    return createErrorResponse("Failed to create project");
  }
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };    const validatedData = projectSchema.parse(data);
    
    await prisma.project.update({
      where: { id, userId },
      data: validatedData,
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error updating project:", error);
    return createErrorResponse("Failed to update project");
  }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
  try {
    const userId = await getCurrentUserId();
    
    await prisma.project.delete({
      where: { id, userId },
    });

    revalidatePath("/dashboard/projects");
    return createSuccessResponse();
  } catch (error) {
    console.error("Error deleting project:", error);
    return createErrorResponse("Failed to delete project");
  }
}
