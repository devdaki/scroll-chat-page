// 일본어 문장을 아이폰 일본어(12키 플릭) 키보드로 치는 순서대로 쪼개요.
// kanaSteps({ text: '大丈夫', kana: 'だいじょうぶ' }) →
//   だいじょうぶ를 한 글자씩 치고(밑줄 = 아직 확정 전) 마지막에 大丈夫로 변환
// kanaSteps({ text: 'だいじょ' }) → 히라가나 그대로 치기 (변환 없음, 밑줄 상태로 남음)
// 각 단계: { key, text, composing, candidates }
//   key: 누른 키, text: 입력칸 전체 글자, composing: 끝에서 몇 글자가 확정 전(밑줄)인지,
//   candidates: 키보드 위 변환 후보

// 키 하나에 들어있는 글자들 (탭/플릭)
const KEYS = {
  あ: 'あいうえお', か: 'かきくけこ', さ: 'さしすせそ', た: 'たちつてと', な: 'なにぬねの',
  は: 'はひふへほ', ま: 'まみむめも', や: 'やゆよ', ら: 'らりるれろ', わ: 'わをんー', '、': '、。？！',
}
// 小゛゜ 키를 눌러서 바뀌는 글자: 결과 → 바뀌기 전
const MODIFIED = {
  が: 'か', ぎ: 'き', ぐ: 'く', げ: 'け', ご: 'こ', ざ: 'さ', じ: 'し', ず: 'す', ぜ: 'せ', ぞ: 'そ',
  だ: 'た', ぢ: 'ち', づ: 'っ', で: 'て', ど: 'と', ば: 'は', び: 'ひ', ぶ: 'ふ', べ: 'へ', ぼ: 'ほ',
  ぱ: 'ば', ぴ: 'び', ぷ: 'ぶ', ぺ: 'べ', ぽ: 'ぼ',
  ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お', っ: 'つ', ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', ゎ: 'わ',
}
const NORMALIZE = { '?': '？', '!': '！' }

const isKatakana = (ch) => ch >= 'ァ' && ch <= 'ヶ'
const toHiragana = (ch) => (isKatakana(ch) ? String.fromCharCode(ch.charCodeAt(0) - 0x60) : ch)
const toKatakana = (ch) => (ch >= 'ぁ' && ch <= 'ゖ' ? String.fromCharCode(ch.charCodeAt(0) + 0x60) : ch)
const keyOf = (ch) => Object.keys(KEYS).find((k) => KEYS[k].includes(ch)) ?? null

// 한 글자를 치는 과정: [{ key, char }] (예: ぱ → は(は키) → ば(小키) → ぱ(小키))
function pressesFor(ch) {
  const katakana = isKatakana(ch)
  let hira = NORMALIZE[ch] ?? toHiragana(ch)
  const chain = [hira]
  while (MODIFIED[hira]) {
    hira = MODIFIED[hira]
    chain.unshift(hira)
  }
  const base = keyOf(chain[0])
  if (!base) return [{ key: null, char: ch }] // 키보드에 없는 글자(이모지·한자 등)는 한 번에
  const out = (c) => (katakana ? toKatakana(c) : c)
  return chain.map((c, i) => ({ key: i === 0 ? base : '小', char: out(c) }))
}

// prefix: 이미 입력칸에 있는 글자, composing: 그중 끝에서 확정 전인 글자 수
export function kanaSteps(item, prefix = '', composing = 0) {
  const steps = []
  const reading = item.kana ?? item.text
  const converts = item.kana && item.kana !== item.text
  let typed = ''

  for (const ch of reading) {
    for (const { key, char } of pressesFor(ch)) {
      const current = typed + char
      steps.push({
        key,
        text: prefix + current,
        composing: composing + [...current].length,
        candidates: converts ? [item.text, current] : [current],
      })
    }
    typed += pressesFor(ch).at(-1).char
  }

  // 한자 등으로 변환해서 확정
  if (converts) steps.push({ key: 'cand', text: prefix + item.text, composing: 0, candidates: [], convert: true })
  return steps
}
