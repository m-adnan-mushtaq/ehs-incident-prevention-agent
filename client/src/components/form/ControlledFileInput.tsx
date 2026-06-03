import { Accept, FileRejection, useDropzone } from "react-dropzone";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  FileIcon,
  FileText,
  FileVideo,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Props = {
  name: string;
  control: any;
  label?: string;
  description?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  placeholder?: string;
  controllerProps?: Pick<React.ComponentProps<typeof FormField>, "rules">;
};

const ControlledFileInput = ({
  label,
  name,
  control,
  description = "",
  disabled,
  maxFiles = 5,
  placeholder,
  maxSize = 5242880, // 5MB default
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
  },
  controllerProps = {},
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          {Boolean(label) && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Dropzone
              disabled={disabled}
              value={value}
              onChange={onChange}
              maxFiles={maxFiles}
              maxSize={maxSize}
              accept={accept}
              placeholder={placeholder}
            />
          </FormControl>
          {Boolean(description) && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
      {...controllerProps}
    />
  );
};

type DropzoneProps = {
  value?: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number;
  accept?: Accept;
  placeholder?: string;
};

const Dropzone: React.FC<DropzoneProps> = ({
  value = [],
  onChange,
  disabled = false,
  maxFiles,
  maxSize,
  accept,
  placeholder = "Drag & drop files here, or click to select",
}) => {
  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...value, ...acceptedFiles];
      onChange(newFiles);
    },
    [value, onChange]
  );

  // Handle file rejection (e.g., invalid size/type)
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      console.error(`File "${file.name}" was rejected:`, errors);
    });
    toast.error(
      "Some files were rejected. Please check the file size and format."
    );
  }, []);

  // Remove file
  const removeFile = useCallback(
    (fileToRemove: File) => {
      onChange(value.filter((file) => file !== fileToRemove));
    },
    [value, onChange]
  );

  // Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    disabled,
    maxFiles,
    maxSize,
    accept,
  });

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-spacing-8 rounded-lg p-6 text-center cursor-pointer transition-all",
          isDragActive
            ? "border-primary bg-blue-50"
            : "border-2 border-[#d1d5db9a]",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"
        )}
        role="button"
        tabIndex={0}
      >
        <input {...getInputProps()} aria-disabled={disabled} />
        <p className="text-sm flex items-center justify-center gap-2 text-gray-600">
          {isDragActive ? (
            "Drop the files here..."
          ) : (
            <>
              {" "}
              <Upload size={18} /> {placeholder}{" "}
            </>
          )}
        </p>
      </div>

      {/* File Preview */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {value.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => removeFile(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type FilePreviewProps = {
  file: File;
  onRemove: (file: File) => void;
};

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file.type.startsWith("video/")) {
      generateVideoThumbnail(file).then(setPreviewUrl);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  // Generate video thumbnail
  const generateVideoThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);
      video.currentTime = 2; // Capture at 2 seconds
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 64; // Thumbnail width
        canvas.height = (video.videoHeight / video.videoWidth) * 64; // Keep aspect ratio
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(""); // Fallback
        }
      };
    });
  };

  // Get file icon based on type
  const getFileIcon = () => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="text-blue-500" size={28} />;
    if (file.type.startsWith("video/"))
      return <FileVideo className="text-red-500" size={28} />;
    if (file.type === "application/pdf")
      return <FileText className="text-orange-500" size={28} />;
    return <FileIcon className="text-gray-500" size={28} />;
  };

  return (
    <div className="relative w-[4rem] h-[4rem] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      {/* Thumbnail or Icon */}
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <p className="text-sm flex flex-col items-center justify-center gap-0 truncate">
          {getFileIcon()}
          <span className="w-full text-[10px] truncate">{file.name}</span>
        </p>
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file);
        }}
        className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow hover:bg-gray-200 hover:text-red-600"
        aria-label={`Remove file ${file.name}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ControlledFileInput;
