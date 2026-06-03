import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ErrorMsg = ({
  message = "  Something, went wrong while processing your request, please try again",
}: {
  message?: string;
}) => {
  return (
    <div className="p-4 max-w-screen-lg">
      <Alert variant="destructive" className="my-8 mx-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorMsg;
