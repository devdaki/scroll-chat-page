import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router'
import ChatBubble, { Avatar } from './ChatBubble.jsx'

// 메시지 사이 간격: 기본 대기 + 글자 수만큼 '입력 중' 시간
const delayFor = (message) => 700 + message.text.length * 60

// 전체 화면 LINE 채팅방. 채팅방 최상단이 화면 맨 위에 닿으면 재생을 시작해서
// 메시지가 시간차로 하나씩 도착하고,
// 대화가 끝나면 onDone을 불러서, 뒤에 이어지는 블록이 나타나게 해요.
// hasMore: 뒤에 이어지는 내용이 있으면 끝났을 때 '계속 읽기' 안내를 보여줘요.
// date: 날짜 구분선. 문자열 하나면 맨 위에만,
//   { 0: '10월 26일 (일)', 6: '10월 27일 (월)' }처럼 쓰면 해당 번호(0부터) 메시지 바로 앞에 나와요.
// backTo: 뒤로 버튼을 눌렀을 때 갈 경로. 없으면 버튼은 모양만 있어요.
export default function ChatRoom({ messages, partner, date, backTo, hasMore, onDone }) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(reduceMotion ? messages.length : 0)
  const [typing, setTyping] = useState(false)
  const roomRef = useRef(null)
  const bottomRef = useRef(null)
  const endRef = useRef(null)
  // 화면 맨 위 1% 띠에 채팅방이 들어오면 시작
  const reachedTop = useInView(roomRef, { once: true, margin: '0px 0px -99% 0px' })
  // 페이지 끝이라 최상단이 맨 위까지 못 올라오는 경우(모바일 주소창 높이 차이 등) 대비:
  // 채팅방 끝까지 화면에 들어오면 시작
  const reachedEnd = useInView(endRef, { once: true })
  const started = reachedTop || reachedEnd
  const done = count >= messages.length
  const dates = typeof date === 'string' ? { 0: date } : (date ?? {})

  // 메시지를 하나씩 시간차로 추가
  useEffect(() => {
    if (!started || done) return
    const next = messages[count]
    setTyping(next.from === 'them')
    const timer = setTimeout(() => {
      setTyping(false)
      setCount(count + 1)
    }, count === 0 ? 900 : delayFor(next))
    return () => clearTimeout(timer)
  }, [started, count, done])

  // 대화가 끝나면 알림
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  useEffect(() => {
    if (done) onDoneRef.current?.()
  }, [done])

  // 새 메시지가 화면 아래로 가려지면 맨 아래로 (위로 끌어올리지는 않음)
  useEffect(() => {
    const el = bottomRef.current
    if (!started || !el) return
    if (el.getBoundingClientRect().bottom > window.innerHeight - 80) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [started, count, typing])

  // 채팅방: 페이지 전체 스크롤을 쓰고, 헤더와 입력창은 채팅방 안에서만 고정
  return (
    <div ref={roomRef} className="mx-auto flex min-h-dvh max-w-md flex-col bg-line-bg">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-line-header px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 text-white">
        {backTo ? (
          <button type="button" onClick={() => navigate(backTo)} aria-label="뒤로" className="-ml-1 px-1 text-2xl leading-none">
            ‹
          </button>
        ) : (
          <span aria-hidden="true" className="-ml-1 px-1 text-2xl leading-none">‹</span>
        )}
        <span className="flex-1 text-[17px] font-semibold">{partner}</span>
        <span className="text-sm tracking-widest">⌕ ☰</span>
      </header>

      {/* 대화 영역 */}
      <div className="flex flex-1 flex-col gap-3 px-3 py-4">
        {/* 날짜 구분선은 그 메시지 차례가 되면 먼저 나타나요 */}
        {messages.slice(0, count + 1).map((message, i) => (
          <Fragment key={i}>
            {dates[i] && <DateDivider text={dates[i]} />}
            {i < count && <ChatBubble message={message} partner={partner} />}
          </Fragment>
        ))}
        {typing && <TypingIndicator partner={partner} />}
        {done && hasMore && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mx-auto mt-6 rounded-full bg-black/15 px-4 py-1.5 text-xs text-white"
          >
            아래로 스크롤해서 계속 읽기 ↓
          </motion.p>
        )}
        <div ref={bottomRef} className="scroll-mb-20" />
      </div>

      {/* 하단 입력창 (모양만) */}
      <div className="sticky bottom-0 flex items-center gap-3 bg-white px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] text-neutral-400">
        <span className="text-2xl leading-none">+</span>
        <div className="flex-1 rounded-full bg-neutral-100 px-4 py-2 text-sm">메시지 입력</div>
        <span className="text-lg">☺</span>
      </div>
      <div ref={endRef} aria-hidden="true" />
    </div>
  )
}

function DateDivider({ text }) {
  return <div className="mx-auto rounded-full bg-black/15 px-3 py-0.5 text-xs text-white">{text}</div>
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
