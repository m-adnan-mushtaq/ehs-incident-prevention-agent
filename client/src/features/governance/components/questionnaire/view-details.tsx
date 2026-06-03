import DetailsPreview from "@/components/shared/details-preview";
import { IQuestionnaire } from "@/services/governance/questionnaire.service";
import { QuestionnaireScopeChip, QuestionnaireStatusChip } from "./column-def";
import FileLinkPreview from "@/components/shared/file-preview";

const QuestionnaireDetails = ({
  questionnaire,
}: {
  questionnaire: IQuestionnaire;
}) => {
  return (
    <div className="w-[80vw] max-w-screen-sm">
      <DetailsPreview
        columns={[
          {
            label: "Name",
            value: questionnaire.name,
          },
          {
            label: "Status",
            value: <QuestionnaireStatusChip status={questionnaire.status} />,
          },
          {
            label: "Scope",
            value: <QuestionnaireScopeChip value={questionnaire.scope} />,
          },
          {
            label: "Evidence",
            value: <FileLinkPreview fileUrl={questionnaire.evidence} />,
          },
        ]}
      />
    </div>
  );
};

export default QuestionnaireDetails;
