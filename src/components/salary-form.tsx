"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSalaryRecord } from "@/lib/actions";
import { Calculator, DollarSign } from "lucide-react";

const salaryFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  month: z.string().min(1, "Month is required"),
  year: z.string().min(1, "Year is required"),
  bonus: z.coerce.number().min(0, "Bonus must be positive"),
  deduction: z.coerce.number().min(0, "Deduction must be positive"),
});

type SalaryFormValues = z.infer<typeof salaryFormSchema>;

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  basicSalary: number;
}

interface SalaryFormProps {
  employees: Employee[];
  children: React.ReactNode;
}

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => ({
  value: (currentYear - 2 + i).toString(),
  label: (currentYear - 2 + i).toString(),
}));

export default function SalaryForm({ employees, children }: Readonly<SalaryFormProps>) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      employeeId: employees.length === 1 ? employees[0].id : "",
      month: (new Date().getMonth() + 1).toString(),
      year: new Date().getFullYear().toString(),
      bonus: 0,
      deduction: 0,
    },
  });
  // Watch form values for calculation
  const watchedValues = form.watch();
  const bonus = watchedValues.bonus ?? 0;
  const deduction = watchedValues.deduction ?? 0;
  const basicSalary = selectedEmployee?.basicSalary ?? 0;
  const totalSalary = basicSalary + bonus - deduction;

  async function onSubmit(data: SalaryFormValues) {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append("employeeId", data.employeeId);
      formData.append("month", data.month);
      formData.append("year", data.year);
      formData.append("bonus", data.bonus.toString());
      formData.append("deduction", data.deduction.toString());      await createSalaryRecord(formData);
      
      setOpen(false);
      form.reset();
      setSelectedEmployee(null);
      // Data will be automatically refreshed via revalidatePath in the action
    } catch (error) {
      console.error("Failed to create salary record:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmployeeChange(employeeId: string) {    const employee = employees.find(emp => emp.id === employeeId);
    setSelectedEmployee(employee ?? null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Salary Record</DialogTitle>
          <DialogDescription>
            Create a new salary record with bonuses and deductions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleEmployeeChange(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} (ID: {employee.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deduction ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salary Calculation Preview */}
            {selectedEmployee && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calculator className="h-4 w-4" />
                  Salary Calculation
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Basic Salary:</span>
                    <span>${basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus:</span>
                    <span className="text-green-600">+${bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deduction:</span>
                    <span className="text-red-600">-${deduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total:</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {totalSalary.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
