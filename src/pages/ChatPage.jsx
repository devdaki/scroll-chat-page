import ChatRoom from '../components/ChatRoom.jsx'
import Section from '../components/Section.jsx'
import { messages, chatPartner } from '../data/chat.js'
import { messages as messages2, chatPartner as chatPartner2 } from '../data/chat2.js'

export default function ChatPage() {
  return (
    <ChatRoom messages={messages} partner={chatPartner} date="10월 27일 (월)" backTo="/story">
      <main className="mx-auto max-w-md px-5 pb-12">
        <Section title="그 다음 이야기">
          <p>
            대화가 끝난 뒤에 이어지는 본문입니다. 문단의 길이와 간격을 확인하기 위한 더미
            텍스트이며, 실제 내용으로 자유롭게 교체하면 됩니다.
          </p>
          <p>
            최종 결과물에 들어가는 실제적인 문장 내용이 채워지기 전에 시각 디자인 프로젝트
            모형의 채움 글로도 이용됩니다.
          </p>
          <p>집에 돌아오는 길, 또 다른 메시지가 도착했습니다.</p>
        </Section>
      </main>

      {/* 두 번째 채팅방: 위 본문을 지나 화면에 보이면 재생 시작 */}
      <ChatRoom messages={messages2} partner={chatPartner2} date="10월 27일 (월)">
        <main className="mx-auto max-w-md px-5 pb-24">
          <Section title="마지막 이야기">
            <p>
              두 번째 대화가 끝난 뒤에 이어지는 본문입니다. 이렇게 채팅방과 본문을 번갈아
              이어 붙일 수 있습니다.
            </p>
          </Section>
        </main>
      </ChatRoom>
    </ChatRoom>
  )
}
