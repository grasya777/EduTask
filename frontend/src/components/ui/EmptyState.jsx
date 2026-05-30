export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
      <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200 text-2xl">✨</div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mb-4 max-w-md mx-auto text-sm leading-6">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
