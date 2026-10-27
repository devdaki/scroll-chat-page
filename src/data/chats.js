// 모든 채팅방 대화. 이름(minji, jihun 등)으로 꺼내서 story.js의 chat 블록에 넣어요.
//   { type: 'chat', ...chats.minji, ... }
// partner: 상대 이름 (헤더·프로필에 표시)
// messages: 위에서부터 순서대로 하나씩 도착해요.
//   from: 'me' = 오른쪽 초록 말풍선, 'them' = 왼쪽 흰 말풍선
export const chats = {
  minji: {
    partner: 'きょうちゃん',
    messages: [
      { from: 'them', text: 'さっき会ったばっかなのに、もう会いたいんだけど〜😢', time: '오후 6:02' },
      { from: 'me', text: 'はいはい、俺もそう〜😭', time: '오후 6:03' },
    ],
  },
  jihun: {
    partner: '지훈',
    messages: [
      { from: 'them', text: '민지 만났어?', time: '오후 9:12' },
      { from: 'me', text: '응 방금 헤어졌어', time: '오후 9:14' },
      { from: 'them', text: '뭐래? 궁금해 죽겠네', time: '오후 9:14' },
      { from: 'me', text: '내일 직접 얘기해줄게 ㅋㅋ', time: '오후 9:15' },
      { from: 'them', text: '아 뭐야 너까지 😂', time: '오후 9:15' },
    ],
  },
}
