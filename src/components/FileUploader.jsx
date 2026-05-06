import { useMemo, useRef, useState } from "react";
import { requestPresignedUrl, uploadFileToS3 } from "../services/api";
import { supabase } from "../utils/supabase";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "0 B";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );

  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${
    units[unitIndex]
  }`;
}

export default function FileUploader({ onToast }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [statusText, setStatusText] = useState("Select a file to begin.");

  const selectedFileMeta = useMemo(() => {
    if (!selectedFile) return null;

    return {
      name: selectedFile.name,
      sizeLabel: formatBytes(selectedFile.size),
      type: selectedFile.type || "application/octet-stream",
    };
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setUploadPercent(0);
    setStatusText(file ? "Ready to upload." : "Select a file to begin.");
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setUploadPercent(0);
    setStatusText("Requesting pre-signed URL...");

    try {
      const presignedUrl = await requestPresignedUrl({
        fileName: selectedFile.name,
        fileType: selectedFile.type || "application/octet-stream",
      });

      setStatusText("Uploading to S3...");

      await uploadFileToS3({
        presignedUrl,
        file: selectedFile,
        onProgress: setUploadPercent,
      });

      const { error } = await supabase.from("uploads").insert([
        {
          file_name: selectedFile.name,
          s3_key: `uploads/${selectedFile.name}`,
        },
      ]);

      if (error) {
        console.error("Supabase Insert Error:", error);
      }

      setUploadPercent(100);
      setStatusText("Upload complete.");

      onToast?.({
        type: "success",
        message: `${selectedFile.name} uploaded successfully.`,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSelectedFile(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";

      setStatusText("Upload failed.");
      onToast?.({ type: "error", message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-md border border-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Upload to S3</h3>
          <p className="mt-1 text-sm text-slate-600">
            Files upload directly from your browser to Amazon S3 using a
            pre-signed URL.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label
          className="block rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center"
          htmlFor="file-input"
        >
          <span className="block text-sm font-medium text-slate-900">
            Choose a file
          </span>
          <span className="mt-1 block text-xs text-slate-600">
            Any file type is supported (based on your backend rules).
          </span>

          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 file:shadow-sm hover:file:bg-slate-100"
          />
        </label>
      </div>

      {selectedFileMeta && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">
            {selectedFileMeta.name}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {selectedFileMeta.sizeLabel} • {selectedFileMeta.type}
          </p>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
            <span>Uploading...</span>
            <span>{uploadPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-indigo-600 transition-[width]"
              style={{ width: `${uploadPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">{statusText}</p>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </section>
  );
}
