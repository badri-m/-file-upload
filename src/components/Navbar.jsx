export default function Navbar({ onLogout, userEmail }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Attenzia</p>
          <p className="text-xs text-slate-500">
            {userEmail ? `Signed in as ${userEmail}` : "S3 Upload POC"}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
