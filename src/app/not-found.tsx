import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl font-semibold">
            Page Not Found
          </CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1" asChild>
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">
                <Search className="w-4 h-4 mr-2" />
                Home Page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
