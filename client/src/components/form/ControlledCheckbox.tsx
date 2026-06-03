import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
type Props = {
  name: string;
  control: any;
  label?: React.ReactNode;
  description?: React.ReactNode;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledCheckbox = ({
  name,
  control,
  label,
  description,
  controllerProps,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-1 space-y-0 rounded-md">
          <FormControl>
            <Checkbox
              className="border-primary/30"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel>{label}</FormLabel>
          {Boolean(description) && (
            <div className="space-y-1 leading-none">
              {Boolean(description) && (
                <FormDescription>{description}</FormDescription>
              )}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
      {...controllerProps}
    />
  );
};

export default ControlledCheckbox;
