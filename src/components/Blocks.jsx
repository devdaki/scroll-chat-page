import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Section from './Section.jsx'
import YouTubeEmbed from './YouTubeEmbed.jsx'
import LineNotification from './LineNotification.jsx'
import GuideList from './GuideList.jsx'
import ChatRoom from './ChatRoom.jsx'

// data/pages/*.js의 blocks 배열을 순서대로 화면에 그려요.
// 채팅방은 화면 너비 전체를 쓰고, 나머지 블록은 본문 폭(좌우 여백 포함) 안에 들어가요.

// hidden 채팅방 중 알림으로 펼쳐진 것들의 id
const RevealContext = createContext(null)

export default function Blocks({ blocks }) {
  const parent = useContext(RevealContext)
  const [revealed, setRevealed] = useState([])
  const reveal = useCallback((id) => setRevealed((ids) => (ids.includes(id) ? ids : [...ids, id])), [])
  const list = <BlockList blocks={blocks} />

  // 가장 바깥 Blocks에서만 상태를 갖고, 안쪽(채팅방 뒤 blocks)은 그대로 공유
  if (parent) return list
  return <RevealContext.Provider value={{ revealed, reveal }}>{list}</RevealContext.Provider>
}

function BlockList({ blocks }) {
  const groups = []
  for (const block of blocks) {
    const last = groups[groups.length - 1]
    if (block.type === 'chat') groups.push(block)
    else if (Array.isArray(last)) last.push(block)
    else groups.push([block])
  }

  return groups.map((group, i) =>
    Array.isArray(group) ? (
      <div key={i} className="mx-auto max-w-md px-5">
        {group.map((block, j) => (
          <Block key={j} block={block} />
        ))}
      </div>
    ) : (
      <Block key={i} block={group} />
    )
  )
}

function Block({ block }) {
  const { revealed, reveal } = useContext(RevealContext)

  switch (block.type) {
    case 'section':
      return (
        <Section title={block.title}>
          {/* 백틱 안에서 줄을 바꾸면 화면에서도 줄바꿈 (줄 앞 들여쓰기는 무시) */}
          {block.paragraphs.map((text, i) => (
            <p key={i} className="whitespace-pre-line">{text}</p>
          ))}
        </Section>
      )
    case 'youtube':
      return <YouTubeEmbed videoId={block.videoId} title={block.title ?? '영상'} caption={block.caption} />
    case 'notification':
      return (
        <LineNotification
          sender={block.sender}
          text={block.text}
          to={block.to}
          onOpen={block.opens ? () => reveal(block.opens) : undefined}
          autoHide={block.autoHide}
          duration={block.duration}
        />
      )
    case 'help':
      return <p className="py-6 text-center text-sm leading-relaxed whitespace-pre-line text-neutral-400">{block.text}</p>
    case 'list':
      return <GuideList title={block.title} items={block.items} numbered={block.numbered} />
    case 'chat': {
      const room = (
        <ChatRoom messages={block.messages} partner={block.partner} date={block.date} backTo={block.backTo}>
          {block.blocks && <Blocks blocks={block.blocks} />}
        </ChatRoom>
      )
      if (!block.hidden) return room
      return revealed.includes(block.id) ? <ScrollIntoViewOnMount>{room}</ScrollIntoViewOnMount> : null
    }
    default:
      console.warn(`알 수 없는 블록 type: ${block.type}`)
      return null
  }
}

// 펼쳐지는 순간 채팅방 최상단이 화면 맨 위에 오도록 스크롤 (그러면 채팅방 재생이 시작돼요)
function ScrollIntoViewOnMount({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  return <div ref={ref}>{children}</div>
}
