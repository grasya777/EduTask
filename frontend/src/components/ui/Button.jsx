export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary: 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-500/10',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
