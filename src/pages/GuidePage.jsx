import { Link } from 'react-router'

const howTo = [
  '화면을 아래로 천천히 스크롤하며 읽어주세요.',
  '중간에 나오는 영상은 눌러서 바로 재생할 수 있어요.',
  '휴대폰 알림이 뜨면 눌러서 대화를 확인해보세요.',
]

const cautions = [
  '소리가 나오는 영상이 있으니 음량을 확인해주세요.',
  '세로 모드의 휴대폰 화면에 맞춰 만들어졌어요.',
  '이 이야기에 나오는 인물과 대화는 모두 허구예요.',
]

export default function GuidePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5">
      <header className="pt-16 pb-8">
        <p className="mb-2 text-sm font-semibold text-emerald-600">Story</p>
        <h1 className="text-[32px] leading-tight font-extrabold tracking-tight break-keep">
          여기에 페이지 제목이 들어갑니다
        </h1>
        <p className="mt-3 text-neutral-500">읽기 전에 아래 내용을 확인해주세요.</p>
      </header>

      <GuideList title="이용 방법" items={howTo} numbered />
      <GuideList title="주의사항" items={cautions} />

      {/* 하단 고정 읽기 버튼 */}
      <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-white via-white to-white/0 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]">
        <Link
          to="/story"
          className="block rounded-2xl bg-neutral-900 py-4 text-center text-[17px] font-semibold text-white active:scale-[0.98] transition-transform"
        >
          읽기
        </Link>
      </div>
    </main>
  )
}

function GuideList({ title, items, numbered = false }) {
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
