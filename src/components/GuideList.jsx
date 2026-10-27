export default function GuideList({ title, items, numbered = false }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <ul className="space-y-2.5 rounded-2xl bg-neutral-50 p-5 text-[15px] leading-relaxed text-neutral-700">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 break-keep">
            <span className="w-4 shrink-0 font-semibold text-neutral-400">{numbered ? i + 1 : '·'}</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
