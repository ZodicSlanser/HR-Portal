#!/usr/bin/env node

/**
 * Check if demo database exists and has sample data
 * This script ensures the development database is ready for immediate use
 */

const path = require('path');
const fs = require('fs');

async function checkDemoData() {
  console.log('🔍 Checking demo database...');
  
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Development database not found at:', dbPath);
    console.log('💡 Run: npx prisma migrate dev --name init');
    process.exit(1);
  }

  console.log('✅ Database file exists at:', dbPath);
  
  // Check if the database has tables by reading the file size
  const stats = fs.statSync(dbPath);
  const fileSizeInBytes = stats.size;
  const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2);
  
  console.log(`📊 Database file size: ${fileSizeInKB} KB`);
  
  if (fileSizeInBytes < 1024) {
    console.log('⚠️  Database appears to be empty or very small');
    console.log('💡 Consider running: npx prisma db seed');
  } else {
    console.log('✅ Database appears to contain data');
  }
  // Try to import and use Prisma client
  try {    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Check if tables exist and have data
    const userCount = await prisma.user.count();
    const employeeCount = await prisma.employee.count();
    const projectCount = await prisma.project.count();
    const salaryCount = await prisma.salary.count();

    console.log('\n📊 Demo database stats:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Employees: ${employeeCount}`);
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Salaries: ${salaryCount}`);

    if (userCount === 0) {
      console.log('⚠️  No demo users found. Consider running: npm run db:seed');
    } else {
      console.log('✅ Demo database is ready with sample data!');
    }

    // List demo users
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: { email: true, name: true }
      });
      console.log('\n👤 Demo users:');
      users.forEach(user => {
        console.log(`   📧 ${user.email} (${user.name})`);
      });
    }

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.log('💡 This is normal if Prisma client is not generated yet');
    console.log('💡 Try running: npx prisma generate');
  }
}

checkDemoData();
