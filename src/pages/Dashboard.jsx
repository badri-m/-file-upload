import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import Navbar from "../components/Navbar";
import { getCurrentAuthenticatedUser, signOutUser } from "../services/auth";

function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div
        className={`rounded-xl border bg-white px-4 py-3 shadow-md ${
          isError ? "border-red-200" : "border-emerald-200"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
              isError ? "bg-red-500" : "bg-emerald-500"
            }`}
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {isError ? "Upload failed" : "Upload complete"}
            </p>
            <p className="mt-0.5 text-sm text-slate-600">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const showToast = useCallback((nextToast) => {
    setToast({
      id: Date.now(),
      type: nextToast.type,
      message: nextToast.message,
    });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const user = await getCurrentAuthenticatedUser();
        const loginId = user?.signInDetails?.loginId;
        const username = user?.username;

        if (isMounted) {
          setUserEmail(loginId || username || "");
        }
      } catch {
        // ProtectedRoute handles redirect; this is only for display.
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    (async () => {
      try {
        await signOutUser();
      } finally {
        navigate("/login", { replace: true });
      }
    })();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={handleLogout} userEmail={userEmail} />

      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mx-auto max-w-xl">
          <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">
            Select a file, request a pre-signed URL, then upload directly from
            your browser to S3.
          </p>

          <div className="mt-6">
            <FileUploader onToast={showToast} />
          </div>
        </div>
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
