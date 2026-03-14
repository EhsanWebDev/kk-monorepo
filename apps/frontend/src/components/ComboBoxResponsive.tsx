import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export type ComboOption = {
  value: string;
  label: string;
};

interface ComboBoxResponsiveProps {
  options: ComboOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

function OptionList({
  options,
  value,
  onChange,
  searchPlaceholder,
  emptyMessage,
  setOpen,
}: {
  options: ComboOption[];
  value?: string;
  onChange: (value: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Command>
      <CommandInput
        placeholder={searchPlaceholder ?? "Search..."}
        className="h-9"
      />
      <CommandList>
        <CommandEmpty>{emptyMessage ?? "No results found."}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(val) => {
                onChange(val);
                setOpen(false);
              }}
              className="flex items-center justify-between"
            >
              <div>{option.label}</div>
              <CheckIcon
                className={cn(
                  "h-4 w-4 shrink-0",
                  value === option.value ? "opacity-100" : "opacity-0",
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function ComboBoxResponsive({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder,
  emptyMessage,
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selected = options.find((o) => o.value === value);

  const trigger = (
    <Button
      variant="outline"
      role="combobox"
      className={cn(
        "w-full justify-between",
        !value && "text-muted-foreground",
      )}
    >
      {selected ? selected.label : placeholder}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const listProps = {
    options,
    value,
    onChange,
    searchPlaceholder,
    emptyMessage,
    setOpen,
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <OptionList {...listProps} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionList {...listProps} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
