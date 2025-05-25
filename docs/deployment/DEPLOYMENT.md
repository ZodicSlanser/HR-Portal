# Vercel Deployment Guide

## Development vs Production Database Strategy

### Development Database (Committed)
- **File**: `prisma/dev.db` (SQLite)
- **Purpose**: Immediate functionality testing with demo data
- **Committed**: ✅ Yes (for easy setup and demonstration)
- **Contains**: Sample users, employees, projects, salary records

### Production Database (Cloud-hosted)
- **Type**: PostgreSQL, MySQL, or other cloud database
- **Purpose**: Scalable, secure production data storage
- **Committed**: ❌ No (connection via DATABASE_URL environment variable)
- **Setup**: Choose from Vercel Postgres, Railway, PlanetScale, etc.

### Migration Strategy
The application automatically:
1. Uses SQLite (`dev.db`) in development
2. Connects to cloud database in production via `DATABASE_URL`
3. Runs migrations during deployment (`prisma migrate deploy`)

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Vercel Account**: Create account at [vercel.com](https://vercel.com)
3. **Database**: Set up a production database (see Database Setup section)

## Quick Deployment Steps

### 1. Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure build settings

### 2. Configure Environment Variables

Add these environment variables in Vercel dashboard:

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
```

### 3. Database Setup Options

#### Option A: Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
npm i @vercel/postgres

# Update DATABASE_URL in Vercel dashboard
DATABASE_URL=postgres://default:password@hostname:5432/verceldb?sslmode=require
```

#### Option B: Railway
```bash
# Create Railway account and database
# Update DATABASE_URL format:
DATABASE_URL=postgresql://username:password@hostname:port/database
```

#### Option C: PlanetScale
```bash
# Create PlanetScale database
# Update DATABASE_URL format:
DATABASE_URL=mysql://username:password@hostname:port/database?sslaccept=strict
```

### 4. GitHub Actions Setup

#### Required Secrets in GitHub Repository

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

#### Getting Vercel Credentials

1. **VERCEL_TOKEN**:
   - Go to Vercel → Settings → Tokens
   - Create new token with full access

2. **VERCEL_ORG_ID & VERCEL_PROJECT_ID**:
   ```bash
   # Install Vercel CLI locally
   npm i -g vercel

   # Login and link project
   vercel login
   vercel link

   # View project settings
   cat .vercel/project.json
   ```

### 5. Database Migration

#### One-time Setup
```bash
# Generate Prisma client
npx prisma generate

# Run initial migration
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed
```

#### Future Migrations
- Migrations will run automatically via GitHub Actions
- Or manually: `npx prisma migrate deploy` in Vercel dashboard

## Environment Variables Reference

### Required Variables
```bash
# Authentication
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Database
DATABASE_URL=your-production-database-connection-string
```

### Optional Variables
```bash
# Analytics (if added)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Error Tracking (if added)
SENTRY_DSN=your-sentry-dsn
```

## Build Configuration

The project includes:
- ✅ `vercel.json` - Vercel-specific configuration
- ✅ GitHub Actions workflows for CI/CD
- ✅ Automatic database migrations
- ✅ TypeScript and ESLint checks
- ✅ Security headers and optimizations

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployments and performance
- View build logs and errors
- Manage environment variables

### GitHub Actions
- Automatic deployments on push to main
- Preview deployments for pull requests
- Code quality checks and security scans

## Troubleshooting

### Common Issues

1. **Database Connection**:
   - Verify DATABASE_URL format matches your provider
   - Ensure database allows external connections
   - Check SSL requirements

2. **Build Failures**:
   - Review build logs in Vercel dashboard
   - Ensure all environment variables are set
   - Check TypeScript and lint errors

3. **Authentication Issues**:
   - Verify NEXTAUTH_URL matches your deployment URL
   - Ensure NEXTAUTH_SECRET is set and secure
   - Check CSRF settings if needed

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## Performance Optimization

The deployment includes:
- Image optimization
- Bundle analysis
- Security headers
- CDN distribution
- Automatic compression

## Cost Estimation

### Vercel Pro Plan ($20/month):
- Unlimited bandwidth
- Advanced analytics
- Team collaboration
- Custom domains

### Database Costs:
- **Vercel Postgres**: ~$20-50/month
- **Railway**: ~$5-20/month  
- **PlanetScale**: Free tier available, ~$29/month pro

## Security Checklist

- ✅ Environment variables secured
- ✅ Database connections encrypted
- ✅ Security headers configured
- ✅ CSRF protection enabled
- ✅ Authentication properly configured
- ✅ API routes protected
