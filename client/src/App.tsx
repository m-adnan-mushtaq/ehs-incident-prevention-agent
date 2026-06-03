import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./layout/error-boundary";
import ErrorPage from "./layout/error-page";
import { Outlet } from "@tanstack/react-router";

function App() {
  useCurrentUser();
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0f1729",
            color: "#e2e8f0",
            border: "1px solid #334155",
          },
        }}
      />
      <ErrorBoundary fallback={<ErrorPage />}>
        <Outlet />
      </ErrorBoundary>
    </>
  );
}

export default App;
