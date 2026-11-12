import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Menu, Plus, Search, SendHorizontal, Smile } from 'lucide-react'
import ChatBubble from './ChatBubble.jsx'
import Keyboard from './Keyboard.jsx'
import IncomingNotifications from './IncomingNotifications.jsx'
import { draftSteps, pickDraft } from './draft.js'
import { useChatLanguage } from '../context/ChatLanguage.jsx'

// 메시지 사이 간격: 기본 대기 + 글자 수에 비례
const delayFor = (message) => 700 + message.text.length * 60
// 키보드가 올라온 뒤 타이핑 시작까지
const KEYBOARD_DELAY = 900

// 전체 화면 LINE 채팅방. 채팅방 최상단이 화면 맨 위에 닿으면 재생을 시작해서
// 메시지가 시간차로 하나씩 도착하고,
// 대화가 끝나면 onDone을 불러서, 뒤에 이어지는 블록이 나타나게 해요.
// hasMore: 뒤에 이어지는 내용이 있으면 끝났을 때 '계속 읽기' 안내를 보여줘요.
// date: 날짜 구분선. 문자열 하나면 맨 위에만,
//   { 0: '10월 26일 (일)', 6: '10월 27일 (월)' }처럼 쓰면 해당 번호(0부터) 메시지 바로 앞에 나와요.
// backTo: 뒤로 버튼을 눌렀을 때 갈 경로. 없으면 버튼은 모양만 있어요.
// instant: true면 재생 없이 처음부터 전체 대화가 다 보여요.
// draft: 대화가 끝나면 키보드가 올라오고, 이 글자를 입력칸에 한 글자씩 타이핑해요. (보내지는 않아요)
//   ['괜찮아?', { erase: 'all' }, '뭐해']처럼 배열로 쓰면 치고·지우고·멈추기를 섞을 수 있어요.
//   { ko: [...], ja: [...] }로 쓰면 채팅 언어에 맞는 쪽을 그 언어 키보드로 쳐요. (draft.js 참고)
// typeSpeed: 키 하나 누르는 간격(ms), 기본 170. 클수록 느려요.
// incoming: { messages: [{ sender, text, ko? }], interval? } 채팅방을 보는 동안 다른 사람 알림이 차례로 떠요. (누를 수 없음)
// read: 내 메시지 읽음 표시 기본값 (true / false / 숫자). 메시지마다 read로 따로 정할 수도 있어요.
export default function ChatRoom({ messages, partner, avatar, date, backTo, hasMore, onDone, instant = false, draft, typeSpeed, read = true, incoming }) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  // 재생 없이 한 번에 보여주기 (instant 또는 '동작 줄이기' 설정)
  const showAll = instant || reduceMotion
  const [count, setCount] = useState(showAll ? messages.length : 0)
  const roomRef = useRef(null)
  const bottomRef = useRef(null)
  const barRef = useRef(null)
  const endRef = useRef(null)
  // 화면 맨 위 1% 띠에 채팅방이 들어오면 시작
  const reachedTop = useInView(roomRef, { once: true, margin: '0px 0px -99% 0px' })
  // 페이지 끝이라 최상단이 맨 위까지 못 올라오는 경우(모바일 주소창 높이 차이 등) 대비:
  // 채팅방 끝까지 화면에 들어오면 시작
  const reachedEnd = useInView(endRef, { once: true })
  const started = reachedTop || reachedEnd
  // 채팅방이 지금 화면에 보이는지 (incoming 알림 일시정지용)
  const inView = useInView(roomRef)
  const done = count >= messages.length

  // 키보드 + 타이핑 (draft가 있을 때만)
  const { language } = useChatLanguage()
  const picked = pickDraft(draft, language)
  const steps = useMemo(
    () => (picked ? draftSteps(picked.items, typeSpeed, picked.lang) : []),
    [picked?.items, picked?.lang, typeSpeed]
  )
  const [step, setStep] = useState(reduceMotion ? steps.length : 0)
  const [pressed, setPressed] = useState(null)
  const keyboardUp = Boolean(picked) && started && done
  const current = step > 0 ? steps[step - 1] : null
  const typed = current?.text ?? ''
  // 일본어: 끝에서 composing 글자만큼은 확정 전이라 밑줄
  const composingLength = current?.composing ?? 0
  const typedChars = [...typed]
  const fixedText = typedChars.slice(0, typedChars.length - composingLength).join('')
  const composingText = typedChars.slice(typedChars.length - composingLength).join('')
  const finished = done && step >= steps.length
  const dates = typeof date === 'string' ? { 0: date } : (date ?? {})
  // 바로 앞 메시지와 보낸 사람이 같고 사이에 날짜 구분선이 없으면 프로필·이름 생략
  const isContinued = (i) => i > 0 && !dates[i] && messages[i - 1].from === messages[i].from

  // 메시지를 하나씩 시간차로 추가
  useEffect(() => {
    if (!started || done) return
    const next = messages[count]
    const timer = setTimeout(() => setCount(count + 1), count === 0 ? 900 : delayFor(next))
    return () => clearTimeout(timer)
  }, [started, count, done])

  // 키보드가 올라오면 잠깐 뒤에 한 키씩 타이핑
  useEffect(() => {
    if (!keyboardUp || step >= steps.length) return
    const timer = setTimeout(() => {
      setPressed(steps[step].key)
      setStep(step + 1)
    }, step === 0 ? KEYBOARD_DELAY : steps[step].delay)
    return () => clearTimeout(timer)
  }, [keyboardUp, step, steps])

  // 눌린 키 표시는 잠깐만
  useEffect(() => {
    if (!pressed) return
    const timer = setTimeout(() => setPressed(null), 100)
    return () => clearTimeout(timer)
  }, [pressed, step])

  // 대화(와 타이핑)가 끝나면 알림
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  useEffect(() => {
    if (finished) onDoneRef.current?.()
  }, [finished])

  // 마지막 메시지가 하단 입력창·키보드에 가려지면 그만큼 내리기 (위로 끌어올리지는 않음)
  const scrollToBottom = () => {
    const el = bottomRef.current
    if (!started || !el) return
    const visibleBottom = window.innerHeight - (barRef.current?.offsetHeight ?? 0) - 12
    const hidden = el.getBoundingClientRect().bottom - visibleBottom
    if (hidden > 0) window.scrollBy({ top: hidden, behavior: 'smooth' })
  }
  useEffect(() => {
    if (!showAll) scrollToBottom()
  }, [started, count])

  // 채팅방: 페이지 전체 스크롤을 쓰고, 헤더와 입력창은 채팅방 안에서만 고정
  return (
    <div ref={roomRef} className="mx-auto flex min-h-dvh max-w-md flex-col bg-line-bg">
      {incoming && <IncomingNotifications messages={incoming.messages} interval={incoming.interval} playing={started && inView} />}
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-line-header px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 text-white">
        {backTo ? (
          <button type="button" onClick={() => navigate(backTo)} aria-label="뒤로" className="-ml-2">
            <ChevronLeft className="h-7 w-7" strokeWidth={2} />
          </button>
        ) : (
          <ChevronLeft aria-hidden="true" className="-ml-2 h-7 w-7" strokeWidth={2} />
        )}
        <span className="flex-1 text-[17px] font-semibold">{partner}</span>
        <span aria-hidden="true" className="flex gap-4">
          <Search className="h-5.5 w-5.5" strokeWidth={2} />
          <Menu className="h-5.5 w-5.5" strokeWidth={2} />
        </span>
      </header>

      {/* 대화 영역 */}
      <div className="flex flex-1 flex-col gap-3 px-3 py-4">
        {/* 날짜 구분선은 그 메시지 차례가 되면 먼저 나타나요 */}
        {messages.slice(0, count + 1).map((message, i) => (
          <Fragment key={i}>
            {dates[i] && <DateDivider text={dates[i]} />}
            {i < count && <ChatBubble message={message} partner={partner} avatar={avatar} continued={isContinued(i)} read={message.read ?? read} />}
          </Fragment>
        ))}
        {finished && hasMore && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mx-auto mt-6 rounded-full bg-black/15 px-4 py-1.5 text-xs text-white"
          >
            아래로 스크롤해서 계속 읽기 ↓
          </motion.p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 하단 입력창 (모양만) + draft가 있으면 키보드 */}
      <div ref={barRef} className="sticky bottom-0">
        <div
          className={`flex items-center gap-3 bg-white px-3 pt-2 text-neutral-400 ${
            keyboardUp ? 'pb-2' : 'pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]'
          }`}
        >
          <Plus className="h-6.5 w-6.5 shrink-0" strokeWidth={1.8} />
          <div className="flex flex-1 items-center rounded-full bg-neutral-100 px-4 py-2 text-sm">
            {typed && (
              <span className="text-neutral-900">
                {fixedText}
                {composingText && <span className="underline underline-offset-4">{composingText}</span>}
              </span>
            )}
            {keyboardUp && <span className="ml-px h-4 w-0.5 animate-pulse bg-[#06c755]" />}
            {!typed && <span className={keyboardUp ? 'ml-1' : ''}>메시지 입력</span>}
          </div>
          {typed ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#06c755] text-white">
              <SendHorizontal className="h-4 w-4" strokeWidth={2.2} />
            </span>
          ) : (
            <Smile className="h-6 w-6 shrink-0" strokeWidth={1.8} />
          )}
        </div>
        <AnimatePresence>
          {keyboardUp && (
            <motion.div
              initial={reduceMotion ? false : { height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ type: 'spring', stiffness: 300, damping: 34 }}
              onAnimationComplete={scrollToBottom}
              className="overflow-hidden"
            >
              <Keyboard layout={picked.lang} pressed={pressed} candidates={current?.candidates} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div ref={endRef} aria-hidden="true" />
    </div>
  )
}

function DateDivider({ text }) {
  return <div className="mx-auto rounded-full bg-black/15 px-3 py-0.5 text-xs text-white">{text}</div>
}
