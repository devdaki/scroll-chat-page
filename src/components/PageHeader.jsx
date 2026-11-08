export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="mx-auto w-full max-w-md px-5 pt-16 pb-6">
      {eyebrow && <p className="mb-2 text-sm font-semibold text-emerald-600">{eyebrow}</p>}
      <h1 className="text-[32px] leading-tight font-extrabold tracking-tight break-keep">{title}</h1>
      {subtitle && <p className="mt-3 text-neutral-500">{subtitle}</p>}
    </header>
  )
}
