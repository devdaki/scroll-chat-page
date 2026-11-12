import { umeProfile, mobProfile1, mobProfile2, mobProfile3, mobProfile4, mobProfile5, mobProfile6, mobProfile7 } from './images'

// 모든 채팅방 대화. 이름(minji, jihun 등)으로 꺼내서 story.js의 chat 블록에 넣어요.
//   { type: 'chat', ...chats.minji, ... }
// partner: 상대 이름 (헤더·프로필에 표시)
// avatar: 프로필 사진 (images.js에서 import, 없으면 이름 첫 글자)
// messages: 위에서부터 순서대로 하나씩 도착해요.
//   from: 'me' = 오른쪽 초록 말풍선, 'them' = 왼쪽 흰 말풍선
//   typing: (내 메시지) true면 그 차례에 키보드로 친 뒤 전송. 한자는 { ja: [..., { text: '俺', kana: 'おれ' }] } 형식 (draft와 같음)
//   read: (내 메시지) 읽음 표시. false = 안 읽음(표시 없음), 숫자 = 읽은 사람 수. 안 적으면 채팅방 설정(기본 읽음)
//   text: 일본어, ko: 한국어 (안내 페이지에서 고른 채팅 언어로 보여요. ko가 없으면 text 그대로)
export const chats = {
  kyo: {
    partner: 'きょうちゃん💙',
    avatar: mobProfile1,
    messages: [
      { from: 'them', text: 'さっき会ったばっかなのに、もう会いたいんだけど〜😢', ko: '방금 만났는데 벌써 보고 싶어〜😢', time: '오후 5:47' },
      {
        from: 'me', text: 'はいはい、俺もそう〜😭', ko: '그래그래, 나도 그래〜😭', time: '오후 5:48', read : false,
        // 키보드로 친 뒤 전송 (俺은 おれ로 쳐서 변환)
        typing: { ja: ['はいはい、', { text: '俺', kana: 'おれ' }, 'もそう〜😭'] },
      },
    ],
  },
  ume: {
    partner: '梅宮 一',
    avatar: umeProfile,
    messages: [
      { from: 'them', text: 'えんどう〜、あとで朝メシ何食べる？', ko: '엔도~ 이따가 아침 뭐 먹을래?', time: '오전 3:27' },
      { from: 'them', text: '胃の調子、大丈夫？', ko: '속 괜찮아?', time: '오전 1:16' },
      { from: 'them', text: '育ててた植物、凍っちゃった😭', ko: '키우던 식물이 얼었어ㅠㅠ', time: '오후 2:18' },
      { from: 'them', text: '寒いからあったかくして出勤してね！', ko: '추우니까 따뜻하게 입고 출근해!', time: '오후 2:18' },
      { from: 'them', text: 'またあとでね！', ko: '이따보자!', time: '오후 2:20' },
      { from: 'them', text: 'やまと !', ko: '야마토 !', time: '오전 11:23' },
      { from: 'me', text: '?', time: '오후 2:11' },
      { from: 'them', text: 'あっ、何言おうとしたか忘れちゃった...', ko: '헉, 무슨 말 하려고 했는지 까먹었다...', time: '오후 2:15' },
      { from: 'me', text: 'バカ。', ko: '멍청이', time: '오후 2:17' },
      { from: 'them', text: 'ひどいな〜〜笑', ko: '너무해~~ㅋㅋ', time: '오후 2:18' },
    ],
  },
}

// 대화 목록 화면. 이름(endo 등)으로 꺼내서 story.js의 chatlist 블록에 넣어요.
//   { type: 'chatlist', rooms: chatLists.endo }
// name: 방 이름, avatar: 프로필 사진(선택), text: 마지막 메시지(일본어), ko: 한국어, time: 시간 표시(자유 형식)
// unread: 안 읽은 수(초록 배지), pinned: 📌 고정, muted: 🔕 알림 끔
// opens: 탭하면 펼칠 hidden 채팅방 id (선택)
export const chatLists = {
  endo: [
    { name: 'きょうちゃん💙', avatar: mobProfile1, text: 'はいはい、俺もそう〜😭', ko: '그래그래, 나도 그래〜😭', time: '오후 5:48'},
    { name: 'キリちゃん♥', avatar: mobProfile2, text: '昨日はありがと♡ また行くね', ko: '어제 고마웠어♡ 또 갈게', time: '오후 4:30', unread: 5 },
    { name: 'トッちゃん🥰', avatar: mobProfile6, text: 'お昼食べた？ 今日も頑張ってね', ko: '점심 먹었어? 오늘도 힘내', time: '오후 2:05', unread: 3},
    { name: 'ヒカリちゃん♥', avatar: mobProfile3, text: 'スタンプを送信しました', ko: '스티커를 보냈습니다', time: '오후 1:23', unread: 1 },
    { name: 'ホスト部 グループ', avatar: mobProfile7, text: '[写真] 今日のシフト表です。確認お願いします', ko: '[사진] 오늘 근무표입니다. 확인 부탁드려요', time: '오전 11:02', unread: 38, muted: true },
    { name: 'アヤちゃん💖', avatar: mobProfile7, text: '誕生日プレゼント何がいい？', ko: '생일 선물 뭐가 좋아?', time: '오전 9:15', unread: 1 },
    { name: 'ミオ♥', avatar: mobProfile5, text: '明日お店行ってもいい？', ko: '내일 가게 가도 돼?', time: '어제', unread: 2 },
    { name: 'リナち♥', avatar: mobProfile7, text: '今度いつ空いてる？', ko: '다음에 언제 시간 돼?', time: '어제', unread: 5 },
    { name: 'サキ💞', avatar: mobProfile4, text: 'シャンパン入れるね🍾', ko: '샴페인 넣을게🍾', time: '10. 24.', unread: 1},
    { name: 'ユイちゃん♥', avatar: mobProfile7, text: 'おつかれ〜', ko: '수고했어〜', time: '10. 22.', unread: 2},
    { name: '梅宮 一', avatar: umeProfile, text: 'ひどいな〜〜笑', ko: '너무해〜〜ㅋㅋ', time: '11. 12.', opens: 'ume' },
    { name: 'マユち💟', avatar: mobProfile7, text: 'また会いたいな', ko: '또 보고 싶다', time: '10. 20.', unread: 1},
  ],
}
