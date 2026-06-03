import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledTextArea = ({
  label,
  name,
  control,
  description = "",
  placeholder = "",
  disabled,
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
            <Textarea
              placeholder={placeholder}
              className="min-h-20 resize-none !ring-primary/10 border-primary/20"
              disabled={disabled}
              {...field}
            />
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

export default ControlledTextArea;
