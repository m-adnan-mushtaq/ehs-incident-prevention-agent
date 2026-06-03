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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

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

const ControlledDateTimeInput = ({
  label,
  name,
  control,
  description = "",
  placeholder = "dd/MM/YYYY hh:mm aa",
  disabled,
  calendarProps,
  controllerProps = {},
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: {
          value: Boolean(label),
          message: "This field is required",
        },
      }}
      render={({ field }) => {
        const fieldValue = field.value ? new Date(field.value) : undefined;
        const hours = Array.from({ length: 12 }, (_, i) => i + 1);

        const handleDateSelect = (selectedDate: Date | undefined) => {
          if (selectedDate) {
            const currentDate = field.value
              ? new Date(field.value)
              : new Date();
            selectedDate.setHours(currentDate.getHours());
            selectedDate.setMinutes(currentDate.getMinutes());
            field.onChange(selectedDate);
          }
        };

        const handleTimeChange = (
          type: "hour" | "minute" | "ampm",
          value: string
        ) => {
          if (field.value) {
            const newDate = new Date(field.value);
            if (type === "hour") {
              newDate.setHours(
                (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
              );
            } else if (type === "minute") {
              newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
              const currentHours = newDate.getHours();
              const newHours =
                value === "PM" ? (currentHours % 12) + 12 : currentHours % 12;
              newDate.setHours(newHours);
            }
            field.onChange(newDate);
          }
        };

        return (
          <FormItem>
            {Boolean(label) && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Popover modal open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                    onClick={() => {
                      if (!disabled) setIsOpen((prev) => !prev);
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "dd/MM/yyyy hh:mm aa")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-40 p-0">
                  <div className="sm:flex">
                    {/* Calendar for Date Selection */}
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateSelect as any}
                      disabled={disabled}
                      initialFocus
                      {...(calendarProps || {})}
                    />

                    {/* Time Selection */}
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      {/* Hour Selection */}
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {hours.reverse().map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              variant={
                                fieldValue &&
                                fieldValue.getHours() % 12 === hour % 12
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() =>
                                handleTimeChange("hour", hour.toString())
                              }
                              disabled={disabled}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>

                      {/* Minute Selection */}
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 60 }, (_, i) => i).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  fieldValue &&
                                  fieldValue.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("minute", minute.toString())
                                }
                                disabled={disabled}
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>

                      {/* AM/PM Selection */}
                      <ScrollArea>
                        <div className="flex sm:flex-col p-2">
                          {["AM", "PM"].map((ampm) => (
                            <Button
                              key={ampm}
                              size="icon"
                              variant={
                                fieldValue &&
                                ((ampm === "AM" &&
                                  fieldValue.getHours() < 12) ||
                                  (ampm === "PM" &&
                                    fieldValue.getHours() >= 12))
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => handleTimeChange("ampm", ampm)}
                              disabled={disabled}
                            >
                              {ampm}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
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

export default ControlledDateTimeInput;
