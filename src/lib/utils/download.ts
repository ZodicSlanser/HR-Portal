import { getSalaryDataForExport } from "@/lib/actions/salary-actions";

export async function downloadSalaryData(format: 'csv' | 'json' = 'csv') {
  try {
    const data = await getSalaryDataForExport();
    
    if (data.length === 0) {
      throw new Error('No salary data available for download');
    }

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'Employee Name',
        'Employee ID', 
        'Period',
        'Month',
        'Year',
        'Basic Salary',
        'Bonus',
        'Deduction',
        'Total Paid'
      ];
      
      const csvRows = [
        headers.join(','),
        ...data.map(record => [
          `"${record.employeeName}"`,
          `"${record.employeeId}"`,
          `"${record.period}"`,
          record.month,
          record.year,
          record.basicSalary,
          record.bonus,
          record.deduction,
          record.totalPaid
        ].join(','))
      ];
      
      content = csvRows.join('\n');
      mimeType = 'text/csv';
      filename = `salary-records-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // Generate JSON content
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `salary-records-${new Date().toISOString().split('T')[0]}.json`;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Download failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Download failed' 
    };
  }
}
