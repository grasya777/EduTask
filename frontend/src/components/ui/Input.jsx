export default function Input({ label, className = '', ...props }) {
  return (
    <label className={`grid gap-2 text-sm text-slate-700 ${className}`}>
      {label && <span className="font-medium text-slate-900">{label}</span>}
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
        {...props}
      />
    </label>
  )
}
