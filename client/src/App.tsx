import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import ErrorBoundary from "./layout/error-boundary";
import ErrorPage from "./layout/error-page";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <ErrorBoundary fallback={<ErrorPage />}>
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
}

export default App;
