import { useCallback, useEffect, useRef, useState } from 'react'
import Section from './Section.jsx'
import YouTubeEmbed from './YouTubeEmbed.jsx'
import LineNotification from './LineNotification.jsx'
import GuideList from './GuideList.jsx'
import ChatRoom from './ChatRoom.jsx'
import ChatList from './ChatList.jsx'

// data/pages/*.js의 blocks 배열을 순서대로 화면에 그려요.
// 채팅방은 화면 너비 전체를 쓰고, 나머지 블록은 본문 폭(좌우 여백 포함) 안에 들어가요.
//
// 채팅방 뒤에 오는 블록들은 그 대화가 끝날 때까지 나타나지 않아요.
// hidden 채팅방은 알림(또는 대화 목록)을 탭해야 나타나고, 그 전까지는 뒤 블록들도 숨겨져요.

// 화면 너비 전체를 쓰는 블록
const FULL_WIDTH = ['chat', 'chatlist']

const keyOf = (block, i) => block.id ?? `#${i}`

export default function Blocks({ blocks }) {
  // 펼쳐진 hidden 채팅방 id, 대화가 끝난 채팅방 key
  const [revealed, setRevealed] = useState([])
  const [finished, setFinished] = useState([])
  const reveal = useCallback((id) => setRevealed((ids) => (ids.includes(id) ? ids : [...ids, id])), [])
  const finish = useCallback((key) => setFinished((keys) => (keys.includes(key) ? keys : [...keys, key])), [])

  // 지금 보여줄 블록: 아직 안 펼쳐졌거나 대화 중인 채팅방에서 멈춤
  const visible = []
  for (const [i, block] of blocks.entries()) {
    if (block.type !== 'chat') {
      visible.push({ block, key: i })
      continue
    }
    const key = keyOf(block, i)
    if (block.hidden && !revealed.includes(key)) break
    visible.push({ block, key, hasMore: i < blocks.length - 1 })
    if (!finished.includes(key)) break
  }

  // 일반 블록끼리 묶어서 본문 폭 안에 넣기
  const groups = []
  for (const item of visible) {
    const last = groups[groups.length - 1]
    if (FULL_WIDTH.includes(item.block.type)) groups.push(item)
    else if (Array.isArray(last)) last.push(item)
    else groups.push([item])
  }

  const render = ({ block, key, hasMore }) => (
    <Block key={key} block={block} hasMore={hasMore} reveal={reveal} onDone={() => finish(key)} />
  )

  return groups.map((group, i) =>
    Array.isArray(group) ? (
      <div key={`g${group[0].key}`} className="mx-auto max-w-md px-5">
        {group.map(render)}
      </div>
    ) : (
      render(group)
    )
  )
}

function Block({ block, hasMore, reveal, onDone }) {
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
    case 'chatlist':
      return <ChatList title={block.title} rooms={block.rooms} onOpen={reveal} />
    case 'chat': {
      const room = (
        <ChatRoom
          messages={block.messages}
          partner={block.partner}
          date={block.date}
          backTo={block.backTo}
          hasMore={hasMore}
          onDone={onDone}
        />
      )
      return block.hidden ? <ScrollIntoViewOnMount>{room}</ScrollIntoViewOnMount> : room
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
