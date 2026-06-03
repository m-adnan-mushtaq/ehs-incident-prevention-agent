import ControlledFileInput from "@/components/form/ControlledFileInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import { IQuestionnaireSchema } from "@/lib/validation/questionnaire.validation";
import {
  questionnaireScopeOptions,
  questionnaireStatusOptions,
} from "@/services/governance/questionnaire.service";
import { useFormContext } from "react-hook-form";

const QuestionnairePropertiesForm = () => {
  const { control } = useFormContext<IQuestionnaireSchema>();
  return (
    <div className="space-y-4 md:space-y-6 bg-white p-4 mb-2 rounded">
      <ControlledSelect
        name="scope"
        label="Scope"
        placeholder="Select scope"
        control={control}
        options={questionnaireScopeOptions}
      />
      <ControlledSelect
        name="status"
        label="Status"
        placeholder="Select Status"
        control={control}
        options={questionnaireStatusOptions}
      />
      <ControlledFileInput
        name="evidence"
        label="Evidence"
        placeholder="Click or Drag Evidence Max 10MB"
        control={control}
        accept={{
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/pdf": [".pdf"],
          "text/html": [".html", ".htm"],
          "image/*": [],
        }}
        description="Only .docx, .pdf, .html, .htm and image files are allowed"
        maxFiles={1}
        maxSize={10485760} // 10MB
      />
    </div>
  );
};

export default QuestionnairePropertiesForm;
