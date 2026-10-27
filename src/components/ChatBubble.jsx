import { motion } from 'motion/react'

export default function ChatBubble({ message, partner }) {
  const isMe = message.from === 'me'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}
    >
      {!isMe && <Avatar name={partner} />}

      <div className={`flex max-w-[72%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && <span className="mb-0.5 text-xs text-neutral-800">{partner}</span>}
        <p
          className={`rounded-2xl px-3.5 py-2 text-[15px] leading-snug break-keep text-neutral-900 ${
            isMe ? 'rounded-tr-sm bg-line-sent' : 'rounded-tl-sm bg-white'
          }`}
        >
          {message.text}
        </p>
      </div>

      <div className={`flex shrink-0 flex-col text-[10px] leading-tight text-line-meta ${isMe ? 'items-end' : 'items-start'}`}>
        {isMe && <span>읽음</span>}
        <span>{message.time}</span>
      </div>
    </motion.div>
  )
}

export function Avatar({ name }) {
  return (
    <div className="mb-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.9rem] bg-amber-200 text-sm font-bold text-amber-700">
      {name[0]}
    </div>
  )
}
