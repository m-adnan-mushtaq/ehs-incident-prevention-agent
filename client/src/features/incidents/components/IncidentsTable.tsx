import DataTable from "@/components/shared/data-table";
import type { PaginationWrapperProps } from "@/components/hoc/withPaginatedQuery";
import type { IIncident } from "@/types/incident";
import type { ISite } from "@/types/site";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FILTER_ALL,
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  INCIDENT_TYPES,
  SEVERITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "../utils/incident.constants";

type Props = PaginationWrapperProps<IIncident> & {
  columns: ColumnDef<IIncident>[];
  sites: ISite[];
};

export const IncidentsTable = ({
  data,
  columns,
  sites,
  isLoading,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  totalRecords,
  handleSearch,
  search,
  additionalFilters,
  setAdditionalFilters,
}: Props) => {
  const setFilter = (key: string, value: string) => {
    setAdditionalFilters((prev) => {
      const next = { ...prev };
      if (!value || value === FILTER_ALL) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const hasFilters =
    Boolean(search) || Object.keys(additionalFilters).length > 0;
  const emptyPlaceholder = hasFilters
    ? "No incidents match your filters."
    : "No incidents reported yet. Report incidents and near misses so the safety team can learn from them and prevent repeat events.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="w-full sm:w-40">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Site
          </label>
          <select
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
            value={String(additionalFilters.site_id ?? FILTER_ALL)}
            onChange={(e) => setFilter("site_id", e.target.value)}
          >
            <option value={FILTER_ALL}>All sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <FilterSelect
          label="Severity"
          value={String(additionalFilters.severity ?? FILTER_ALL)}
          onChange={(v) => setFilter("severity", v)}
          options={INCIDENT_SEVERITIES.map((s) => ({
            value: s,
            label: SEVERITY_LABELS[s],
          }))}
        />
        <FilterSelect
          label="Status"
          value={String(additionalFilters.status ?? FILTER_ALL)}
          onChange={(v) => setFilter("status", v)}
          options={INCIDENT_STATUSES.map((s) => ({
            value: s,
            label: STATUS_LABELS[s],
          }))}
        />
        <FilterSelect
          label="Type"
          value={String(additionalFilters.incident_type ?? FILTER_ALL)}
          onChange={(v) => setFilter("incident_type", v)}
          options={INCIDENT_TYPES.map((t) => ({
            value: t,
            label: TYPE_LABELS[t],
          }))}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <DataTable
          columns={columns as never}
          data={data}
          total={totalRecords}
          sorting={sortModel}
          setSorting={setSortModel}
          loading={isLoading}
          pagination={paginationModel}
          setPagination={setPaginationModel}
          visiblePagination
          emptyPlaceholder={emptyPlaceholder}
          search={search}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
};

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="w-full sm:w-40">
    <label className="mb-1 block text-xs font-medium text-slate-500">
      {label}
    </label>
    <select
      className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value={FILTER_ALL}>All</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
