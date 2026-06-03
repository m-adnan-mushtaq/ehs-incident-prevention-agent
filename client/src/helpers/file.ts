import axios from "axios";
export const getFileMetaFromUrl = (
  fileUrl: string
): { name: string; type: string; url: string } => {
  const url = fileUrl;
  const name = url.split("/").pop() || "file";
  const ext = name.split(".").pop()?.toLowerCase() || "";

  // Very basic type guessing based on file extension
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    pdf: "application/pdf",
  };

  const type = mimeTypes[ext] || "application/octet-stream";

  return { name, type, url };
};

export const getBlobFromUrl = async (url: string) => {
  const response = await axios.get(url, { responseType: "blob" });
  return response.data;
};

export const downloadBlob = (
  blob: Blob,
  filename: string = "example.pdf"
): void => {
  const link = document.createElement("a");
  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);
  // Set link properties
  link.href = url;
  link.setAttribute("download", filename);
  // Append link to body (required for Firefox)
  document.body.appendChild(link);
  link.click();
  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getFileFromUrl = async (url: string) => {
  const blob = await getBlobFromUrl(url);
  const filename = getFileMetaFromUrl(url).name;
  const file = new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });

  return file;
};

export const downloadFileFromUrl = async (url: string, name: string) => {
  const blob = await getBlobFromUrl(url);
  downloadBlob(blob, name);
};
