import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

// 이 컴포넌트를 둔 위치가 화면 가운데를 지나면 상단에 아이폰 스타일 LINE 알림이 내려와요.
// autoHide=false: 아래로 지나면 뜨고, 다시 위로 올리면 사라져요.
// autoHide=true: 지날 때마다 떴다가 duration(ms) 뒤에 자동으로 사라져요.
export default function LineNotification({ sender, text, autoHide = false, duration = 3500 }) {
  const triggerRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [passed, setPassed] = useState(false)
  const [visible, setVisible] = useState(false)

  const checkPassed = () => {
    const top = triggerRef.current?.getBoundingClientRect().top
    if (top !== undefined) setPassed(top < window.innerHeight / 2)
  }
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', checkPassed)
  // 이미 스크롤된 상태로 새로고침한 경우 대비
  useEffect(checkPassed, [])

  useEffect(() => {
    setVisible(passed)
    if (!passed || !autoHide) return
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [passed, autoHide, duration])

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y: '-120%' }

  return (
    <>
      <div ref={triggerRef} aria-hidden="true" />
      <AnimatePresence>
        {visible && (
          <motion.div
            role="status"
            initial={hidden}
            animate={{ opacity: 1, y: 0 }}
            exit={hidden}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={() => setVisible(false)}
            className="fixed inset-x-0 top-0 z-50 mx-auto max-w-md px-2 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)]"
          >
            <div className="flex items-center gap-3 rounded-[1.4rem] bg-white/75 p-3 shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
              {/* LINE 앱 아이콘 */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.65rem] bg-[#06c755] text-[10px] font-black tracking-tight text-white">
                LINE
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[15px] font-semibold">{sender}</span>
                  <span className="shrink-0 text-xs text-neutral-500">지금</span>
                </div>
                <p className="truncate text-[15px] leading-snug text-neutral-800">{text}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
