import React from "react";
import ReactDOM from "react-dom/client";
import App from "./reboot-app-v3";
import { AppErrorBoundary } from "./components/app-error-boundary";
import "./reboot-styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>,
);
