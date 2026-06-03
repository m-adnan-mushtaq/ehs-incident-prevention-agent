import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { GenericTabs } from "@/components/shared/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MODAL_TYPE, useModal } from "@/hooks/use-modal";
import { useFormBuilderStore } from "@/store/form-builder";
import { FileText, ListChecks, Menu, Pencil } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import FormCanvas from "./form-canvas";
import FieldProperties from "./field-properties";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveSidebar from "@/components/shared/responsive-sidebar";
import Questionnaire_FormRender from "./form-render";

type ITab = "builder" | "view";

const tabs = [
  {
    label: (
      <span className="flex items-center gap-2">
        <FileText />
        <span>Build</span>
      </span>
    ),
    value: "builder",
  },
  {
    label: (
      <span className="flex items-center gap-2">
        <ListChecks />
        View
      </span>
    ),
    value: "view",
  },
];

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState<ITab>("builder");
  const { formJson, updateFormJson, resetFormJson, activeQuestionId } =
    useFormBuilderStore();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState({
    title: false,
  });

  const { modalState, modalStateHandler } = useModal();
  const isMobile = useIsMobile(1080);

  const toggleEditMode = (key: string, value: boolean) => {
    setEditMode((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDiscardChanges = () => {
    resetFormJson();
    modalStateHandler(MODAL_TYPE.DELETE, false);
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="flex-1 text-center">
            <div className="max-w-fit mx-auto">
              <GenericTabs
                activeTab={activeTab}
                onTabChange={(value) => setActiveTab(value as ITab)}
                listClassName="bg-white"
                tabTriggerClassName="data-[state=active]:text-primary data-[state=active]:bg-primary/10 data-[state=active]:border data-[state=active]:border-primary"
                tabs={tabs}
              />
            </div>
          </div>
        </div>
        {activeTab === "builder" && (
          <div className="my-2 space-y-4">
            <div className="lg:hidden text-right">
              <Button
                onClick={() => {
                  modalStateHandler(MODAL_TYPE.EDIT, true);
                }}
                variant={"outline"}
              >
                <Menu /> Properties
              </Button>
            </div>
            {editMode?.title ? (
              <Input
                value={formJson?.title}
                className="bg-white !ring-primary/30 max-w-sm"
                onChange={(e) => {
                  updateFormJson({ title: e.target.value });
                }}
                onBlur={() => {
                  toggleEditMode("title", false);
                }}
              />
            ) : (
              <h2 className="text-2xl flex gap-2 font-semibold  items-center">
                {formJson?.title}
                <Pencil
                  className="size-4 cursor-pointer"
                  onClick={() => {
                    toggleEditMode("title", true);
                  }}
                />
              </h2>
            )}
            <div className="grid w-full lg:grid-cols-4 flex-1 h-full max-h-screen overflow-auto gap-4">
              <div className="lg:col-span-3 border border-primary/30 border-dashed rounded-lg p-2">
                <FormCanvas />
              </div>
              <ResponsiveSidebar
                isMobile={isMobile}
                isOpen={modalState.edit}
                setIsOpen={(isOpen: boolean) => {
                  modalStateHandler(MODAL_TYPE.EDIT, isOpen);
                }}
                side="right"
              >
                <div className="bg-white col-span-2 md:col-span-1 rounded p-4">
                  <FieldProperties key={activeQuestionId} />
                </div>
              </ResponsiveSidebar>
            </div>
          </div>
        )}
        {activeTab === "view" && (
          <Questionnaire_FormRender formJson={formJson} />
        )}
      </div>

      <ConfirmationDialog
        open={modalState.delete}
        title="Are you want to discard changes?"
        description="You have unsaved changes. Are you sure you want to discard them?"
        handleClose={() => {
          modalStateHandler(MODAL_TYPE.DELETE, false);
        }}
        handleDelete={handleDiscardChanges}
        deleteVariant="default"
        deleteBtnText="Discard"
      />
    </>
  );
};

export default FormBuilder;
