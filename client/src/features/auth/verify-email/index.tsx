import Loader from "@/components/layout/loader";
import ScreenLoader from "@/components/layout/screen-loader";
import { CardContent, CardTitle } from "@/components/ui/card";
import { authService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router";
import ResendVerificationEmail from "../components/resend-verify-email";
import toast from "react-hot-toast";

const VerifyingAccount = () => {
  const params = useParams<{
    token: string;
  }>();

  const { isError, isSuccess, isPending } = useQuery({
    queryKey: [params.token],
    queryFn: () => authService.verifyEmail(params.token || ""),
    enabled: !!params.token,
  });

  if (!params.token) {
    return <Navigate to="/" replace />;
  }

  if (isPending) {
    return (
      <>
        <CardTitle className="mt-4">Verifying Your Account...</CardTitle>
        <CardContent className="flex items-center justify-center my-4">
          <Loader className="size-16" />
        </CardContent>
      </>
    );
  }

  if (isSuccess) {
    toast.success("Account verified successfully", {
      id: "verify-account",
    });
    return <Navigate to="/" replace />;
  }

  if (isError) {
    return <ResendVerificationEmail />;
  }

  return <ScreenLoader />;
};

export default VerifyingAccount;
