import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Device } from "@repo/types";

const conditionDot: Record<Device["condition"], string> = {
  new: "bg-emerald-500",
  used: "bg-transparent",
  refurbished: "bg-transparent",
  returned: "bg-yellow-400",
};

function SortableHeader({ column, label }: { column: any; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    </Button>
  );
}

export const columns: ColumnDef<Device>[] = [
  // Device name — manufacturer badge + name + condition dot
  {
    accessorKey: "name",
    header: "Device Name",
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const { name, manufacturer, condition } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium shrink-0">
            {manufacturer}
          </Badge>
          <span className="font-medium">{name}</span>
          <span
            className={`h-2 w-2 rounded-full shrink-0 ${conditionDot[condition]}`}
            title={condition}
          />
        </div>
      );
    },
  },

  // Stock
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortableHeader column={column} label="Stock" />,
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("quantity")}</span>
    ),
  },

  // Cost
  {
    accessorKey: "cost_price",
    header: ({ column }) => <SortableHeader column={column} label="Cost" />,
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        Rs {(row.getValue("cost_price") as number).toLocaleString()}
      </span>
    ),
  },

  // Hidden filter-only columns
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "includesString",
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "equals",
  },
  {
    accessorKey: "condition",
    header: "Condition",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "equals",
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: "equals",
  },

  // Sell button
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          size="icon"
          className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={(e) => {
            e.stopPropagation(); // prevent row click navigation
            console.log("sell", row.original.id); // wire up sell action here
          }}
        >
          <span className="text-sm font-bold">$</span>
        </Button>
      </div>
    ),
  },
];
