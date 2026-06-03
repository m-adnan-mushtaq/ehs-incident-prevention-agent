import {
  ActionColumn,
  ColumnText,
  HeaderWrapper,
} from "@/components/column-def/base";
import { Badge } from "@/components/ui/badge";
import { commonHelpers } from "@/helpers";
import { cn } from "@/lib/utils";
import {
  IVendor,
  IVendorClassification,
  IVendorComplianceStatus,
  IVendorRiskLevel,
} from "@/services/governance/vendor.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const VendorRiskLevelChip = ({ level }: { level: IVendorRiskLevel }) => {
  const classesLookup: Record<IVendorRiskLevel, string> = {
    MEDIUM:
      "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    HIGH: "border-red-500 text-red-700 bg-red-50 hover:bg-red-100",
    LOW: "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[level],
        "rounded-full px-4 py-1 min-w-max border-2 font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(level.replace("_", " "))}
    </Badge>
  );
};

export const VendorComplianceChip = ({
  status,
}: {
  status: IVendorComplianceStatus;
}) => {
  const classesLookup: Record<IVendorComplianceStatus, string> = {
    REJECTED: "border-red-500 text-red-700 bg-red-50 hover:bg-red-100",
    MEET_REQUIREMENTS:
      "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[status],
        "rounded-full px-4 py-1 min-w-max border-2 font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(status.replace("_", " "))}
    </Badge>
  );
};

export const VendorClassificationChip = ({
  value,
}: {
  value: IVendorClassification;
}) => {
  const classesLookup: Record<IVendorClassification, string> = {
    PRIVATE:
      "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    PUBLIC: "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[value],
        "rounded-full px-4 py-1 min-w-max border-2 font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(value.replace("_", " "))}
    </Badge>
  );
};

export const useVendorColumns = ({
  dependencies = [],
  handleView = () => {},
  handleEdit = () => {},
  handleDelete = () => {},
}: ColumnDefProps<IVendor>) => {
  const columns = useMemo<ColumnDef<IVendor>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Vendor</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText className="flex items-center gap-2">
              <span className="inline-block size-2 bg-destructive rounded-full"></span>
              <span className="font-semibold">{info.row.original.name}</span>
            </ColumnText>
          );
        },
      },
      {
        accessorKey: "risk_level",
        header: () => <HeaderWrapper>Risk Level</HeaderWrapper>,
        cell: (info) => {
          const riskLevel = info.row.original.risk_level;
          return <VendorRiskLevelChip level={riskLevel} />;
        },
      },
      {
        accessorKey: "compliance_status",
        header: () => <HeaderWrapper>Requirements</HeaderWrapper>,
        cell: (info) => {
          return (
            <VendorComplianceChip
              status={info.row.original.compliance_status}
            />
          );
        },
      },
      {
        accessorKey: "Contracts",
        header: () => <HeaderWrapper>Contracts</HeaderWrapper>,
        cell: (info) => {
          const dueStatus = commonHelpers.getDueStatus(
            info.row.original.end_date
          );
          return (
            <ColumnText
              className={cn({ "text-destructive": dueStatus.isExpired })}
            >
              {dueStatus.statusLabel}
            </ColumnText>
          );
        },
      },
      ActionColumn<IVendor>({
        actions: [
          {
            label: "View Details",
            onClick: handleView,
          },
          {
            label: "Edit Vendor",
            onClick: handleEdit,
          },
          {
            label: "Remove Vendor",
            onClick: handleDelete,
          },
        ],
      }),
    ],
    dependencies
  );

  return {
    columns,
  };
};
