import { Button } from "@/components/ui/button";
import { showMutationError } from "@/helpers/common";
import { useState } from "react";
import { downloadFileFromUrl, getFileMetaFromUrl } from "@/helpers/file"; // Or your actual downloader
import {
  Download,
  Loader,
  File,
  Image,
  Video,
  Music,
  FileArchive,
} from "lucide-react";

type FileLinkPreviewProps = {
  fileUrl: string;
};

const getFileTypeIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/"))
    return <Image className="w-6 h-6 text-blue-500" />;
  if (mimeType.startsWith("video/"))
    return <Video className="w-6 h-6 text-red-500" />;
  if (mimeType.startsWith("audio/"))
    return <Music className="w-6 h-6 text-green-500" />;
  if (mimeType === "application/pdf")
    return <File className="w-6 h-6 text-red-600" />;
  if (mimeType === "text/csv" || mimeType === "application/vnd.ms-excel")
    return <File className="w-6 h-6 text-green-600" />;
  if (
    mimeType === "application/zip" ||
    mimeType === "application/x-zip-compressed"
  )
    return <FileArchive className="w-6 h-6 text-orange-500" />;
  return <File className="w-6 h-6 text-gray-500" />;
};

const FileLinkPreview: React.FC<FileLinkPreviewProps> = ({ fileUrl }) => {
  const { name, type, url } = getFileMetaFromUrl(fileUrl);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      await downloadFileFromUrl(url, name);
    } catch (error) {
      showMutationError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center px-3 py-2 border rounded-md bg-white gap-3 w-full max-w-md">
      <div>{getFileTypeIcon(type)}</div>
      <div className="flex-1 truncate text-sm text-gray-800">{name}</div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default FileLinkPreview;
