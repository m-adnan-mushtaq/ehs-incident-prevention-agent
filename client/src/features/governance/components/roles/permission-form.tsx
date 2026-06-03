import { toTitleCase } from "@/helpers/common";
import { useFormContext } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllPermissions } from "../../queries";
import ErrorMsg from "@/components/shared/error-msg";
import BoxesSkeleton from "@/components/shared/boxes-skeleton";

const PermissionMatrix = () => {
  const { isLoading, data, isError } = useGetAllPermissions();

  const form = useFormContext<{
    permissions: number[];
  }>();

  const permissionOptions = data?.data || [];

  // Precompute entity map and action lookup for O(1) access
  const { entities, entityActionMap } = useMemo(() => {
    const entitySet = new Set<string>();
    const actionMap: Record<string, { action: string; id: number }[]> = {};

    permissionOptions.forEach((perm) => {
      const match = perm.codename.match(/^(\w+)_(.+)$/); // extract action and entity
      if (!match) return;

      const [, action, entity] = match;
      entitySet.add(entity);

      if (!actionMap[entity]) {
        actionMap[entity] = [];
      }
      actionMap[entity].push({ action, id: perm.id });
    });

    return {
      entities: Array.from(entitySet),
      entityActionMap: actionMap,
    };
  }, [permissionOptions]);

  const handleAllToggle = (entity: string) => {
    const allIds = entityActionMap[entity]?.map((a) => a.id) || [];
    const current = form.getValues("permissions") || [];

    const isFullySelected = allIds.every((id) => current.includes(id));

    const updated = isFullySelected
      ? current.filter((id) => !allIds.includes(id))
      : Array.from(new Set([...current, ...allIds]));

    form.setValue("permissions", updated);
  };

  const handleActionToggle = (entity: string, actionType: string) => {
    const action = entityActionMap[entity]?.find(
      (a) => a.action === actionType
    );
    if (!action) return;

    const current = form.getValues("permissions") || [];
    const isChecked = current.includes(action.id);

    let updated = isChecked
      ? current.filter((id) => id !== action.id)
      : [...current, action.id];

    // Auto-select 'view' if selecting 'add' or 'change'
    if (!isChecked && (actionType === "add" || actionType === "change")) {
      const viewAction = entityActionMap[entity]?.find(
        (a) => a.action === "view"
      );
      if (viewAction && !updated.includes(viewAction.id)) {
        updated = [...updated, viewAction.id];
      }
    }

    form.setValue("permissions", updated);
  };

  const permissions = form.watch("permissions") || [];

  if (isError) {
    return <ErrorMsg message="Fail to fetch permissions" />;
  }

  if (isLoading) {
    return <BoxesSkeleton count={1} columns="grid-cols-1" size="w-full h-96" />;
  }

  return (
    <>
      <div className="border border-primary/50 rounded-xl p-4">
        <Table className="border-spacing-0 border-collapse">
          <TableHeader className="border-0">
            <TableRow className="!border-b-0">
              {[
                "Action",
                "View",
                "Add",
                "Edit",
                "Approve",
                "Remove",
                "All",
              ].map((action) => (
                <TableHead
                  key={action}
                  className="text-foreground text-sm px-2"
                >
                  {action}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {entities.map((entity) => (
              <TableRow className="border-b-0" key={entity}>
                <TableCell className="capitalize text-[0.9rem] px-4 font-semibold">
                  <span className="block md:min-w-80">
                    {toTitleCase(entity)} Management
                  </span>
                </TableCell>

                {["view", "add", "change", "approve", "delete"].map(
                  (action) => {
                    const target = entityActionMap[entity]?.find(
                      (a) => a.action === action
                    );

                    if (!target) {
                      return <TableCell key={action} />;
                    }

                    return (
                      <TableCell className="text-lg" key={action}>
                        <Checkbox
                          onCheckedChange={() =>
                            handleActionToggle(entity, action)
                          }
                          className="border-primary/50"
                          checked={permissions.includes(target.id)}
                        />
                      </TableCell>
                    );
                  }
                )}

                <TableCell>
                  <Checkbox
                    onCheckedChange={() => handleAllToggle(entity)}
                    checked={entityActionMap[entity]?.every((perm) =>
                      permissions.includes(perm.id)
                    )}
                    className="border-primary/50"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {form.formState.errors.permissions && (
        <p className="text-red-500 text-sm font-semibold">
          {form.formState.errors.permissions.message}
        </p>
      )}
    </>
  );
};

export default PermissionMatrix;
