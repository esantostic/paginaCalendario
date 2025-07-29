import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/suppressWarnings";
import { CalendarProvider } from "./context/CalendarContext";

createRoot(document.getElementById("root")!).render(
  <CalendarProvider>
    <App />
  </CalendarProvider>
);
