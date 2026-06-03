import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  inputProps?: React.ComponentProps<typeof Input>;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledInput = ({
  label,
  name,
  control,
  description = "",
  placeholder = "",
  type = "text",
  disabled,
  inputProps = {},
  controllerProps = {},
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {Boolean(label) && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="flex items-center gap-2">
              {type === "range" && (
                <span className="text-sm text-gray-500">{field.value}</span>
              )}
              <Input
                disabled={disabled}
                className="!ring-primary/10 flex-1 accent-primary border-primary/20 max-w-full"
                type={type}
                placeholder={placeholder}
                {...field}
                {...inputProps} // Spread the inputProps here
              />
            </div>
          </FormControl>
          {Boolean(description) && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
      {...controllerProps}
    />
  );
};

export default ControlledInput;
