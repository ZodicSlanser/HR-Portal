# 🔧 SQLite Production Database Error - IMMEDIATE FIX

## ❌ **Current Issue**
```
"Error code 14: Unable to open the database file"
```

**Cause:** SQLite database files cannot be read in Vercel's serverless environment due to filesystem restrictions.

## 🚀 **IMMEDIATE SOLUTIONS**

### **Option 1: Vercel Postgres (Fastest - 5 minutes)**

**Step 1:** Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2:** Setup database
```bash
vercel login
vercel link
vercel storage create postgres
```

**Step 3:** Redeploy
The DATABASE_URL will be automatically added. Just redeploy your app!

### **Option 2: Railway Database (Free)**

1. **Go to:** https://railway.app/
2. **Create account** and new project
3. **Add PostgreSQL** service
4. **Copy DATABASE_URL** from dashboard
5. **Add to Vercel** environment variables
6. **Redeploy**

### **Option 3: Supabase (Free)**

1. **Go to:** https://supabase.com/
2. **Create new project**
3. **Settings → Database**
4. **Copy connection string**
5. **Add to Vercel** environment variables

## 🔄 **Migration Process**

Your Prisma schema already supports PostgreSQL! When you switch:

1. **Database URL** changes from `file:./dev.db` to `postgresql://...`
2. **Prisma automatically** detects PostgreSQL
3. **Migrations run** automatically during deployment
4. **Demo data** gets seeded automatically

## ⚡ **Quick Test Commands**

Run this locally to test your database setup:
```bash
node scripts/fix-production-database.js
```

## 🎯 **Expected Timeline**

- **Vercel Postgres:** 5 minutes setup
- **Railway:** 10 minutes setup
- **Supabase:** 10 minutes setup
- **Redeploy time:** 2-3 minutes

## 📋 **Environment Variable Update**

In Vercel Dashboard → Settings → Environment Variables:

**Current:**
```
DATABASE_URL=file:./prisma/dev.db
```

**New (example):**
```
DATABASE_URL=postgresql://user:pass@host:5432/database
```

## ✅ **After Fix**

- ✅ Registration will work
- ✅ Login will work (demo@blurr.so / demo123)
- ✅ All 15 employees, 8 projects, 26 tasks will be available
- ✅ Full HR portal functionality

## 🚨 **Need Help?**

The fastest solution is **Vercel Postgres**. Run:
```bash
npm i -g vercel && vercel login && vercel link && vercel storage create postgres
```

Then redeploy! The demo data will be automatically seeded. 🎉
