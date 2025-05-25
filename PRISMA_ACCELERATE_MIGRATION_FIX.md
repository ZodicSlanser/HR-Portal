# 🔧 PRISMA ACCELERATE + DIRECT URL SETUP

## ✅ Current Status
- ✅ **Prisma Accelerate**: Configured with connection pooling URL
- ⚠️ **Missing DIRECT_URL**: Required for migrations and schema changes

## 🚀 IMMEDIATE FIX - Get Your DIRECT_URL

### **Where to Find Your Direct PostgreSQL URL:**

#### **Option 1: Vercel Postgres**
1. Go to https://vercel.com/dashboard
2. Select project: `hr-portal-five-theta`
3. Navigate to **Storage** → Your Postgres database
4. Copy the **`POSTGRES_URL`** (NOT the Prisma one)
5. Use this as your `DIRECT_URL`

#### **Option 2: Railway**
1. Go to your Railway dashboard
2. Click your PostgreSQL service
3. Go to **Variables** tab
4. Copy the `DATABASE_URL` value
5. Use this as your `DIRECT_URL`

#### **Option 3: Supabase**
1. Go to your Supabase dashboard
2. Go to **Settings** → **Database**
3. Copy the **Connection String** (Transaction mode)
4. Use this as your `DIRECT_URL`

## 🔧 UPDATE YOUR .env FILE

Replace the placeholder in your `.env` file:

```env
# Replace this line:
DIRECT_URL="postgresql://username:password@hostname:5432/database"

# With your actual database URL, for example:
DIRECT_URL="postgresql://postgres:yourpassword@db.abc123.supabase.co:5432/postgres"
```

## 🎯 THEN RUN MIGRATION

Once you've updated the `DIRECT_URL`:

```bash
npx prisma migrate dev --name init
```

## 📋 EXPLANATION

- **DATABASE_URL**: Prisma Accelerate (fast queries with connection pooling)
- **DIRECT_URL**: Direct database connection (required for schema migrations)

This setup gives you the best of both worlds:
- ⚡ **Fast queries** via Accelerate
- 🔧 **Schema management** via direct connection

---

**🚨 You need to add the DIRECT_URL before running any migrations!**
