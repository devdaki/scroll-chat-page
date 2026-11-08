// 모든 채팅방 대화. 이름(minji, jihun 등)으로 꺼내서 story.js의 chat 블록에 넣어요.
//   { type: 'chat', ...chats.minji, ... }
// partner: 상대 이름 (헤더·프로필에 표시)
// messages: 위에서부터 순서대로 하나씩 도착해요.
//   from: 'me' = 오른쪽 초록 말풍선, 'them' = 왼쪽 흰 말풍선
export const chats = {
  kyo: {
    partner: 'きょうちゃん',
    messages: [
      { from: 'them', text: 'さっき会ったばっかなのに、もう会いたいんだけど〜😢', time: '오후 5:47' },
      { from: 'me', text: 'はいはい、俺もそう〜😭', time: '오후 5:48' },
    ],
  },
  ume: {
    partner: '梅宮 一',
    messages: [
      { from: 'them', text: 'えんどう〜、あとで朝メシ何食べる？', time: '오전 3:27' },
      { from: 'them', text: '胃の調子、大丈夫？', time: '오전 1:16' },
      { from: 'them', text: '育ててた植物、凍っちゃった😭', time: '오후 2:18' },
      { from: 'them', text: '寒いからあったかくして出勤してね！', time: '오후 2:18' },
      { from: 'them', text: 'またあとでね！', time: '오후 2:20' },
      { from: 'them', text: 'やまと !', time: '오전 11:23' },
      { from: 'me', text: '?', time: '오후 2:11' },
      { from: 'them', text: 'あっ、何言おうとしたか忘れちゃった……', time: '오후 2:15' },
      { from: 'me', text: 'バカ。', time: '오후 2:17' },
      { from: 'them', text: 'ひどいな〜〜笑', time: '오후 2:18' },
    ],
  },
}

// 대화 목록 화면. 이름(endo 등)으로 꺼내서 story.js의 chatlist 블록에 넣어요.
//   { type: 'chatlist', rooms: chatLists.endo }
// name: 방 이름, text: 마지막 메시지, time: 시간 표시(자유 형식)
// unread: 안 읽은 수(초록 배지), pinned: 📌 고정, muted: 🔕 알림 끔
// opens: 탭하면 펼칠 hidden 채팅방 id (선택)
export const chatLists = {
  endo: [
    { name: 'きょうちゃん', text: 'はいはい、俺もそう〜😭', time: '오후 5:48'},
    { name: 'ヒカリちゃん♥', text: '昨日はありがと♡ また行くね', time: '오후 4:30', unread: 5 },
    { name: 'ユナちゃん♥', text: '既読無視しないで〜😢', time: '오후 3:12', unread: 3 },
    { name: 'ホスト部 グループ', text: '[写真] 今日のシフト表です。確認お願いします', time: '오후 2:05', unread: 38, muted: true },
    { name: 'ミオ', text: 'お昼食べた？ 今日も頑張ってね', time: '오후 1:20' },
    { name: 'トッちゃん♥', text: 'スタンプを送信しました', time: '오전 11:02', unread: 1 },
    { name: 'アヤちゃん', text: '誕生日プレゼント何がいい？', time: '오전 9:15', unread: 1 },
    { name: 'キリちゃん♥', text: '明日お店行ってもいい？', time: '어제', unread: 2 },
    { name: 'リナち♥', text: '今度いつ空いてる？', time: '어제' },
    { name: 'サキ', text: 'シャンパン入れるね🍾', time: '10/24' },
    { name: 'ユイちゃん♥', text: 'おつかれ〜', time: '10/22' },
    { name: '梅宮 一', text: 'ひどいな〜〜笑', time: '11/12' },
    { name: 'マユち', text: 'また会いたいな', time: '10/20', muted: true },
  ],
}
