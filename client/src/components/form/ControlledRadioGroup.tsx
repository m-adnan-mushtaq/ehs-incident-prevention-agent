import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  options: IFormLabel[];
  direction: "vertical" | "horizontal";
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledRadioGroup = ({
  name,
  control,
  label,
  description,
  options,
  direction = "vertical",
  controllerProps = {},
}: Props) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            {Boolean(label) && <FormLabel>{label}</FormLabel>}
            {Boolean(description) && (
              <FormDescription>{description}</FormDescription>
            )}
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn(
                "flex flex-col space-y-1",
                direction === "horizontal" ? "flex-row space-x-2" : ""
              )}
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value as unknown as string} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        );
      }}
      {...controllerProps}
    />
  );
};

export default ControlledRadioGroup;
