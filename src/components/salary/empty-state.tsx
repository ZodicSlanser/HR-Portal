import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({ 
  message = "No salary records found", 
  description = "Try adjusting your filters or add some salary records" 
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">{message}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
