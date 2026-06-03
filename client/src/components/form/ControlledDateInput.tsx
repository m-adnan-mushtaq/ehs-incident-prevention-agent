import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  calendarProps?: React.ComponentProps<typeof Calendar>;
  required?: boolean;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledDateInput = ({
  label,
  name,
  control,
  description = "",
  placeholder = "",
  disabled,
  calendarProps,
  required = false,
  controllerProps = {},
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: {
          value: Boolean(required),
          message: "This field is required",
        },
      }}
      render={({ field }) => {
        const fieldValue = field.value ? new Date(field.value) : undefined;
        return (
          <FormItem>
            {Boolean(label) && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {field.value ? (
                      format(fieldValue || new Date(), "PPP")
                    ) : (
                      <span>{placeholder || "Select date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fieldValue as any}
                    onSelect={field.onChange}
                    initialFocus
                    {...(calendarProps || {})}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {Boolean(description) && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
      {...controllerProps}
    />
  );
};

export default ControlledDateInput;
