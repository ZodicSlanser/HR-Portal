#!/usr/bin/env node

/**
 * Simple database check for committed demo database
 */

const fs = require('fs');
const path = require('path');

async function checkDatabase() {
  console.log('🔍 Checking committed demo database...');
  
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Demo database not found');
    console.log('💡 Run: npm run db:seed');
    return;
  }

  const stats = fs.statSync(dbPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`✅ Database file: ${sizeKB} KB`);

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const [userCount, employeeCount, projectCount] = await Promise.all([
      prisma.user.count(),
      prisma.employee.count(),
      prisma.project.count()
    ]);

    console.log(`📊 Data: ${userCount} users, ${employeeCount} employees, ${projectCount} projects`);
    
    if (userCount > 0) {
      const user = await prisma.user.findFirst({ select: { email: true } });
      console.log(`👤 Demo login: ${user.email}`);
    }

    await prisma.$disconnect();
    console.log('✅ Demo database ready!');
  } catch (error) {
    console.log('⚠️  Database connection issue:', error.message);
    console.log('💡 Try: npx prisma generate');
  }
}

checkDatabase();