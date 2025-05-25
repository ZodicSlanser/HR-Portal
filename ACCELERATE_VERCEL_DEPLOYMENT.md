# 🚀 Prisma Accelerate + Vercel Deployment Fix

## ❌ Current Issue
```
InvalidDatasourceError: Error validating datasource `db`: 
the URL must start with the protocol `prisma://` or `prisma+postgres://`
```

## ✅ SOLUTION: Fixed - Dual URL Configuration + Seed Script Fix

The issue was:
1. Missing `directUrl` in schema ✅ **FIXED**
2. Seed script using Accelerate (needs direct connection) ✅ **FIXED**

## 🔧 Step 1: Update Vercel Environment Variables

Go to your Vercel dashboard and set these environment variables:

### **DATABASE_URL** (Prisma Accelerate)
```
prisma://accelerate.prisma-data.net/?api_key=YOUR_ACCELERATE_API_KEY
```

### **DIRECT_URL** (Direct PostgreSQL)
This should be your original PostgreSQL connection string:
```
postgresql://username:password@hostname:5432/database
```

## 📝 Step 2: Where to Get Your URLs

### **For DATABASE_URL (Accelerate):**
1. Go to [Prisma Data Platform](https://cloud.prisma.io/)
2. Select your project
3. Go to "Accelerate" tab
4. Copy the connection string that starts with `prisma://`

### **For DIRECT_URL (Direct PostgreSQL):**

#### If using Vercel Postgres:
1. Go to Vercel Dashboard → Your Project → Storage
2. Click your Postgres database
3. Copy the **POSTGRES_URL** (not the Prisma one)

#### If using Railway:
1. Go to Railway dashboard
2. Click your PostgreSQL service
3. Variables tab → Copy DATABASE_URL

#### If using Supabase:
1. Supabase Dashboard → Settings → Database
2. Copy Connection String (Transaction mode)

#### If using PlanetScale:
1. PlanetScale Dashboard → Your database
2. Connect → Copy the connection string

## 🚀 Step 3: Deploy

Once both environment variables are set in Vercel:

```bash
git add .
git commit -m "Fix: Add directUrl for Prisma Accelerate deployment"
git push
```

## 🎯 What This Fixes

- ✅ **DATABASE_URL**: Used by your app for fast queries via Accelerate
- ✅ **DIRECT_URL**: Used by `prisma db push` during build for schema sync
- ✅ **Build Process**: No more validation errors during deployment
- ✅ **Performance**: Keeps all Accelerate benefits (connection pooling, caching)

## 🔍 Verification

After deployment, your app should:
1. ✅ Build successfully on Vercel
2. ✅ Run schema operations via DIRECT_URL
3. ✅ Execute queries via DATABASE_URL (Accelerate)
4. ✅ Benefit from connection pooling and caching

---

**🚨 Make sure both environment variables are set in Vercel before deploying!**
