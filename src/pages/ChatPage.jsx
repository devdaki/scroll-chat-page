import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router'
import ChatBubble, { Avatar } from '../components/ChatBubble.jsx'
import { messages, chatPartner } from '../data/chat.js'

// 메시지 사이 간격: 기본 대기 + 글자 수만큼 '입력 중' 시간
const delayFor = (message) => 700 + message.text.length * 60

export default function ChatPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(reduceMotion ? messages.length : 0)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  // 메시지를 하나씩 시간차로 추가
  useEffect(() => {
    if (count >= messages.length) return
    const next = messages[count]
    setTyping(next.from === 'them')
    const timer = setTimeout(() => {
      setTyping(false)
      setCount(count + 1)
    }, count === 0 ? 900 : delayFor(next))
    return () => clearTimeout(timer)
  }, [count])

  // 새 메시지가 오면 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [count, typing])

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-line-bg">
      {/* 상단 헤더 */}
      <header className="flex items-center gap-3 bg-line-header px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 text-white">
        <button type="button" onClick={() => navigate('/story')} aria-label="뒤로" className="-ml-1 px-1 text-2xl leading-none">
          ‹
        </button>
        <span className="flex-1 text-[17px] font-semibold">{chatPartner}</span>
        <span className="text-sm tracking-widest">⌕ ☰</span>
      </header>

      {/* 대화 영역 */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4">
        <div className="mx-auto rounded-full bg-black/15 px-3 py-0.5 text-xs text-white">10월 27일 (월)</div>
        {messages.slice(0, count).map((message, i) => (
          <ChatBubble key={i} message={message} partner={chatPartner} />
        ))}
        {typing && <TypingIndicator partner={chatPartner} />}
        <div ref={bottomRef} />
      </div>

      {/* 하단 입력창 (모양만) */}
      <div className="flex items-center gap-3 bg-white px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] text-neutral-400">
        <span className="text-2xl leading-none">+</span>
        <div className="flex-1 rounded-full bg-neutral-100 px-4 py-2 text-sm">메시지 입력</div>
        <span className="text-lg">☺</span>
      </div>
    </div>
  )
}

function TypingIndicator({ partner }) {
  return (
    <div className="flex items-end gap-1.5">
      <Avatar name={partner} />
      <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-white px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-neutral-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}
