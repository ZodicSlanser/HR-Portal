#!/usr/bin/env node

/**
 * Production Database Setup Script
 * This script prepares the application for production deployment with PostgreSQL
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up production database configuration...');

// 1. Switch to production schema
const productionSchemaPath = path.join(__dirname, '../prisma/schema.production.prisma');
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');

if (fs.existsSync(productionSchemaPath)) {
    console.log('📝 Switching to PostgreSQL schema...');
    const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
    fs.writeFileSync(schemaPath, productionSchema);
    console.log('✅ Schema updated to PostgreSQL');
} else {
    console.error('❌ Production schema file not found!');
    process.exit(1);
}

// 2. Update package.json build script
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts['vercel-build'] = 'prisma generate && prisma db push && prisma db seed && next build';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Updated build script for production');

// 3. Create migration for PostgreSQL
console.log('📋 Production setup complete!');
console.log('');
console.log('🔧 Next steps:');
console.log('1. Set up Vercel Postgres database');
console.log('2. Update DATABASE_URL in Vercel environment variables');
console.log('3. Add DIRECT_URL environment variable (same as DATABASE_URL for Postgres)');
console.log('4. Deploy to Vercel');
console.log('');
console.log('💡 Database setup instructions:');
console.log('   - Go to Vercel Dashboard → Your Project → Storage');
console.log('   - Create new Postgres database');
console.log('   - Copy DATABASE_URL and set both DATABASE_URL and DIRECT_URL');
