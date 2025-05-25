import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2 } from "lucide-react";
import EmployeeForm from "@/components/employee-form";
import DeleteEmployeeButton from "@/components/delete-employee-button";
import { format } from "date-fns";
import {Employee} from "@/lib/types/salary-types";

export default async function EmployeesPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div>Please log in to access employees.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      employees: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <EmployeeForm>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </EmployeeForm>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Manage your organization&apos;s employees ({user.employees.length} total)</CardDescription>
        </CardHeader>
        <CardContent>
          {user.employees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No employees found</p>
              <EmployeeForm>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Employee
                </Button>
              </EmployeeForm>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.employees.map((employee: Employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{employee.employeeId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{format(new Date(employee.joiningDate), "MMM dd, yyyy")}</TableCell>
                    <TableCell>${employee.basicSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EmployeeForm employee={employee}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </EmployeeForm>
                        <DeleteEmployeeButton employeeId={employee.id}>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteEmployeeButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}