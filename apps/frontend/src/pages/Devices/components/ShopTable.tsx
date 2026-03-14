import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Table as TableT,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { DataTablePagination } from "./Pagination";
import { ComboBoxResponsive } from "@/components/ComboBoxResponsive";
import { X } from "lucide-react";
import { conditions, statuses, types, type Device } from "@repo/types";

// ── filter config aligned to ALLOWED_FILTER_FIELDS ──────────────────────────
const FILTERS: {
  column: keyof Device;
  label: string;
  options: readonly string[];
}[] = [
  {
    column: "manufacturer",
    label: "Manufacturer",
    options: [
      "Apple",
      "Samsung",
      "Xiaomi",
      "Google",
      "OnePlus",
      "Oppo",
      "Vivo",
      "Sony",
      "Motorola",
      "Nokia",
    ],
  },
  {
    column: "type",
    label: "Type",
    options: types,
  },
  {
    column: "condition",
    label: "Condition",
    options: conditions,
  },
];

// ── form schema ──────────────────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(1, { message: "Enter Name" }),
  manufacturer: z.string({ message: "Please select a brand." }),
  type: z.enum(["mobile", "gadget", "audio", "other"]),
  condition: z.enum(["new", "used", "refurbished"]),
  cost_price: z.number({ message: "Enter Price" }).min(0),
  quantity: z.number({ message: "Enter Quantity" }).min(0),
});

// ── toolbar ──────────────────────────────────────────────────────────────────
function Toolbar<T>({
  table,
  columnFilters,
  isFetching,
  sorting,
  onSortingChange,
}: {
  table: TableT<T>;
  columnFilters: ColumnFiltersState;
  isFetching?: boolean;
  sorting: SortingState;
  onSortingChange: (updater: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasFilters = columnFilters.length > 0;
  const hasSorting = sorting.length > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", quantity: 1, cost_price: 0 },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values); // wire up mutation here
    setIsOpen(false);
    form.reset();
  }
  function getFilterValue(column: string) {
    return (columnFilters.find((f) => f.id === column)?.value as string) ?? "";
  }

  return (
    <div className={isFetching ? "pointer-events-none opacity-60" : ""}>
      <div className="space-y-3 py-4">
        {/* row 1 — search + add */}
        <div className="flex items-center justify-between gap-3">
          <Input
            placeholder="Search devices..."
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="w-60 md:w-80"
          />
          <Button
            onClick={() => {
              form.reset();
              setIsOpen(true);
            }}
          >
            Add Device
          </Button>
        </div>

        {/* row 2 — filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map(({ column, label, options }) => (
            <Select
              key={column}
              value={getFilterValue(column)}
              onValueChange={(val) =>
                table
                  .getColumn(column)
                  ?.setFilterValue(val === "_all" ? undefined : val)
              }
            >
              <SelectTrigger className="h-8 w-[140px] text-xs capitalize">
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All {label}s</SelectItem>
                {options.map((o) => (
                  <SelectItem key={o} value={o} className="capitalize">
                    {o.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {/* clear all filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              onClick={() => table.resetColumnFilters()}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
          {hasSorting && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground"
              onClick={() => onSortingChange([])}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear sort
              <span className="ml-1 text-xs font-medium text-foreground">
                {sorting[0]?.id} ({sorting[0]?.desc ? "desc" : "asc"})
              </span>
            </Button>
          )}
        </div>

        {/* add device dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            className="max-w-sm sm:max-w-[425px]"
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogDescription hidden>
              Add a new device to inventory.
            </DialogDescription>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-x-6 gap-y-4 mt-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Device name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2.5">Brand</FormLabel>
                      <FormControl>
                        <ComboBoxResponsive
                          options={FILTERS[0].options.map((o) => ({
                            value: o,
                            label: o,
                          }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Brand"
                          searchPlaceholder="Search brand..."
                          emptyMessage="No brand found."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["mobile", "gadget", "audio", "other"].map((t) => (
                            <SelectItem
                              key={t}
                              value={t}
                              className="capitalize"
                            >
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["new", "used", "refurbished"].map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="capitalize"
                            >
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cost_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="1"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                >
                  Add Device
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// ── main table ───────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isFetching?: boolean;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  onSortingChange: (s: SortingState) => void;
  onColumnFiltersChange: (f: ColumnFiltersState) => void;
}

export function ShopTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isFetching,
  sorting,
  columnFilters,
  onSortingChange,
  onColumnFiltersChange,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const navigate = useNavigate();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    manufacturer: false,
    type: false,
    condition: false,
    status: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onSortingChange: onSortingChange,
    onColumnFiltersChange: onColumnFiltersChange,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Toolbar
        table={table}
        columnFilters={columnFilters}
        isFetching={isFetching}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    navigate(`/inventory/${(row.original as any).id}`)
                  }
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        pageSize={table.getState().pagination.pageSize}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  );
}
