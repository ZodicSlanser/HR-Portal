import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Edit, Trash2, MoreHorizontal, SortAsc, SortDesc } from "lucide-react";
import type { SalaryRecord, SortField, SortOrder } from "@/lib/types/salary-types";

interface SalaryTableProps {
  records: SalaryRecord[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onEdit: (record: SalaryRecord) => void;
  onDelete: (recordId: string) => void;
}

export function SalaryTable({
  records,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete
}: SalaryTableProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Records ({records.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center gap-2">
                  Employee <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => onSort("date")}
              >
                <div className="flex items-center gap-2">
                  Period <SortIcon field="date" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => onSort("basicSalary")}
              >
                <div className="flex items-center gap-2">
                  Basic Salary <SortIcon field="basicSalary" />
                </div>
              </TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Deduction</TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => onSort("totalPaid")}
              >
                <div className="flex items-center gap-2">
                  Total Paid <SortIcon field="totalPaid" />
                </div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{record.employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {record.employee.employeeId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(record.year, record.month - 1).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </TableCell>
                <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                <TableCell>
                  {record.bonus > 0 && (
                    <span className="text-green-600">+${record.bonus.toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell>
                  {record.deduction > 0 && (
                    <span className="text-red-600">-${record.deduction.toLocaleString()}</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  ${record.totalPaid.toLocaleString()}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
