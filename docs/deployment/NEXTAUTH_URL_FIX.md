# 🔧 Quick Fix: NEXTAUTH_URL Environment Variable Error

## ✅ Problem Fixed!

The error `Environment Variable "NEXTAUTH_URL" references Secret "nextauth_url", which does not exist` has been resolved.

**Issue:** The `vercel.json` file was configured to use Vercel secrets (with `@` prefix) instead of regular environment variables.

**Solution:** Removed the environment variable references from `vercel.json` and will set them directly in Vercel dashboard.

## 🚀 Corrected Deployment Steps

### 1. In Vercel Dashboard - Environment Variables Tab

Add these **3 environment variables** (NOT secrets):

| Variable Name | Value | Environment |
|---------------|--------|-------------|
| `NEXTAUTH_SECRET` | `v6Xp3HjZzK0NS7WWDJ2xA6CoU50Q2hUhDHDVlGeF9aA=` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://your-project-name-git-main.vercel.app` | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |
| `DATABASE_URL` | `file:./prisma/dev.db` | All environments |

### 2. Important Notes:

- **Don't use the "Secrets" tab** - use the "Environment Variables" tab
- **Replace `your-project-name`** with your actual Vercel project name
- **You can set NEXTAUTH_URL to a placeholder first**, then update it after seeing your actual URL

### 3. Two-Step Deployment Process:

**Step 1: Initial Deploy**
1. Set `NEXTAUTH_URL` to `https://placeholder.vercel.app` temporarily
2. Set the other variables as shown above
3. Click "Deploy"

**Step 2: Update After Deploy**
1. Note your actual Vercel URL (e.g., `https://tech-assessment-abc123.vercel.app`)
2. Update `NEXTAUTH_URL` to your real URL
3. Redeploy

### 4. Test Login After Deployment:

```
Email: demo@blurr.so
Password: demo123
```

## ✅ Ready to Deploy!

The code has been fixed and pushed to GitHub. You can now proceed with deployment in Vercel without the environment variable error.
