import { PrismaClient } from '@prisma/client';
import { hash } from "bcryptjs";

// For seeding, use regular PrismaClient (uses directUrl automatically)
const prisma = new PrismaClient();

async function main() {
  console.log("Starting enhanced seed...");
  
  // Create multiple demo users with correct passwords
  const demoPassword = await hash("demo123", 12);
  const adminPassword = await hash("admin123", 12);
  const managerPassword = await hash("manager123", 12);
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "demo@blurr.so" },
      update: { password: demoPassword },
      create: {
        email: "demo@blurr.so",
        name: "Demo User",
        password: demoPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@company.com" },
      update: { password: adminPassword },
      create: {
        email: "admin@company.com",
        name: "HR Admin",
        password: adminPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: "manager@company.com" },
      update: { password: managerPassword },
      create: {
        email: "manager@company.com",
        name: "Project Manager",
        password: managerPassword,
      },
    }),
  ]);

  console.log("Created users:", users.map(u => u.email));
  // Create more diverse employees across different departments and levels
  const employees = await Promise.all([
    // Engineering Team - Senior Level
    prisma.employee.upsert({
      where: { employeeId: "EMP001" },
      update: {},
      create: {
        employeeId: "EMP001",
        name: "John Doe",
        joiningDate: new Date("2023-01-15"),
        basicSalary: 95000,
        userId: users[0].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP002" },
      update: {},
      create: {
        employeeId: "EMP002",
        name: "Jane Smith",
        joiningDate: new Date("2023-03-01"),
        basicSalary: 110000,
        userId: users[0].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP003" },
      update: {},
      create: {
        employeeId: "EMP003",
        name: "Bob Johnson",
        joiningDate: new Date("2023-06-15"),
        basicSalary: 85000,
        userId: users[0].id,
      },
    }),
    // Engineering Team - Mid/Junior Level
    prisma.employee.upsert({
      where: { employeeId: "EMP009" },
      update: {},
      create: {
        employeeId: "EMP009",
        name: "Alex Kumar",
        joiningDate: new Date("2024-01-08"),
        basicSalary: 75000,
        userId: users[0].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP010" },
      update: {},
      create: {
        employeeId: "EMP010",
        name: "Rachel Green",
        joiningDate: new Date("2023-11-20"),
        basicSalary: 65000,
        userId: users[0].id,
      },
    }),
    // Design Team
    prisma.employee.upsert({
      where: { employeeId: "EMP004" },
      update: {},
      create: {
        employeeId: "EMP004",
        name: "Sarah Wilson",
        joiningDate: new Date("2022-11-10"),
        basicSalary: 80000,
        userId: users[1].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP005" },
      update: {},
      create: {
        employeeId: "EMP005",
        name: "Mike Chen",
        joiningDate: new Date("2024-02-20"),
        basicSalary: 70000,
        userId: users[1].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP011" },
      update: {},
      create: {
        employeeId: "EMP011",
        name: "Priya Patel",
        joiningDate: new Date("2023-04-12"),
        basicSalary: 72000,
        userId: users[1].id,
      },
    }),
    // Marketing Team
    prisma.employee.upsert({
      where: { employeeId: "EMP006" },
      update: {},
      create: {
        employeeId: "EMP006",
        name: "Emily Rodriguez",
        joiningDate: new Date("2023-09-05"),
        basicSalary: 68000,
        userId: users[2].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP007" },
      update: {},
      create: {
        employeeId: "EMP007",
        name: "David Thompson",
        joiningDate: new Date("2022-08-12"),
        basicSalary: 82000,
        userId: users[2].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP012" },
      update: {},
      create: {
        employeeId: "EMP012",
        name: "Marcus Johnson",
        joiningDate: new Date("2023-07-25"),
        basicSalary: 58000,
        userId: users[2].id,
      },
    }),
    // HR Team
    prisma.employee.upsert({
      where: { employeeId: "EMP008" },
      update: {},
      create: {
        employeeId: "EMP008",
        name: "Lisa Anderson",
        joiningDate: new Date("2021-05-03"),
        basicSalary: 85000,
        userId: users[1].id,
      },
    }),
    // Sales Team
    prisma.employee.upsert({
      where: { employeeId: "EMP013" },
      update: {},
      create: {
        employeeId: "EMP013",
        name: "Tom Williams",
        joiningDate: new Date("2022-03-18"),
        basicSalary: 75000,
        userId: users[2].id,
      },
    }),
    prisma.employee.upsert({
      where: { employeeId: "EMP014" },
      update: {},
      create: {
        employeeId: "EMP014",
        name: "Jennifer Lee",
        joiningDate: new Date("2023-10-02"),
        basicSalary: 62000,
        userId: users[2].id,
      },
    }),
    // Operations Team
    prisma.employee.upsert({
      where: { employeeId: "EMP015" },
      update: {},
      create: {
        employeeId: "EMP015",
        name: "Carlos Martinez",
        joiningDate: new Date("2022-12-14"),
        basicSalary: 70000,
        userId: users[1].id,
      },
    }),
  ]);

  console.log("Created employees:", employees.map(e => `${e.employeeId}: ${e.name}`));  // Create diverse projects across different departments and business areas
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: "project1" },
      update: {},
      create: {
        id: "project1",
        name: "Website Redesign",
        description: "Complete redesign of the company website with modern UI/UX and improved conversion rates",
        userId: users[0].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project2" },
      update: {},
      create: {
        id: "project2",
        name: "Mobile App Development",
        description: "Cross-platform mobile application for iOS and Android with real-time features",
        userId: users[0].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project3" },
      update: {},
      create: {
        id: "project3",
        name: "HR Management System",
        description: "Comprehensive HR platform for employee management, payroll, and performance tracking",
        userId: users[1].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project4" },
      update: {},
      create: {
        id: "project4",
        name: "Q2 Marketing Campaign",
        description: "Multi-channel digital marketing campaign for Q2 product launch with analytics",
        userId: users[2].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project5" },
      update: {},
      create: {
        id: "project5",
        name: "API Integration Platform",
        description: "Microservices platform for third-party API integrations and data synchronization",
        userId: users[0].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project6" },
      update: {},
      create: {
        id: "project6",
        name: "Customer Support Portal",
        description: "Self-service customer support portal with ticketing system and knowledge base",
        userId: users[1].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project7" },
      update: {},
      create: {
        id: "project7",
        name: "Business Intelligence Dashboard",
        description: "Executive dashboard for real-time business metrics and data visualization",
        userId: users[1].id,
      },
    }),
    prisma.project.upsert({
      where: { id: "project8" },
      update: {},
      create: {
        id: "project8",
        name: "E-commerce Platform",
        description: "Modern e-commerce platform with inventory management and payment processing",
        userId: users[0].id,
      },
    }),
  ]);

  console.log("Created projects:", projects.map(p => p.name));  // Create comprehensive task set with various statuses and priorities across all projects
  const tasks = await Promise.all([
    // Website Redesign Project Tasks (Project 1)
    prisma.task.create({
      data: {
        title: "Design Homepage Layout",
        description: "Create wireframes and design for the new homepage with modern UI and improved user flow",
        priority: "HIGH",
        status: "TODO",
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement User Authentication",
        description: "Add login and registration functionality with OAuth integration and security features",
        priority: "URGENT",
        status: "IN_PROGRESS",
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Responsive Design Implementation",
        description: "Ensure website works perfectly on mobile, tablet, and desktop devices",
        priority: "HIGH",
        status: "TODO",
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "SEO Optimization",
        description: "Implement meta tags, structured data, and performance optimization for search engines",
        priority: "MEDIUM",
        status: "DONE",
        projectId: projects[0].id,
      },
    }),
    
    // Mobile App Development Tasks (Project 2)
    prisma.task.create({
      data: {
        title: "Setup Project Structure",
        description: "Initialize React Native project with navigation, state management, and development tools",
        priority: "URGENT",
        status: "DONE",
        projectId: projects[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Design App UI Components",
        description: "Create reusable UI components following design system and accessibility guidelines",
        priority: "HIGH",
        status: "IN_REVIEW",
        projectId: projects[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement Push Notifications",
        description: "Add Firebase push notifications for iOS and Android with rich content support",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        projectId: projects[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "App Store Submission",
        description: "Prepare app for submission to App Store and Google Play with required assets",
        priority: "LOW",
        status: "TODO",
        projectId: projects[1].id,
      },
    }),
    
    // HR Management System Tasks (Project 3)
    prisma.task.create({
      data: {
        title: "Employee Database Design",
        description: "Design comprehensive database schema for employee records and organizational structure",
        priority: "URGENT",
        status: "DONE",
        projectId: projects[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Payroll Calculation Module",
        description: "Implement automatic payroll calculations with tax deductions and benefit management",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: projects[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Performance Review System",
        description: "Build system for quarterly performance reviews, goal setting, and feedback collection",
        priority: "MEDIUM",
        status: "TODO",
        projectId: projects[2].id,
      },
    }),
    
    // Q2 Marketing Campaign Tasks (Project 4)
    prisma.task.create({
      data: {
        title: "Social Media Strategy",
        description: "Develop comprehensive social media strategy for Q2 campaign across multiple platforms",
        priority: "HIGH",
        status: "IN_REVIEW",
        projectId: projects[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Content Creation",
        description: "Create engaging blog posts, videos, and graphics for marketing campaign",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: projects[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Email Marketing Setup",
        description: "Setup automated email sequences, newsletter campaigns, and A/B testing",
        priority: "MEDIUM",
        status: "TODO",
        projectId: projects[3].id,
      },
    }),
    
    // API Integration Platform Tasks (Project 5)
    prisma.task.create({
      data: {
        title: "API Gateway Setup",
        description: "Configure API gateway with rate limiting, authentication, and monitoring",
        priority: "URGENT",
        status: "IN_PROGRESS",
        projectId: projects[4].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Database Migration Tools",
        description: "Build tools for seamless database migrations, rollbacks, and version control",
        priority: "HIGH",
        status: "TODO",
        projectId: projects[4].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Documentation Portal",
        description: "Create comprehensive API documentation with interactive examples and SDK guides",
        priority: "MEDIUM",
        status: "TODO",
        projectId: projects[4].id,
      },
    }),
    
    // Customer Support Portal Tasks (Project 6)
    prisma.task.create({
      data: {
        title: "Ticketing System Development",
        description: "Build robust ticketing system with priority levels and automated routing",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: projects[5].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Knowledge Base Creation",
        description: "Develop searchable knowledge base with articles, FAQs, and video tutorials",
        priority: "MEDIUM",
        status: "TODO",
        projectId: projects[5].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Live Chat Integration",
        description: "Integrate real-time chat system with agent management and chat history",
        priority: "HIGH",
        status: "TODO",
        projectId: projects[5].id,
      },
    }),
    
    // Business Intelligence Dashboard Tasks (Project 7)
    prisma.task.create({
      data: {
        title: "Data Pipeline Setup",
        description: "Establish ETL pipelines for real-time data processing and warehouse integration",
        priority: "URGENT",
        status: "IN_REVIEW",
        projectId: projects[6].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Executive Dashboard Design",
        description: "Create executive-level dashboard with KPIs, trends, and drill-down capabilities",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: projects[6].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Automated Reporting",
        description: "Build automated report generation with scheduling and email distribution",
        priority: "MEDIUM",
        status: "TODO",
        projectId: projects[6].id,
      },
    }),
    
    // E-commerce Platform Tasks (Project 8)
    prisma.task.create({
      data: {
        title: "Product Catalog System",
        description: "Develop comprehensive product catalog with categories, variants, and inventory tracking",
        priority: "HIGH",
        status: "IN_PROGRESS",
        projectId: projects[7].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Payment Gateway Integration",
        description: "Integrate multiple payment processors with fraud detection and security compliance",
        priority: "URGENT",
        status: "TODO",
        projectId: projects[7].id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Order Management System",
        description: "Build order processing system with fulfillment tracking and customer notifications",
        priority: "HIGH",
        status: "TODO",
        projectId: projects[7].id,
      },
    }),
  ]);

  console.log("Created tasks:", tasks.map(t => `${t.title} (${t.status})`));  // Create comprehensive task assignments across all employees with realistic skill matching
  const assignments = await Promise.all([
    // John Doe (Senior Full-Stack Developer) - Complex development tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[0].id, // Design Homepage Layout
        employeeId: employees[0].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[1].id, // User Authentication
        employeeId: employees[0].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[14].id, // API Gateway Setup
        employeeId: employees[0].id,
      },
    }),
    
    // Jane Smith (Lead Developer) - Complex backend tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[4].id, // Setup Project Structure
        employeeId: employees[1].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[9].id, // Payroll Calculation Module
        employeeId: employees[1].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[15].id, // Database Migration Tools
        employeeId: employees[1].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[20].id, // Data Pipeline Setup
        employeeId: employees[1].id,
      },
    }),
    
    // Bob Johnson (Full Stack Developer) - Mixed frontend/backend tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[2].id, // Responsive Design
        employeeId: employees[2].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[6].id, // Push Notifications
        employeeId: employees[2].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[17].id, // Ticketing System Development
        employeeId: employees[2].id,
      },
    }),
    
    // Alex Kumar (Mid-Level Developer) - Development tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[16].id, // Documentation Portal
        employeeId: employees[3].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[23].id, // Product Catalog System
        employeeId: employees[3].id,
      },
    }),
    
    // Rachel Green (Junior Developer) - Learning-oriented tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[3].id, // SEO Optimization
        employeeId: employees[4].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[18].id, // Knowledge Base Creation
        employeeId: employees[4].id,
      },
    }),
    
    // Sarah Wilson (Senior UI/UX Designer) - Design tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[5].id, // Design App UI Components
        employeeId: employees[5].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[21].id, // Executive Dashboard Design
        employeeId: employees[5].id,
      },
    }),
    
    // Mike Chen (UI Designer) - Design support tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[19].id, // Live Chat Integration
        employeeId: employees[6].id,
      },
    }),
    
    // Priya Patel (UX Designer) - User experience focused tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[22].id, // Automated Reporting
        employeeId: employees[7].id,
      },
    }),
    
    // Emily Rodriguez (Marketing Specialist) - Marketing tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[11].id, // Social Media Strategy
        employeeId: employees[8].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[12].id, // Content Creation
        employeeId: employees[8].id,
      },
    }),
    
    // David Thompson (Marketing Manager) - Strategic marketing
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[13].id, // Email Marketing Setup
        employeeId: employees[9].id,
      },
    }),
    
    // Marcus Johnson (Marketing Associate) - Supporting marketing tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[7].id, // App Store Submission
        employeeId: employees[10].id,
      },
    }),
    
    // Lisa Anderson (HR Manager) - HR system tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[8].id, // Employee Database Design
        employeeId: employees[11].id,
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[10].id, // Performance Review System
        employeeId: employees[11].id,
      },
    }),
    
    // Tom Williams (Sales Manager) - Business-oriented tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[24].id, // Payment Gateway Integration
        employeeId: employees[12].id,
      },
    }),
    
    // Jennifer Lee (Sales Associate) - Customer-facing tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[25].id, // Order Management System
        employeeId: employees[13].id,
      },
    }),
    
    // Carlos Martinez (Operations Manager) - Operational tasks
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[22].id, // Automated Reporting (shared with Priya)
        employeeId: employees[14].id,
      },
    }),
  ]);

  console.log("Created task assignments:", assignments.length, "assignments");  // Create comprehensive salary records for multiple months
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
    // Calculate previous months
  const prevMonth1 = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear1 = currentMonth === 1 ? currentYear - 1 : currentYear;
  
  let prevMonth2: number;
  if (currentMonth <= 2) {
    prevMonth2 = currentMonth === 1 ? 11 : 12;
  } else {
    prevMonth2 = currentMonth - 2;
  }
  const prevYear2 = currentMonth <= 2 ? currentYear - 1 : currentYear;
  
  // Create salary records for current month and previous 2 months
  const months = [
    { month: currentMonth, year: currentYear },
    { month: prevMonth1, year: prevYear1 },
    { month: prevMonth2, year: prevYear2 },
  ];

  const salaryRecords = [];
  
  for (const employee of employees) {
    for (const { month, year } of months) {
      // Create varied salary data based on performance and bonuses
      const performanceMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const bonus = Math.floor(employee.basicSalary * 0.1 * performanceMultiplier);
      const deduction = Math.floor(Math.random() * 500 + 100); // $100-$600 deductions
      
      const salaryRecord = await prisma.salaryRecord.upsert({
        where: {
          employeeId_month_year: {
            employeeId: employee.id,
            month: month,
            year: year,
          },
        },
        update: {},
        create: {
          employeeId: employee.id,
          month: month,
          year: year,
          basicSalary: employee.basicSalary,
          bonus: bonus,
          deduction: deduction,
        },
      });
      
      salaryRecords.push(salaryRecord);
    }
  }
  console.log("Created salary records:", salaryRecords.length, "records across", months.length, "months");
  
  // Summary statistics
  console.log("\n📊 Enhanced Demo Data Summary:");
  console.log(`👥 Users: ${users.length} (Demo, Admin, Manager accounts)`);
  console.log(`👨‍💼 Employees: ${employees.length} across Engineering, Design, Marketing, HR, Sales, Operations`);
  console.log(`📋 Projects: ${projects.length} diverse business projects`);
  console.log(`✅ Tasks: ${tasks.length} tasks with realistic priorities and statuses`);
  console.log(`🔗 Task Assignments: ${assignments.length} assignments matching skills and departments`);
  console.log(`💰 Salary Records: ${salaryRecords.length} records with performance-based variations`);
  
  // Department breakdown
  console.log("\n🏢 Department Breakdown:");
  console.log("• Engineering Team: 5 developers (Senior to Junior levels)");
  console.log("• Design Team: 3 designers (UI/UX specialists)");
  console.log("• Marketing Team: 3 specialists (Strategy, Content, Digital)");
  console.log("• HR Team: 1 manager (Employee relations & payroll)");
  console.log("• Sales Team: 2 members (Manager & Associate)");
  console.log("• Operations Team: 1 manager (Process optimization)");
  
  // Project categories
  console.log("\n📊 Project Categories:");
  console.log("• Technical Development: Website, Mobile App, API Platform, E-commerce");
  console.log("• Internal Systems: HR Management, Customer Support, BI Dashboard");
  console.log("• Business Growth: Marketing Campaign, Sales initiatives");
    console.log("\n🔐 Demo Login Credentials:");
  console.log("📧 demo@blurr.so / password: demo123 (General access)");
  console.log("📧 admin@company.com / password: admin123 (HR Admin access)");
  console.log("📧 manager@company.com / password: manager123 (Project Manager access)");
  
  console.log("\n✅ Comprehensive demo data seeded successfully!");  console.log("🚀 Ready for Vercel deployment with rich, realistic business data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
