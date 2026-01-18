import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            Lost in the Labyrinth: Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            Like Adso in Umberto Eco's <em>The Name of the Rose</em>, you've wandered into a forbidden section of the library. Or perhaps, echoing Sophie's journey in Jostein Gaarder's <em>Sophie's World</em>, this is a philosophical detour. Beware the circles of Dante's <em>Inferno</em>—you might be in the limbo of missing pages!
          </p>
          <p className="mb-4 text-muted-foreground">
            While you're here, my main side project is building VA software for field hockey. It's like navigating a strategic game on the field—check it out!
          </p>
          <Accordion type="single" collapsible className="text-left">
            <AccordionItem value="inspiration">
              <AccordionTrigger className="text-sm font-medium">A Quick Philosophical Aside</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 text-muted-foreground">
                  <li>"Who are you?" – Sophie’s World</li>
                  <li>"Stat rosa pristina nomine, nomina nuda tenemus." – The Name of the Rose</li>
                  <li>"Lasciate ogne speranza, voi ch'intrate." – Inferno</li>
                </ul>
                <p className="mt-2">Ponder these while finding your way back.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="default">
            <a href="/">Escape the Maze: Return Home</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;