import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="mt-2 text-xl text-muted-foreground">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            You've reached the limbo of missing pages.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="default">
            <a href="/">Return Home</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;