const { PrismaClient } = require('@prisma/client');
const { compare } = require('bcryptjs');

async function testLogin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing demo user credentials...\n');
    
    const user = await prisma.user.findUnique({
      where: { email: 'demo@blurr.so' }
    });
    
    if (!user) {
      console.log('❌ User demo@blurr.so not found in database');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password
    });
    
    // Test the password that should work (demo123)
    const isDemo123Valid = await compare('demo123', user.password);
    console.log('🔐 Password "demo123" valid:', isDemo123Valid ? '✅ YES' : '❌ NO');
    
    // Test the old password (password123) 
    const isPassword123Valid = await compare('password123', user.password);
    console.log('🔐 Password "password123" valid:', isPassword123Valid ? '✅ YES' : '❌ NO');
    
    // Test admin123 for admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@company.com' }
    });
    
    if (adminUser) {
      const isAdminValid = await compare('admin123', adminUser.password);
      console.log('🔐 Admin password "admin123" valid:', isAdminValid ? '✅ YES' : '❌ NO');
    }
    
    console.log('\n📋 Correct login credentials:');
    console.log('Email: demo@blurr.so');
    console.log('Password:', isDemo123Valid ? 'demo123' : 'password123');
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
