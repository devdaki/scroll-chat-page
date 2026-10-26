import { motion, useTransform } from 'motion/react'

export default function ChatBubble({ message, partner, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1])
  const y = useTransform(progress, range, [16, 0])
  const isMe = message.from === 'me'

  return (
    <motion.div
      style={{ opacity, y }}
      className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}
    >
      {!isMe && (
        <div className="mb-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.8rem] bg-amber-200 text-xs font-bold text-amber-700">
          {partner[0]}
        </div>
      )}

      <div className={`flex max-w-[72%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && <span className="mb-0.5 text-[11px] text-neutral-800">{partner}</span>}
        <p
          className={`rounded-2xl px-3 py-2 text-[13px] leading-snug break-keep text-neutral-900 ${
            isMe ? 'rounded-tr-sm bg-line-sent' : 'rounded-tl-sm bg-white'
          }`}
        >
          {message.text}
        </p>
      </div>

      <div className={`flex shrink-0 flex-col text-[9px] leading-tight text-line-meta ${isMe ? 'items-end' : 'items-start'}`}>
        {isMe && <span>읽음</span>}
        <span>{message.time}</span>
      </div>
    </motion.div>
  )
}
