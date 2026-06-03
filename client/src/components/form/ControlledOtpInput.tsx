import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
};

const ControlledOtpInput = ({
  label,
  name,
  control,
  description = "",
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {Boolean(label) && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputOTP maxLength={6} {...field}>
              <InputOTPGroup className="justify-center w-full">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {Boolean(description) && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ControlledOtpInput;
