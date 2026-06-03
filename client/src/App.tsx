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
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #dbe3ef",
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
