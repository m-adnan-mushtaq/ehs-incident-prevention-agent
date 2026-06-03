import { useParams } from "react-router";
import {
  useGetQuestionnaireById,
  useUpdateQuestionnaireById,
} from "../queries";
import ScreenLoader from "@/components/layout/screen-loader";
import ErrorMsg from "@/components/shared/error-msg";
import QuestionnaireForm from "../components/questionnaire/questionnaire-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getFileFromUrl } from "@/helpers/file";

const UpdateQuestionnaire = () => {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const { data, isError, isLoading } = useGetQuestionnaireById(params.id);
  const { mutateAsync } = useUpdateQuestionnaireById();

  useEffect(() => {
    if (data?.data?.evidence) {
      async function downloadBlob() {
        try {
          const file = await getFileFromUrl(data?.data?.evidence!);
          setEvidenceFile(file);
        } catch (error) {
          toast.error("Error downloading file");
        } finally {
          setLoading(false);
        }
      }
      downloadBlob();
    }
  }, [data?.data]);

  if (isLoading || loading) {
    return <ScreenLoader isProtected />;
  }

  if (isError) {
    return <ErrorMsg />;
  }

  const result = data?.data;

  return (
    <QuestionnaireForm
      handleSubmit={async (data) => {
        if (!params.id) return;
        await mutateAsync({
          id: params.id,
          formData: data,
        });
      }}
      type="update"
      key={evidenceFile?.name || "1"}
      defaultValues={
        {
          data: result?.data,
          evidence: evidenceFile ? [evidenceFile] : [],
          name: result?.name,
          scope: result?.scope,
          status: result?.status,
        } as any
      }
    />
  );
};

export default UpdateQuestionnaire;
