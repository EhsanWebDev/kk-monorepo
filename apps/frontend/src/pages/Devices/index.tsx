import { useQuery } from "@tanstack/react-query";
import { ShopTable } from "./components/ShopTable";
import { columns } from "./components/columns";
import type { Device } from "@repo/types";
import {
  type SortingState,
  type ColumnFiltersState,
  functionalUpdate,
} from "@tanstack/react-table";
import { useQueryStates, parseAsString } from "nuqs";
// ── API ──────────────────────────────────────────────────────────────────────
interface FetchDevicesParams {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}

const fetchDevices = async ({ sorting, columnFilters }: FetchDevicesParams) => {
  const params = new URLSearchParams();

  // sorting
  if (sorting.length > 0) {
    params.set("sortBy", sorting[0]!.id);
    params.set("sort", sorting[0]!.desc ? "desc" : "asc");
  }

  // each filter becomes its own query param
  for (const filter of columnFilters) {
    params.set(filter.id, String(filter.value));
  }

  const res = await fetch(
    `http://localhost:5000/api/devices?${params.toString()}`,
  );
  if (!res.ok) throw new Error("Failed to fetch devices");
  return res.json() as Promise<{ devices: Device[] }>;
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Devices() {
  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [params, setParams] = useQueryStates({
    sortBy: parseAsString.withDefault(""),
    sort: parseAsString,
    manufacturer: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
    condition: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
  });
  const sorting: SortingState = params.sortBy
    ? [{ id: params.sortBy, desc: params.sort === "desc" }]
    : [];

  const columnFilters: ColumnFiltersState = [
    { id: "manufacturer", value: params.manufacturer },
    { id: "type", value: params.type },
    { id: "condition", value: params.condition },
    { id: "status", value: params.status },
  ].filter((f) => f.value !== "");

  const onSortingChange = (updater: any) => {
    const next: SortingState = functionalUpdate(updater, sorting);

    if (next.length === 0) {
      setParams({ sortBy: "", sort: null });
    } else {
      setParams({
        sortBy: next[0]!.id,
        sort: next[0]!.desc ? "desc" : "asc",
      });
    }
  };

  const onColumnFiltersChange = (updater: any) => {
    const next: ColumnFiltersState = functionalUpdate(updater, columnFilters);
    setParams({
      manufacturer:
        (next.find((x) => x.id === "manufacturer")?.value as string) ?? "",
      type: (next.find((x) => x.id === "type")?.value as string) ?? "",
      condition:
        (next.find((x) => x.id === "condition")?.value as string) ?? "",
      status: (next.find((x) => x.id === "status")?.value as string) ?? "",
    });
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["devices", sorting, columnFilters], // refetches when either changes
    queryFn: () => fetchDevices({ sorting, columnFilters }),
    placeholderData: (prev) => prev, // keeps old data while fetching
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-destructive font-medium">Failed to load devices</p>
        <p className="text-sm text-muted-foreground">
          Check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* subtle overlay while refetching (not initial load) */}
      {isFetching && !isLoading && (
        <div className="absolute inset-0 z-10 bg-background/40 rounded-md" />
      )}

      <ShopTable
        columns={columns}
        data={data?.devices ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        sorting={sorting}
        columnFilters={columnFilters}
        onSortingChange={onSortingChange}
        onColumnFiltersChange={onColumnFiltersChange}
      />
    </div>
  );
}
