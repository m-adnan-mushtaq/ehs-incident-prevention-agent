import { useDocumentManagementColumns } from "@/components/column-def/document-management";
import DataTable from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { mock_documents } from "@/constants/mock";
import { IDocument } from "@/services/document.service";
import { Plus } from "lucide-react";
import { useState } from "react";

const MainPage = () => {
  const [skipColumns, setSkipColumns] = useState<(keyof IDocument)[]>([]);
  const { columns } = useDocumentManagementColumns({
    dependencies: [skipColumns],
    skipColumns,
    handleRemoveColumn: (col: keyof IDocument) =>
      setSkipColumns([...skipColumns, col]),
  });

  return (
    <div className="my-4 px-4 md:px-8 space-y-4 md:my-8 max-w-full max-h-full overflow-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg">Document Management</h2>
        <Button>
          <Plus /> New Document
        </Button>
      </div>
      <DataTable
        columns={columns as any}
        data={mock_documents}
        total={columns.length}
        visiblePagination
        setPagination={() => null}
      />
    </div>
  );
};

export default MainPage;
