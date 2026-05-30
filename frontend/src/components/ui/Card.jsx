export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 ${className}`} {...props}>
      {children}
    </div>
  )
}
