import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Database test endpoint called");
    
    // Test database connection
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("Database connection successful");
    
    // Test basic query
    console.log("Testing user count query...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    // Test fetching a user
    console.log("Testing user fetch...");
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    console.log("Sample user:", users[0]);
    
    return NextResponse.json({
      status: "success",
      message: "Database is working correctly",
      data: {
        userCount,
        sampleUser: users[0],
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("Database test error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
        nodeEnv: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
