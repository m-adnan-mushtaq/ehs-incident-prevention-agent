"use client";

import type React from "react";

import { useController } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

type Props = {
  name: string;
  control: any;
  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  options: IFormLabel[];
  className?: string;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledMultiSelect = ({
  name,
  control,
  label,
  options,
  description,
  placeholder = "Select options",
  className,
  controllerProps = {},
}: Props) => {
  const {
    field: { value = [], onChange },
  } = useController({ name, control });

  const [open, setOpen] = useState(false);

  const handleValueChange = (selectedValue: string) => {
    const newValues = value.includes(selectedValue)
      ? value.filter((v: string) => v !== selectedValue)
      : [...value, selectedValue];

    onChange(newValues);
  };

  const handleRemoveValue = (selectedValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v: string) => v !== selectedValue));
  };

  const getLabelForValue = (val: string) =>
    options.find((opt) => String(opt.value) == val)?.label || val;

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <div
                  className={cn(
                    "flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    "!ring-primary/10 border-primary/20 cursor-pointer",
                    "flex-wrap gap-1 items-center justify-between"
                  )}
                >
                  <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden">
                    {value.length > 0 ? (
                      value.map((val: string) => (
                        <Badge
                          key={val}
                          variant="outline"
                          className="flex items-center gap-1 max-w-[150px] "
                        >
                          <span className="truncate">
                            {getLabelForValue(val)}
                          </span>
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={(e) => handleRemoveValue(val, e)}
                          />
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        {placeholder}
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="min-w-56 w-[80vw] max-w-screen-sm p-0"
              align="start"
            >
              <Command>
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    {options.map((option) => {
                      const isSelected = value.includes(String(option.value));
                      return (
                        <CommandItem
                          key={option.value}
                          value={String(option.value)}
                          onSelect={() =>
                            handleValueChange(String(option.value))
                          }
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50"
                              )}
                            >
                              {isSelected && <CheckIcon className="h-3 w-3" />}
                            </div>
                            <span>{option.label}</span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
      {...controllerProps}
    />
  );
};

export default ControlledMultiSelect;
