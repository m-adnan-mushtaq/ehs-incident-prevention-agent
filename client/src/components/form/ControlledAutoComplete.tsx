import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  control: any;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options: IFormLabel[];
  onChange?: (value: any) => void;
};

const ControlledCombobox = ({
  name,
  control,
  label,
  options,
  description,
  placeholder = "Select",
  onChange = () => {},
}: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState("auto");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (parentRef.current) {
      setWidth(`${parentRef.current.offsetWidth}px`);
    }
  }, []);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = options.find(
          (option) => option.value === field.value
        )?.label;
        return (
          <FormItem ref={parentRef} className=" w-full">
            {Boolean(label) && <FormLabel>{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    aria-expanded={open}
                    role="combobox"
                    className={cn(
                      "w-full justify-between truncate overflow-hidden",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {value || placeholder}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                style={{
                  width: width,
                }}
                className="p-0"
              >
                <Command>
                  <CommandInput placeholder={`Search ....`} className="h-9" />
                  <CommandList className="w-full h-full max-h-60 !overflow-y-auto">
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup className="!overflow-y-auto h-full">
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={`${option.label}`}
                          onSelect={() => {
                            field.onChange(option.value);
                            onChange(option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {Boolean(description) && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ControlledCombobox;
