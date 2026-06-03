import Container from "@/components/layout/container";
import GenericDialog from "@/components/shared/generic-dialog";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import {
  IVendor,
  IVendorRiskLevel,
} from "@/services/governance/vendor.service";
import { useMemo, useState } from "react";
import { useVendorColumns } from "../components/vendor/columnDef";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumn, Plus, Users } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import VendorForm from "../components/vendor/vendor-form";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { BgCard, IconCard } from "@/components/shared/cards";
import {
  useCreateNewVendor,
  useDeleteVendorById,
  useGetAllVendors,
  useUpdateVendorById,
} from "../queries";
import toast from "react-hot-toast";
import { showMutationError } from "@/helpers/common";
import ErrorMsg from "@/components/shared/error-msg";
import VendorDetails from "../components/vendor/vendor-details";

const VendorsPage = () => {
  //api calls
  const { data, isLoading, isError } = useGetAllVendors();
  const { mutateAsync: createNew } = useCreateNewVendor();
  const { mutateAsync: updateById } = useUpdateVendorById();
  const { mutateAsync: deleteById } = useDeleteVendorById();
  //modal
  const { modalState, modalStateHandler } = useModal();
  const [selectedRow, setSelectedRow] = useState<IVendor>();
  const { columns } = useVendorColumns({
    handleView(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.VIEW, true);
    },
    handleEdit(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.EDIT, true);
    },
    handleDelete(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
  });

  const handleDelete = async () => {
    try {
      if (!selectedRow?.id) return;
      await deleteById(selectedRow.id);
      modalStateHandler(MODAL_TYPE.DELETE, false);
      toast.success("Vendor deleted successfully");
    } catch (error) {
      showMutationError(error);
    }
  };

  const records = data?.data || [];

  const { highRisk } = useMemo(() => {
    let highRisk = 0;
    if (records.length) {
      highRisk = records.filter(
        (item) => item.risk_level === IVendorRiskLevel.HIGH
      ).length;
    }
    return {
      highRisk,
    };
  }, [records]);

  if (isError) {
    return (
      <Container>
        <ErrorMsg />
      </Container>
    );
  }

  return (
    <>
      <Container>
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-2xl">Third-party Governance</h2>
          <Button
            size={"lg"}
            onClick={() => modalStateHandler(MODAL_TYPE.CREATE, true)}
          >
            <Plus /> New Vendor
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 items-center">
          <IconCard
            Icon={Users}
            iconClassName="bg-gradient-to-br from-30% from-primary to-dark-primary text-primary-foreground"
            label="Vendors"
            value={`${records.length}`}
          />
          <IconCard
            Icon={ChartNoAxesColumn}
            iconClassName="bg-primary-light text-primary"
            label="High Risk"
            value={`${highRisk}`}
            visibleGraph
          />
          <BgCard label="Total Suggestions" value="5" />
        </div>
        <DataTable
          columns={columns as any}
          data={records}
          total={records.length}
          visiblePagination={false}
          skipSorting
          loading={isLoading}
          emptyPlaceholder="No vendors found, please add one"
        />
      </Container>

      <GenericDialog
        title="Add Vendor"
        open={modalState.create}
        onClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
      >
        <VendorForm
          handleClose={() => modalStateHandler(MODAL_TYPE.CREATE, false)}
          handleSubmit={async (payload) => {
            await createNew(payload);
          }}
        />
      </GenericDialog>

      {!!selectedRow && (
        <>
          <GenericDialog
            title="View Vendor"
            open={modalState.view}
            onClose={() => modalStateHandler(MODAL_TYPE.VIEW, false)}
          >
            <VendorDetails vendor={selectedRow} />
          </GenericDialog>
          <GenericDialog
            title="Update Vendor"
            open={modalState.edit}
            onClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
          >
            <VendorForm
              type="update"
              defaultValues={selectedRow}
              handleClose={() => modalStateHandler(MODAL_TYPE.EDIT, false)}
              handleSubmit={async (payload) => {
                await updateById({
                  id: selectedRow.id,
                  payload,
                });
              }}
            />
          </GenericDialog>
          <ConfirmationDialog
            open={modalState.delete}
            deleteVariant={"destructive"}
            deleteBtnText="Confirm"
            handleClose={() => modalStateHandler(MODAL_TYPE.DELETE, false)}
            handleDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};

export default VendorsPage;
