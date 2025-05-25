import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import("@/lib/prisma");
    
    console.log("Registration endpoint called");
    
    const body = await req.json();
    console.log("Request body:", { ...body, password: "[REDACTED]" });
    
    const { name, email, password } = body;
    
    // Validate input
    if (!name || !email || !password) {
      console.log("Validation failed: missing fields");
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    console.log("Checking for existing user...");
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    console.log("Hashing password...");
    // Hash password
    const hashedPassword = await hash(password, 10);

    console.log("Creating new user...");
    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log("User created successfully:", user.id);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}