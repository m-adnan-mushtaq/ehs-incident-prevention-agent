import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  name: string;
  control: any;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options: IFormLabel[];
  onChangeCapture?: (value: string) => void;
  disabled?: boolean;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledSelect = ({
  name,
  control,
  label,
  options,
  description,
  placeholder = "Select",
  onChangeCapture,
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
          <Select
            value={`${field.value}`}
            disabled={disabled}
            onValueChange={(e) => {
              field.onChange(e);
              onChangeCapture && onChangeCapture(e);
            }}
            defaultValue={`${field.value}`}
          >
            <FormControl>
              <SelectTrigger className="w-full !ring-primary/10 border-primary/20">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {!options?.length && (
                <SelectItem className="my-4" value="default" disabled>
                  No options available
                </SelectItem>
              )}
              {options.map((option, index) => (
                <SelectItem
                  key={`${index}-${option.value}`}
                  value={`${option.value}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

export default ControlledSelect;
