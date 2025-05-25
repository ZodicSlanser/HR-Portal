# 🔧 Registration 500 Error - Debugging Guide

## 🔍 **Diagnosis Steps**

The registration endpoint is returning a 500 error. I've added comprehensive debugging to help identify the issue.

### **Step 1: Test Database Connection**

After the new deployment finishes, visit this URL in your browser:
```
https://your-vercel-url.vercel.app/api/test-db
```

This will show you:
- ✅ Database connection status
- ✅ User count in database
- ✅ Sample user data
- ✅ Environment variable status

### **Step 2: Check Vercel Function Logs**

1. **Go to Vercel Dashboard**
2. **Click on your project**
3. **Go to "Functions" tab**
4. **Click on any API function**
5. **Check the "Logs" for detailed error messages**

### **Step 3: Test Registration with Debugging**

Try registering again and check the Function logs for detailed error messages. The registration endpoint now logs:
- Request received
- Input validation
- Database queries
- Detailed error information

## 🎯 **Most Likely Causes & Solutions**

### **Cause 1: Database Not Seeded**
**Symptoms:** Database connection works but no users exist
**Solution:** The build now includes automatic seeding

### **Cause 2: Missing Dependencies**
**Symptoms:** Import errors or bcryptjs issues
**Solution:** Dependencies should be automatically installed

### **Cause 3: Database File Path Issues**
**Symptoms:** "Database file not found" errors
**Solution:** Ensure DATABASE_URL is set to `file:./prisma/dev.db`

### **Cause 4: Prisma Client Not Generated**
**Symptoms:** Prisma client errors
**Solution:** Build process now includes `prisma generate`

## 🔧 **Quick Fixes to Try**

### **Fix 1: Check Environment Variables**
Ensure these are set in Vercel:
```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=v6Xp3HjZzK0NS7WWDJ2xA6CoU50Q2hUhDHDVlGeF9aA=
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
```

### **Fix 2: Force Redeploy**
1. Go to Vercel Dashboard
2. Go to "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. This will rebuild with the new debugging code

### **Fix 3: Check Build Logs**
1. In Vercel Dashboard, click on a deployment
2. Check "Build Logs" for any errors during:
   - `prisma generate`
   - `prisma migrate deploy`
   - `prisma db seed`
   - `next build`

## 📋 **Expected Behavior After Fix**

### **Database Test Endpoint Response:**
```json
{
  "status": "success",
  "message": "Database is working correctly",
  "data": {
    "userCount": 3,
    "sampleUser": {
      "id": "...",
      "email": "demo@blurr.so",
      "name": "Demo User"
    },
    "databaseUrl": "Set",
    "nodeEnv": "production"
  }
}
```

### **Registration Should Work With:**
- **Name:** Any name
- **Email:** Any valid email (not demo@blurr.so, admin@company.com, manager@company.com)
- **Password:** Any password

### **Login Should Work With:**
```
Email: demo@blurr.so
Password: demo123
```

## 🚨 **If Issue Persists**

1. **Share the response** from `/api/test-db`
2. **Share the Function logs** from Vercel dashboard
3. **Share the Build logs** if there are any errors

The enhanced debugging will pinpoint the exact issue and we can fix it quickly.

## ✅ **What's Fixed**

- ✅ Enhanced error logging in registration endpoint
- ✅ Database connection testing
- ✅ Build process includes database seeding
- ✅ Prisma client logging enabled
- ✅ Test endpoint for database diagnostics

After the deployment completes, test the `/api/test-db` endpoint first to verify database connectivity.
