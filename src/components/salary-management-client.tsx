"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { updateSalaryRecord, deleteSalaryRecord } from "@/lib/actions";
import { downloadSalaryData } from "@/lib/utils/download";
import { StatsCards } from "@/components/salary/stats-cards";
import { SalaryFilters } from "@/components/salary/salary-filters";
import { SalaryTable } from "@/components/salary/salary-table";
import { SalaryCards } from "@/components/salary/salary-cards";
import { EditSalaryDialog } from "@/components/salary/edit-salary-dialog";
import { EmptyState } from "@/components/salary/empty-state";
import type { Employee, SalaryRecord, ViewMode, SortField, SortOrder } from "@/lib/types/salary-types";

interface User {
  id: string;
  email: string;
  name?: string;
  employees: Employee[];
}

interface SalaryManagementClientProps {
  readonly user: User;
}

export function SalaryManagementClient({ user }: SalaryManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");  const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  // Get all salary records for filtering and display
  const allSalaryRecords = useMemo(() => {
    return user.employees.flatMap(employee => 
      (employee.salaryRecords || []).map(record => ({
        ...record,
        employee,
        totalPaid: record.basicSalary + record.bonus - record.deduction
      }))
    );
  }, [user.employees]);

  // Calculate statistics
  const stats = useMemo(() => {
    const currentMonthRecords = allSalaryRecords.filter(record => 
      record.month === currentMonth && record.year === currentYear
    );

    const totalPaid = currentMonthRecords.reduce((sum, record) => 
      sum + record.totalPaid, 0
    );

    const totalBasicSalary = user.employees.reduce((sum, employee) => 
      sum + employee.basicSalary, 0
    );

    const totalBonus = currentMonthRecords.reduce((sum, record) => 
      sum + record.bonus, 0
    );

    const totalDeduction = currentMonthRecords.reduce((sum, record) => 
      sum + record.deduction, 0
    );

    return { totalPaid, totalBasicSalary, totalBonus, totalDeduction };
  }, [allSalaryRecords, currentMonth, currentYear, user.employees]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = allSalaryRecords;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply month filter
    if (selectedMonth !== "all") {
      filtered = filtered.filter(record => record.month === parseInt(selectedMonth));
    }

    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter(record => record.year === parseInt(selectedYear));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortField) {
        case "name":
          aValue = a.employee.name;
          bValue = b.employee.name;
          break;
        case "basicSalary":
          aValue = a.basicSalary;
          bValue = b.basicSalary;
          break;
        case "totalPaid":
          aValue = a.totalPaid;
          bValue = b.totalPaid;
          break;
        case "date":
          aValue = new Date(a.year, a.month - 1);
          bValue = new Date(b.year, b.month - 1);
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }      if (sortOrder === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

    return filtered;
  }, [allSalaryRecords, searchTerm, selectedMonth, selectedYear, sortField, sortOrder]);

  // Get available years
  const availableYears = useMemo(() => {
    const years = new Set(allSalaryRecords.map(record => record.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [allSalaryRecords]);

  const handleEditRecord = (record: SalaryRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRecord = async (recordId: string, data: { bonus: number; deduction: number }) => {
    try {
      const result = await updateSalaryRecord(recordId, data);      if (result.success) {
        toast.success("Salary record updated successfully");
        setIsEditDialogOpen(false);
        setEditingRecord(null);
        // Data will be automatically refreshed via revalidatePath in the action
      } else {
        toast.error(result.error ?? "Failed to update salary record");
      }
    } catch {
      toast.error("An error occurred while updating the record");
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const result = await deleteSalaryRecord(recordId);      if (result.success) {
        toast.success("Salary record deleted successfully");
        // Data will be automatically refreshed via revalidatePath in the action
      } else {
        toast.error(result.error ?? "Failed to delete salary record");
      }
    } catch {
      toast.error("An error occurred while deleting the record");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const handleDownload = async () => {
    try {
      const result = await downloadSalaryData('csv');
      if (result.success) {
        toast.success(`Downloaded ${result.filename} successfully`);
      } else {
        toast.error(result.error ?? "Download failed");
      }
    } catch {
      toast.error("An error occurred during download");
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <StatsCards stats={stats} employeeCount={user.employees.length} />

      {/* Filters and Controls */}
      <SalaryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        viewMode={viewMode}
        setViewMode={setViewMode}
        availableYears={availableYears}
        employees={user.employees}
        onDownload={handleDownload}
      />

      {/* Content */}
      {filteredAndSortedData.length === 0 ? (
        <EmptyState />
      ) : viewMode === "table" ? (
        <SalaryTable
          records={filteredAndSortedData}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
        />
      ) : (
        <SalaryCards
          records={filteredAndSortedData}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
        />
      )}

      {/* Edit Dialog */}
      <EditSalaryDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        record={editingRecord}
        onSave={handleUpdateRecord}
      />
    </div>
  );
}

export default SalaryManagementClient;
