import { Link } from 'react-router'
import PageHeader from '../components/PageHeader.jsx'
import Blocks from '../components/Blocks.jsx'
import page from '../data/pages/guide.js'

export default function GuidePage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <PageHeader eyebrow={page.eyebrow} title={page.title} subtitle={page.subtitle} />
      <Blocks blocks={page.blocks} />

      {/* 하단 고정 버튼 */}
      <div className="sticky bottom-0 mx-auto mt-auto w-full max-w-md bg-gradient-to-t from-white via-white to-white/0 px-5 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)]">
        <Link
          to={page.button.to}
          className="block rounded-2xl bg-neutral-900 py-4 text-center text-[17px] font-semibold text-white active:scale-[0.98] transition-transform"
        >
          {page.button.label}
        </Link>
      </div>
    </main>
  )
}
