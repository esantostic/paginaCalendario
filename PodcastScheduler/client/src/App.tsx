import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import CalendarPage from "@/pages/CalendarPage";
import CalendarViewPage from "@/pages/CalendarViewPage";
import { ThemeProvider } from "next-themes";
import { CalendarProvider } from "@/context/CalendarContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <CalendarProvider>
          <CalendarPage />
        </CalendarProvider>
      )} />
      <Route path="/view" component={CalendarViewPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
