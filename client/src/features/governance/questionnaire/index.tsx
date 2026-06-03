import Container from "@/components/layout/container";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table";
import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { useQuestionnaireColumns } from "../components/questionnaire/column-def";
import { IQuestionnaire } from "@/services/governance/questionnaire.service";
import { useNavigate } from "react-router";
import {
  useDeleteQuestionnaireById,
  useGetAllQuestionnaires,
} from "../queries";
import ErrorMsg from "@/components/shared/error-msg";
import toast from "react-hot-toast";
import { showMutationError } from "@/helpers/common";
import { useFormBuilderStore } from "@/store/form-builder";
import GenericDialog from "@/components/shared/generic-dialog";
import QuestionnaireDetails from "../components/questionnaire/view-details";

const QuestionnairePage = () => {
  const { data, isLoading, isError } = useGetAllQuestionnaires();
  const { mutateAsync: deleteById } = useDeleteQuestionnaireById();
  const resetFormJson = useFormBuilderStore((store) => store.resetFormJson);
  const updateFormJson = useFormBuilderStore((store) => store.updateFormJson);

  const { modalState, modalStateHandler } = useModal();
  const [selectedRow, setSelectedRow] = useState<IQuestionnaire>();
  const navigate = useNavigate();

  const { columns } = useQuestionnaireColumns({
    handleEdit(payload) {
      updateFormJson(payload.data);
      navigate(`/dashboard/questionnaire/edit/${payload.id}`);
    },
    handleDelete(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.DELETE, true);
    },
    handleView(payload) {
      setSelectedRow(payload);
      modalStateHandler(MODAL_TYPE.VIEW, true);
    },
  });

  const records = data?.data || [];

  const handleDelete = async () => {
    try {
      if (!selectedRow?.id) return;
      await deleteById(selectedRow.id);
      modalStateHandler(MODAL_TYPE.DELETE, false);
      toast.success("Questionnaire deleted successfully");
    } catch (error) {
      showMutationError(error);
    }
  };

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
          <h2 className="text-lg md:text-2xl">Questionnaires</h2>
          <Button
            size={"lg"}
            onClick={() => {
              resetFormJson();
              navigate("/dashboard/questionnaire/create");
            }}
          >
            <Plus /> New Questionnaire
          </Button>
        </div>
        <DataTable
          columns={columns as any}
          data={records}
          total={records.length}
          visiblePagination={false}
          skipSorting
          loading={isLoading}
          emptyPlaceholder="No questionnaires found, try creating one"
        />
      </Container>

      {!!selectedRow && (
        <>
          <GenericDialog
            title="View Questionnaire"
            open={modalState.view}
            onClose={() => modalStateHandler(MODAL_TYPE.VIEW, false)}
          >
            <QuestionnaireDetails questionnaire={selectedRow} />
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

export default QuestionnairePage;
