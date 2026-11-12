import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { NotificationCard } from './LineNotification.jsx'
import { useLocalized } from '../context/ChatLanguage.jsx'

// 채팅방을 보는 동안 다른 사람들의 LINE 알림이 interval(ms)마다 하나씩 위에서 내려와요.
// 누를 수 없고, 다음 알림이 오면 바뀌고, 마지막 알림도 interval 뒤에 사라지면 끝 (반복 없음).
// playing: 재생 여부 (채팅방이 화면에 있을 때 true). 화면을 벗어나면 멈췄다가 돌아오면 이어서 나와요.
// messages: [{ sender, avatar?, text, ko? }]
export default function IncomingNotifications({ messages, interval = 2000, playing }) {
  const reduceMotion = useReducedMotion()
  const localized = useLocalized()
  // -1: 아직 시작 전, messages.length: 다 끝남
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    if (!playing || index >= messages.length) return
    const timer = setTimeout(() => setIndex(index + 1), index === -1 ? 800 : interval)
    return () => clearTimeout(timer)
  }, [playing, index, messages.length, interval])

  const current = playing ? messages[index] : null
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: '-120%' }

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={index}
          aria-hidden="true"
          initial={hidden}
          animate={{ opacity: 1, y: 0 }}
          exit={hidden}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto max-w-md px-2 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)]"
        >
          <NotificationCard sender={current.sender} avatar={current.avatar} text={localized(current)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
