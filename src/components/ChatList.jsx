import { useLocalized } from '../context/ChatLanguage.jsx'

// 전체 화면 LINE 대화 목록. 페이지 스크롤로 목록이 올라가고,
// 상단 헤더·검색창과 하단 탭바는 목록 안에서만 고정돼요.
// rooms: [{ name, text, time, unread?, pinned?, muted?, opens? }]
//   unread: 안 읽은 메시지 수(초록 배지). pinned: 📌 표시. muted: 🔕 표시
//   opens: 탭하면 펼칠 채팅방 id (onOpen으로 전달돼요)
export default function ChatList({ title = '대화', rooms, onOpen }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white">
      {/* 상단 헤더 + 검색창 */}
      <header className="sticky top-0 z-10 bg-white px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold">{title}</h2>
          <span aria-hidden="true" className="flex gap-4 text-lg text-neutral-700">
            <span>⋯</span>
            <span>✎</span>
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-400">
          <span aria-hidden="true">⌕</span>
          검색
        </div>
      </header>

      {/* 대화방 목록 */}
      <ul className="flex-1 py-1">
        {rooms.map((room, i) => (
          <ChatListItem key={i} room={room} onOpen={room.opens && onOpen ? () => onOpen(room.opens) : undefined} />
        ))}
      </ul>

      {/* 하단 탭바 (모양만) */}
      <nav
        aria-hidden="true"
        className="sticky bottom-0 grid grid-cols-5 border-t border-neutral-200 bg-white pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] text-center text-[10px] text-neutral-400"
      >
        {['홈', '대화', 'shopping', '뉴스', 'Apps'].map((tab) => (
          <span key={tab} className={tab === '대화' ? 'font-bold text-neutral-900' : ''}>
            <span className="mx-auto mb-1 block h-5 w-5 rounded-md border-2 border-current" />
            {tab}
          </span>
        ))}
      </nav>
    </div>
  )
}

function ChatListItem({ room, onOpen }) {
  const text = useLocalized()(room)
  const content = (
    <>
      <ListAvatar name={room.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate text-[16px] font-semibold">{room.name}</span>
          {room.muted && <span className="shrink-0 text-xs text-neutral-400">🔕</span>}
        </div>
        <p className="line-clamp-2 text-[13px] leading-snug text-neutral-500">{text}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 self-start pt-0.5">
        <span className="text-[11px] text-neutral-400">{room.time}</span>
        <div className="flex items-center gap-1">
          {room.pinned && <span className="text-[11px]">📌</span>}
          {room.unread > 0 && (
            <span className="min-w-5 rounded-full bg-[#06c755] px-1.5 text-center text-[11px] leading-5 font-semibold text-white">
              {room.unread > 999 ? '999+' : room.unread}
            </span>
          )}
        </div>
      </div>
    </>
  )

  const className = 'flex w-full items-center gap-3 px-4 py-2.5 text-left'
  return (
    <li>
      {onOpen ? (
        <button type="button" onClick={onOpen} className={`${className} active:bg-neutral-100`}>
          {content}
        </button>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  )
}

// 이름마다 고정된 색의 동그란 프로필
const AVATAR_COLORS = [
  'bg-amber-200 text-amber-700',
  'bg-sky-200 text-sky-700',
  'bg-rose-200 text-rose-700',
  'bg-emerald-200 text-emerald-700',
  'bg-violet-200 text-violet-700',
  'bg-orange-200 text-orange-700',
]

function ListAvatar({ name }) {
  const hash = [...name].reduce((sum, ch) => sum + ch.codePointAt(0), 0)
  return (
    <div
      className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-lg font-bold ${AVATAR_COLORS[hash % AVATAR_COLORS.length]}`}
    >
      {name[0]}
    </div>
  )
}
