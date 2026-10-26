import Section from './components/Section.jsx'
import YouTubeEmbed from './components/YouTubeEmbed.jsx'
import ScrollChatSection from './components/ScrollChatSection.jsx'
import { messages, chatPartner } from './data/chat.js'

// 실제 영상 ID로 바꿔주세요 (youtube.com/watch?v=여기부분)
const YOUTUBE_ID = 'M7lc1UVf-VE'

export default function App() {
  return (
    <main className="mx-auto max-w-md px-5 pb-24">
      <header className="pt-16 pb-6">
        <p className="mb-2 text-sm font-semibold text-emerald-600">Story</p>
        <h1 className="text-[32px] leading-tight font-extrabold tracking-tight break-keep">
          여기에 페이지 제목이 들어갑니다
        </h1>
        <p className="mt-3 text-neutral-500">부제목이나 한 줄 소개가 들어가는 자리예요.</p>
      </header>

      <Section title="첫 번째 이야기">
        <p>
          로렘 입숨은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은
          그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트입니다.
        </p>
        <p>
          최종 결과물에 들어가는 실제적인 문장 내용이 채워지기 전에 시각 디자인 프로젝트
          모형의 채움 글로도 이용됩니다. 이런 용도로 사용할 때 로렘 입숨을 그리킹이라고도
          부릅니다.
        </p>
      </Section>

      <YouTubeEmbed videoId={YOUTUBE_ID} title="소개 영상" caption="영상 설명이 들어가는 자리" />

      <Section title="두 번째 이야기">
        <p>
          디자인 시안을 만들 때 실제 콘텐츠가 아직 준비되지 않았다면 이렇게 임시 텍스트를
          넣어 전체적인 흐름과 분위기를 먼저 확인할 수 있습니다.
        </p>
        <p>아래로 스크롤하면 대화가 하나씩 이어집니다.</p>
      </Section>

      <ScrollChatSection messages={messages} partner={chatPartner} />

      <Section title="세 번째 이야기">
        <p>
          대화가 끝난 뒤에 이어지는 본문입니다. 문단의 길이와 간격을 확인하기 위한 더미
          텍스트이며, 실제 내용으로 자유롭게 교체하면 됩니다.
        </p>
        <p>
          모바일 화면에서 읽기 편하도록 글자 크기는 17px, 줄간격은 1.8로 맞춰두었습니다.
        </p>
      </Section>

      <footer className="border-t border-neutral-200 pt-6 text-sm text-neutral-400">
        © 2026 Your Name
      </footer>
    </main>
  )
}
