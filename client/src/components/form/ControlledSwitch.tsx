import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Switch } from "../ui/switch";

type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  showBooleanValue?: boolean;
};

const ControlledSwitch = ({
  label,
  name,
  control,
  description = "",
  wrapperClassName = "",
  disabled,
  showBooleanValue,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-4",
            wrapperClassName
          )}
        >
          <div className="space-y-0.5">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <div className="flex items-center gap-2">
              <Switch
                disabled={disabled}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {showBooleanValue && (
                <p className="text-slateText text-sm font-semibold">
                  {field.value ? "Yes" : "No"}
                </p>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ControlledSwitch;
