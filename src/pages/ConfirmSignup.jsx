import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmSignup, resendSignupOtp } from "../services/auth";

export default function ConfirmSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(queryEmail);
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(queryEmail);
  }, [queryEmail]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!code.trim()) {
      setError("OTP code is required.");
      return;
    }

    setIsLoading(true);

    try {
      await confirmSignup({
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });

      navigate("/login", {
        replace: true,
        state: { message: "Account verified. Please log in." },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    setIsLoading(true);

    try {
      await resendSignupOtp({ email: email.trim().toLowerCase() });
      setNotice("A new OTP code has been sent. Please check your email.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">Confirm your account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter the OTP code sent to your email.
        </p>

        {notice && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="code">
              OTP code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm tracking-widest outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              placeholder="123456"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-white" />
                Verifying...
              </span>
            ) : (
              "Verify"
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Resend OTP
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Back to{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
