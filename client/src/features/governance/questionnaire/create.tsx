import QuestionnaireForm from "../components/questionnaire/questionnaire-form";
import { useCreateNewQuestionnaire } from "../queries";

const CreateQuestionnaire = () => {
  const { mutateAsync } = useCreateNewQuestionnaire();
  return (
    <QuestionnaireForm
      handleSubmit={async (data) => {
        await mutateAsync(data);
      }}
    />
  );
};

export default CreateQuestionnaire;
