# 🚀 Complete Vercel Deployment Walkthrough

## Step 1: Import Project from GitHub

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account (or create account)
   - Click "Add New Project"

2. **Import Your Repository**
   - Select "Import Git Repository"
   - Find your `tech-assessment` repository
   - Click "Import"

## Step 2: Configure Project Settings

1. **Framework Detection**
   - Vercel should auto-detect "Next.js"
   - Keep the default settings:
     - Framework Preset: `Next.js`
     - Root Directory: `./` (default)
     - Build Command: `npm run build` (default)
     - Output Directory: `.next` (default)

2. **Environment Variables Setup**
   Click "Environment Variables" and add these **REQUIRED** variables:

   ### 🔑 Required Environment Variables:

   ```bash
   # NextAuth Configuration (REQUIRED)
   NEXTAUTH_SECRET=generate-a-secure-32-character-secret-key-here
   NEXTAUTH_URL=https://your-project-name.vercel.app

   # Database (OPTIONAL - defaults to demo SQLite)
   DATABASE_URL=file:./prisma/dev.db
   ```

   ### 🔐 How to Generate NEXTAUTH_SECRET:
   
   **Option A: Online Generator**
   - Visit: https://generate-secret.vercel.app/32
   - Copy the generated secret
   
   **Option B: Command Line**
   ```bash
   openssl rand -base64 32
   ```
   
   **Option C: Use This Example Secret (FOR DEMO ONLY)**
   ```
   demo-secret-key-for-testing-replace-in-production-32chars
   ```

## Step 3: Deploy Your Application

1. **Click "Deploy"**
   - Vercel will start building your application
   - This process takes 2-3 minutes

2. **Build Process Will:**
   - Install dependencies (`npm install`)
   - Generate Prisma client
   - Run database migrations
   - Seed the database with demo data
   - Build the Next.js application

## Step 4: Fix NEXTAUTH_URL After First Deploy

1. **After deployment completes**, you'll get a URL like:
   ```
   https://tech-assessment-xyz123.vercel.app
   ```

2. **Update NEXTAUTH_URL:**
   - Go to Project Settings → Environment Variables
   - Edit the `NEXTAUTH_URL` variable
   - Change it to your actual Vercel URL
   - Example: `https://tech-assessment-xyz123.vercel.app`

3. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or make any small change and push to GitHub

## Step 5: Test Your Application

1. **Visit your live application**
2. **Test login with demo credentials:**
   ```
   Email: demo@blurr.so
   Password: demo123
   ```

3. **Verify features work:**
   - Dashboard loads with demo data
   - Employee management
   - Project and task management
   - Salary management
   - Chat interface

## 🔧 Troubleshooting Common Issues

### Issue: "NEXTAUTH_URL is not defined"
**Solution:** Add the environment variable in Vercel dashboard and redeploy

### Issue: "Database not found"
**Solution:** The demo SQLite database is included and should work automatically

### Issue: "Build fails"
**Solution:** Check the build logs in Vercel dashboard for specific errors

### Issue: "Authentication not working"
**Solution:** Ensure NEXTAUTH_URL matches your exact Vercel domain (no trailing slash)

## 📱 Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update NEXTAUTH_URL to use custom domain

## 🎯 Demo Login Credentials

After successful deployment, use these credentials to test:

```
Admin User:
Email: demo@blurr.so
Password: demo123

Manager User:
Email: admin@company.com  
Password: admin123

Regular User:
Email: manager@company.com
Password: manager123
```

## 📊 What You'll See After Deployment

- **15 Employees** across 6 departments
- **8 Projects** with realistic descriptions
- **26 Tasks** in various stages
- **45 Salary Records** across 3 months
- **Fully functional** HR management system

## 🔄 Automatic Deployments

- Every push to `main` branch will trigger automatic deployment
- GitHub Actions will run tests and quality checks
- Vercel will deploy if checks pass

## 📚 Next Steps After Deployment

1. **Production Database Setup** (optional):
   - Consider upgrading to PostgreSQL for production
   - Use Vercel Postgres, Railway, or PlanetScale
   - Update DATABASE_URL environment variable

2. **Custom Branding:**
   - Update company name and logo
   - Customize color scheme
   - Add your own content

3. **User Management:**
   - Add real user accounts
   - Import actual employee data
   - Configure proper access controls

---

🎉 **Congratulations!** Your Blurr HR Portal is now live and ready to use!
