import {
  ActionColumn,
  ColumnText,
  getDateTimeColumns,
  HeaderWrapper,
} from "@/components/column-def/base";
import { Badge } from "@/components/ui/badge";
import { commonHelpers } from "@/helpers";
import { cn } from "@/lib/utils";
import {
  IQuestionnaire,
  QuestionnaireScope,
  QuestionnaireStatus,
} from "@/services/governance/questionnaire.service";
import { ColumnDefProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export const QuestionnaireStatusChip = ({
  status,
}: {
  status: QuestionnaireStatus;
}) => {
  const classesLookup: Record<QuestionnaireStatus, string> = {
    DRAFT: "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    STOPPED: "border-red-500 text-red-700 bg-red-50 hover:bg-red-100",
    SHARED: "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
    COMPLETED: "border-green-500 text-green-700 bg-green-50 hover:bg-green-100",
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

export const QuestionnaireScopeChip = ({
  value,
}: {
  value: QuestionnaireScope;
}) => {
  const classesLookup: Record<QuestionnaireScope, string> = {
    SECURITY:
      "border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100",
    LEGAL: "border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100",
    OTHER: "border-gray-500 text-gray-700 bg-gray-50 hover:bg-gray-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        classesLookup[value],
        "rounded-full px-4 py-1  min-w-max border-2 font-medium transition-colors"
      )}
    >
      {commonHelpers.toTitleCase(value.replace("_", " "))}
    </Badge>
  );
};

export const useQuestionnaireColumns = ({
  dependencies = [],
  handleEdit = () => {},
  handleDelete = () => {},
  handleView = () => {},
}: ColumnDefProps<IQuestionnaire>) => {
  const columns = useMemo<ColumnDef<IQuestionnaire>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <HeaderWrapper>Name</HeaderWrapper>,
        cell: (info) => {
          return (
            <ColumnText className="font-semibold">
              {info.row.original.name}
            </ColumnText>
          );
        },
      },

      {
        accessorKey: "scope",
        header: () => <HeaderWrapper>Scope</HeaderWrapper>,
        cell: (info) => {
          return <QuestionnaireScopeChip value={info.row.original.scope} />;
        },
      },
      {
        accessorKey: "status",
        header: () => <HeaderWrapper>Status</HeaderWrapper>,
        cell: (info) => {
          return <QuestionnaireStatusChip status={info.row.original.status} />;
        },
      },
      ...getDateTimeColumns<IQuestionnaire>(),
      ActionColumn<IQuestionnaire>({
        actions: [
          {
            label: "View Details",
            onClick: handleView,
          },
          {
            label: "Update Details",
            onClick: handleEdit,
          },
          {
            label: "Remove Entry",
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
