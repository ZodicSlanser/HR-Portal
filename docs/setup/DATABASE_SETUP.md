# 🗄️ Database Configuration for Vercel Deployment

## Development Database (Committed to Git)

✅ **Status**: Ready and Seeded with Demo Data

### Database File Details
- **Location**: `prisma/dev.db`
- **Type**: SQLite database
- **Size**: ~114 KB
- **Status**: ✅ Committed to source control
- **Contains**: Complete demo dataset for immediate functionality testing

### Demo Data Included

#### 👤 Demo User
- **Email**: `demo@blurr.so`
- **Purpose**: For testing authentication and app functionality

#### 👨‍💼 Sample Employees
- **John Doe** (EMP001) - Basic Salary: $75,000
- **Jane Smith** (EMP002) - Basic Salary: $80,000  
- **Bob Johnson** (EMP003) - Basic Salary: $70,000

#### 📋 Sample Projects
- **Website Redesign** - Complete redesign of company website
- **Mobile App Development** - iOS and Android app development

#### ✅ Sample Tasks
- Design Homepage (HIGH priority, TODO)
- Implement User Authentication (URGENT, IN_PROGRESS)
- Setup Project Structure (MEDIUM, DONE)
- Design App UI (MEDIUM, IN_REVIEW)

#### 💰 Salary Records
- Current month salary data for all employees
- Includes basic salary, bonuses, and deductions
- Ready for salary management testing

## Benefits of Committed Database

### ✅ Immediate Functionality
- No database setup required for development
- Instant access to demo data
- Ready-to-test authentication and features

### ✅ Consistent Demo Experience
- Same data across all deployments
- Reliable testing environment
- Predictable demo scenarios

### ✅ Easy Onboarding
- New developers can start immediately
- No database migration required locally
- Complete feature demonstration ready

## Development vs Production Strategy

### 🛠️ Development (SQLite - Committed)
```bash
DATABASE_URL="file:./dev.db"
```
- Used locally and for demos
- Contains sample data
- Committed to Git for easy setup

### 🏭 Production (Cloud Database)
```bash
DATABASE_URL="postgresql://user:pass@host:port/db"
```
- Scalable cloud database (PostgreSQL/MySQL)
- Configured via environment variables
- Migrations applied automatically during deployment

## Vercel Deployment Behavior

1. **Development Database**: Included in deployment package
2. **Production Override**: `DATABASE_URL` environment variable takes precedence
3. **Migration Strategy**: Prisma automatically connects to production database when `DATABASE_URL` is set
4. **Data Isolation**: Development data never affects production

## Quick Commands

```bash
# Check demo data
npm run db:check

# Reseed if needed
npm run db:seed

# View database
npx prisma studio

# Start development
npm run dev
```

## Login Credentials for Testing

```bash
Email: demo@blurr.so
Password: [Use any password - demo data setup]
```

## Production Database Setup

When deploying to Vercel:

1. **Choose Database Provider**:
   - Vercel Postgres (recommended)
   - Railway
   - PlanetScale
   - Supabase

2. **Set Environment Variable**:
   ```bash
   DATABASE_URL=your-production-database-url
   ```

3. **Deploy**: Prisma will automatically:
   - Connect to production database
   - Run migrations
   - Ignore the committed dev.db file

## File Configuration

### ✅ Updated .gitignore
```gitignore
# Database files (excluding dev.db for demo purposes)
*.db-journal
test.db*
migration-check.db*
seed-check.db*
build-check.db*
# Keep dev.db committed for development/demo
# dev.db
```

### ✅ Deployment Scripts
- `vercel-build`: Handles production database setup
- `db:seed`: Seeds development database
- `db:check`: Validates demo data

---

**🎯 Result**: Database is committed, seeded, and ready for both development and production deployment!
