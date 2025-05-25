import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Production database setup endpoint called");
    
    const databaseUrl = process.env.DATABASE_URL;
    console.log("Database URL type:", databaseUrl?.startsWith('postgres') ? 'PostgreSQL' : databaseUrl?.startsWith('mysql') ? 'MySQL' : 'SQLite');
    
    if (!databaseUrl) {
      return NextResponse.json(
        {
          status: "error",
          message: "DATABASE_URL environment variable not set",
          suggestion: "Please set up a production database (Vercel Postgres recommended)",
          setup_instructions: {
            vercel_postgres: "Run 'vercel storage create postgres' in your terminal",
            manual_setup: "Add DATABASE_URL to your Vercel environment variables"
          }
        },
        { status: 500 }
      );
    }
    
    // Check if it's SQLite (not suitable for production)
    if (databaseUrl.startsWith('file:') || databaseUrl.includes('.db')) {
      return NextResponse.json(
        {
          status: "error",
          message: "SQLite database detected in production environment",
          error: "SQLite is not compatible with Vercel's serverless environment",
          solution: "Switch to a hosted database",
          recommendations: [
            "Vercel Postgres (easiest): Run 'vercel storage create postgres'",
            "Railway: https://railway.app/",
            "PlanetScale: https://planetscale.com/",
            "Supabase: https://supabase.com/"
          ]
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: "info",
      message: "Production database configuration detected",
      databaseType: databaseUrl.startsWith('postgres') ? 'PostgreSQL' : 'Other',
      nextSteps: [
        "Ensure your database is properly migrated",
        "Run database migrations if needed",
        "Seed the database with demo data"
      ]
    });
    
  } catch (error) {
    console.error("Production setup error:", error);
    
    return NextResponse.json(
      {
        status: "error",
        message: "Production database setup check failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
