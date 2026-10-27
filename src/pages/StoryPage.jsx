import PageHeader from '../components/PageHeader.jsx'
import Blocks from '../components/Blocks.jsx'
import page from '../data/pages/story.js'

export default function StoryPage() {
  return (
    <main className="pb-24">
      <PageHeader eyebrow={page.eyebrow} title={page.title} subtitle={page.subtitle} />
      <Blocks blocks={page.blocks} />
    </main>
  )
}
