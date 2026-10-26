export default function Section({ title, children }) {
  return (
    <section className="py-10">
      {title && (
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      )}
      <div className="space-y-4 text-[17px] leading-[1.8] text-neutral-700">
        {children}
      </div>
    </section>
  )
}
