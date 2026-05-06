import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function requestPresignedUrl({ fileName, fileType }) {
  if (!apiBaseUrl) {
    throw new Error(
      "Missing VITE_API_BASE_URL. Create a .env file from .env.example.",
    );
  }

  const response = await api.post("/get-presigned-url", {
    fileName,
    fileType,
  });

  const presignedUrl = response?.data?.presignedUrl;
  if (!presignedUrl) {
    throw new Error("API response missing presignedUrl");
  }

  return presignedUrl;
}

export async function uploadFileToS3({ presignedUrl, file, onProgress }) {
  const contentType = file?.type || "application/octet-stream";

  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
    onUploadProgress: (event) => {
      // Axios gives us progress events in the browser.
      // total can be undefined in some environments, so we guard it.
      if (!event.total) return;

      const percent = Math.round((event.loaded * 100) / event.total);
      onProgress?.(Math.min(100, Math.max(0, percent)));
    },
  });
}
