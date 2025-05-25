import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calculator, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalPaid: number;
    totalBasicSalary: number;
    totalBonus: number;
    totalDeduction: number;
  };
  employeeCount: number;
}

export function StatsCards({ stats, employeeCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid (This Month)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalPaid.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Basic Salary</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalBasicSalary.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Monthly base for {employeeCount} employees
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bonus</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">+${stats.totalBonus.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            This month bonus payments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">-${stats.totalDeduction.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            This month deductions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}