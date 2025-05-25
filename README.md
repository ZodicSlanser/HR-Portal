# Blurr.so Technical Assessment

This repository contains a full-stack Next.js application built as a technical assessment for Blurr.so.

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js App Router with Server Actions
- **Database**: SQLite with Prisma ORM (development), PostgreSQL/MySQL (production)
- **Authentication**: NextAuth.js (Auth.js for Next.js)

## Demo Database

This project includes a **comprehensive demo database** with realistic business data for immediate testing and demonstration:

### 📊 Demo Data Overview
- **3 User Accounts** with different roles and permissions
- **15 Employees** across 6 departments with realistic salary ranges ($58K-$110K)
- **8 Business Projects** spanning multiple industries and use cases
- **26 Tasks** with varied priorities, statuses, and realistic descriptions
- **27 Task Assignments** matching employee skills and departments
- **45 Salary Records** across 3 months with performance-based variations

### 🏢 Organizational Structure
**Engineering Team (5 members)**
- Senior Full-Stack Developer ($95K), Lead Developer ($110K), Full-Stack Developer ($85K)
- Mid-Level Developer ($75K), Junior Developer ($65K)

**Design Team (3 members)**
- Senior UI/UX Designer ($80K), UI Designer ($70K), UX Designer ($72K)

**Marketing Team (3 members)**
- Marketing Manager ($82K), Marketing Specialist ($68K), Marketing Associate ($58K)

**Other Departments**
- HR Manager ($85K), Sales Manager ($75K), Sales Associate ($62K), Operations Manager ($70K)

### 📋 Project Portfolio
1. **Website Redesign** - Modern UI/UX with conversion optimization
2. **Mobile App Development** - Cross-platform iOS/Android application
3. **HR Management System** - Employee management and payroll platform
4. **Q2 Marketing Campaign** - Multi-channel digital marketing initiative
5. **API Integration Platform** - Microservices and third-party integrations
6. **Customer Support Portal** - Self-service ticketing and knowledge base
7. **Business Intelligence Dashboard** - Executive metrics and analytics
8. **E-commerce Platform** - Modern retail solution with payments

### 🔐 Demo Login Credentials
- **General Access**: `demo@blurr.so` / `password123`
- **HR Admin**: `admin@company.com` / `admin123`
- **Project Manager**: `manager@company.com` / `password123`

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tech-assessment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # The database (dev.db) is already included with demo data
   # If you need to reset it, run:
   # npx prisma migrate reset --force
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

- `src/app` - Next.js App Router pages and API routes
- `src/components` - UI components
- `src/lib` - Utility functions
- `prisma` - Database schema and migrations

## Database Schema

The application uses a comprehensive database schema optimized for HR and project management:

**Core Models:**
- **User** - Authentication and user accounts
- **Employee** - Employee records with salary and department info
- **Project** - Business projects and initiatives
- **Task** - Project tasks with priorities and status tracking
- **TaskAssignment** - Many-to-many relationship between tasks and employees
- **SalaryRecord** - Monthly salary records with bonuses and deductions

**Authentication Models:**
- **Account** - OAuth provider accounts
- **Session** - User session management
- **VerificationToken** - Email verification and password reset

**Key Features:**
- Multi-tenant user management
- Comprehensive employee lifecycle tracking
- Project and task management with assignments
- Detailed salary and payroll tracking
- Performance-based compensation variations

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **🚀 [Deployment Guide](./docs/deployment/DEPLOYMENT.md)** - Complete Vercel deployment instructions
- **⚙️ [Database Setup](./docs/setup/DATABASE_SETUP.md)** - Database configuration and strategy
- **✅ [Checklists](./docs/checklists/)** - Pre-deployment and verification checklists
- **📊 [Status Reports](./docs/status/)** - Implementation and deployment status

For quick navigation, see the [Documentation Index](./docs/README.md).
