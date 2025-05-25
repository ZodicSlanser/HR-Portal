import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Edit, Trash2, MoreHorizontal } from "lucide-react";
import type { SalaryRecord } from "@/lib/types/salary-types";

interface SalaryCardsProps {
  records: SalaryRecord[];
  onEdit: (record: SalaryRecord) => void;
  onDelete: (recordId: string) => void;
}

export function SalaryCards({ records, onEdit, onDelete }: SalaryCardsProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {records.map((record) => (
        <Card key={record.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{record.employee.name}</CardTitle>
                <CardDescription>ID: {record.employee.employeeId}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(record)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the salary record for {record.employee.name} 
                          for {new Date(record.year, record.month - 1).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(record.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Period */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(record.year, record.month - 1).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <Badge variant={
                  record.month === currentMonth && record.year === currentYear 
                    ? "default" 
                    : "secondary"
                }>
                  {record.month === currentMonth && record.year === currentYear 
                    ? "Current" 
                    : "Past"
                  }
                </Badge>
              </div>

              {/* Salary Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Basic Salary:</span>
                  <span className="font-semibold">${record.basicSalary.toLocaleString()}</span>
                </div>
                
                {record.bonus > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bonus:</span>
                    <span className="font-semibold text-green-600">
                      +${record.bonus.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {record.deduction > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Deduction:</span>
                    <span className="font-semibold text-red-600">
                      -${record.deduction.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Total Paid:</span>
                  <span className="text-lg font-bold">
                    ${record.totalPaid.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
