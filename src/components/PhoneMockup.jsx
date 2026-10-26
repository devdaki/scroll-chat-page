export default function PhoneMockup({ children }) {
  return (
    <div className="relative aspect-[9/19.5] h-[min(600px,76dvh)] rounded-[2.75rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl">
      {/* 다이내믹 아일랜드 */}
      <div className="absolute top-2 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.1rem] bg-white">
        {children}
      </div>
    </div>
  )
}
