import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  email: string;
  handleResendEmail: () => void;
  isLoading?: boolean;
};

const SuccessEmail = ({ email, handleResendEmail, isLoading }: Props) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (counter > 0) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [counter]);

  const handleResend = () => {
    setCounter(60); // Set the cooldown period
    handleResendEmail();
  };

  return (
    <div className="py-8 space-y-4 text-center">
      <MailOpen className="mx-auto size-20 text-primary" />
      <h2 className="font-bold pt-8 text-2xl text-darkSlate">Email Sent</h2>
      <p className="text-darkSlate">
        Check your {email} inbox for instructions.
      </p>
      <Button
        size="lg"
        onClick={handleResend}
        disabled={counter > 0 || isLoading}
      >
        {isLoading
          ? "Sending..."
          : counter > 0
          ? `Resend in ${counter}s`
          : "Resend"}
      </Button>
    </div>
  );
};

export default SuccessEmail;
