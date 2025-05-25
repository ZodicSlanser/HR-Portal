/**
 * Shared types for salary management components
 */

// Base employee interface from database
export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  basicSalary: number;
  salaryRecords?: BaseSalaryRecord[];
}

// Base salary record from database
export interface BaseSalaryRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  createdAt: Date;
}

// Enhanced salary record with computed fields for display
export interface SalaryRecord extends BaseSalaryRecord {
  employee: Employee;
  totalPaid: number;
}

export type ViewMode = "cards" | "table";
export type SortField = "name" | "basicSalary" | "totalPaid" | "date";
export type SortOrder = "asc" | "desc";
