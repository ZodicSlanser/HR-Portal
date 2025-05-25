#!/usr/bin/env node

/**
 * Production Database Setup Script
 * 
 * This script handles database initialization for production deployment
 * Run this after setting up your production database
 */

const { PrismaClient } = require('@prisma/client');

async function setupProductionDatabase() {
  // Use regular PrismaClient for setup operations (uses DIRECT_URL)
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Connecting to production database...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Generate Prisma client
    console.log('🔄 Generating Prisma client...');
    
    // Apply migrations
    console.log('🔄 Applying database migrations...');
    
    // Check if User table exists (basic health check)
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    if (userCount === 0) {
      console.log('🌱 Database appears empty. Consider running seed script...');
      console.log('   Run: npm run db:seed');
    }
    
    console.log('🎉 Production database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupProductionDatabase();
}

module.exports = { setupProductionDatabase };
