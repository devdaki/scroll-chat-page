import { useRef } from 'react'
import { useReducedMotion, useScroll, useMotionValue } from 'motion/react'
import PhoneMockup from './PhoneMockup.jsx'
import ChatBubble from './ChatBubble.jsx'

export default function ScrollChatSection({ messages, partner }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  // 모션 줄이기 설정이면 처음부터 전부 보여줌
  const shown = useMotionValue(1)
  const progress = reduceMotion ? shown : scrollYProgress

  // 메시지 하나당 화면 높이의 약 60%만큼 스크롤
  const height = `${(messages.length + 1) * 60 + 100}vh`
  const step = 1 / (messages.length + 1)

  return (
    <section ref={ref} className="relative -mx-5" style={{ height }}>
      <div className="sticky top-0 flex h-dvh items-center justify-center bg-neutral-100">
        <PhoneMockup>
          {/* 상단 헤더 */}
          <div className="flex items-center gap-2 bg-line-header px-4 pt-10 pb-2.5 text-white">
            <span className="text-xl leading-none">‹</span>
            <span className="flex-1 text-sm font-semibold">{partner}</span>
            <span className="text-xs tracking-widest">⌕ ☰</span>
          </div>

          {/* 대화 영역 */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden bg-line-bg px-3 py-4">
            <div className="mx-auto rounded-full bg-black/15 px-3 py-0.5 text-[10px] text-white">
              10월 27일 (월)
            </div>
            {messages.map((message, i) => (
              <ChatBubble
                key={i}
                message={message}
                partner={partner}
                progress={progress}
                range={[step * (i + 0.5), step * (i + 1)]}
              />
            ))}
          </div>

          {/* 하단 입력창 */}
          <div className="flex items-center gap-2 bg-white px-3 pt-2 pb-6 text-neutral-400">
            <span className="text-lg leading-none">+</span>
            <div className="flex-1 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px]">메시지 입력</div>
            <span className="text-sm">☺</span>
          </div>
        </PhoneMockup>
      </div>
    </section>
  )
}
