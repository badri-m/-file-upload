import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentAuthenticatedUser } from "../services/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        await getCurrentAuthenticatedUser();
        if (isMounted) setIsAllowed(true);
      } catch {
        if (isMounted) setIsAllowed(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            <p className="text-sm font-medium text-slate-700">
              Checking your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
