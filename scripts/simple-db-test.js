console.log('🔍 Demo Database Status Check');
console.log('Database file exists:', require('fs').existsSync('prisma/dev.db'));
console.log('File size:', require('fs').statSync('prisma/dev.db').size, 'bytes');

async function testConnection() {
  try {    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const userCount = await prisma.user.count();
    console.log('✅ Connected to database successfully');
    console.log('📊 User count:', userCount);
    
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
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
