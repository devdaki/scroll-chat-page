// 한글 문장을 실제 두벌식 키보드로 치는 순서대로 쪼개요.
// typingSteps('괜찮아?') →
//   [{ key: 'ㄱ', text: 'ㄱ' }, { key: 'ㅗ', text: '고' }, { key: 'ㅐ', text: '괘' }, { key: 'ㄴ', text: '괜' }, ...]
// key: 누른 키 (키보드에서 눌리는 효과용), text: 그 키를 누른 뒤 입력칸에 보이는 글자

const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const MEDIALS = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
const FINALS = ['', ...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ']

// 두 번 눌러서 만드는 모음·받침
const SPLIT = {
  ㅘ: 'ㅗㅏ', ㅙ: 'ㅗㅐ', ㅚ: 'ㅗㅣ', ㅝ: 'ㅜㅓ', ㅞ: 'ㅜㅔ', ㅟ: 'ㅜㅣ', ㅢ: 'ㅡㅣ',
  ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ', ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ',
}
// 쌍자음 등 Shift로 치는 글자는 기본 키로 표시
const BASE_KEY = { ㄲ: 'ㄱ', ㄸ: 'ㄷ', ㅃ: 'ㅂ', ㅆ: 'ㅅ', ㅉ: 'ㅈ', ㅒ: 'ㅐ', ㅖ: 'ㅔ' }

const compose = (i, m, f = 0) => String.fromCharCode(0xac00 + (i * 21 + m) * 28 + f)
const keyOf = (jamo) => BASE_KEY[jamo] ?? jamo

// prefix: 이미 입력칸에 있는 글자 (그 뒤에 이어서 쳐요)
export function typingSteps(sentence, prefix = '') {
  const steps = []
  let done = prefix

  for (const ch of sentence) {
    const code = ch.charCodeAt(0) - 0xac00
    if (code < 0 || code > 11171) {
      // 한글 음절이 아닌 글자(?, 공백, 영어 등)는 한 번에
      done += ch
      steps.push({ key: ch === ' ' ? 'space' : ch, text: done })
      continue
    }

    const i = Math.floor(code / 588)
    const m = Math.floor((code % 588) / 28)
    const f = code % 28

    steps.push({ key: keyOf(INITIALS[i]), text: done + INITIALS[i] })

    const medial = MEDIALS[m]
    const medialParts = SPLIT[medial] ?? medial
    for (let n = 1; n <= medialParts.length; n++) {
      const partial = n === medialParts.length ? m : MEDIALS.indexOf(medialParts.slice(0, n))
      steps.push({ key: keyOf(medialParts[n - 1]), text: done + compose(i, partial) })
    }

    if (f) {
      const final = FINALS[f]
      const finalParts = SPLIT[final] ?? final
      for (let n = 1; n <= finalParts.length; n++) {
        const partial = n === finalParts.length ? f : FINALS.indexOf(finalParts.slice(0, n))
        steps.push({ key: keyOf(finalParts[n - 1]), text: done + compose(i, m, partial) })
      }
    }

    done += ch
  }
  return steps
}

// ChatRoom의 draft를 키 누르는 순서로 바꿔요.
// draft: '괜찮아?' 처럼 문자열 하나, 또는 아래 항목들의 배열
//   '문자열'          → 지금 입력칸 뒤에 이어서 타이핑
//   { erase: 3 }      → 뒤에서부터 3글자 지우기 ('all'이면 전부)
//   { wait: 800 }     → 0.8초 멈추기
// 각 단계에 delay(ms)가 있으면 그 단계 전에 그만큼 기다려요.
const ERASE_INTERVAL = 110
const ERASE_PAUSE = 700

export function draftSteps(draft) {
  const items = Array.isArray(draft) ? draft : [draft]
  const steps = []
  let text = ''

  for (const item of items) {
    if (typeof item === 'string') {
      const typed = typingSteps(item, text)
      steps.push(...typed)
      text = typed.at(-1)?.text ?? text
    } else if (item?.erase) {
      const chars = [...text]
      const count = item.erase === 'all' ? chars.length : Math.min(item.erase, chars.length)
      for (let n = 1; n <= count; n++) {
        // 지우기 시작 전엔 잠깐 망설이고, 그다음은 빠르게
        steps.push({ key: 'back', text: chars.slice(0, chars.length - n).join(''), delay: n === 1 ? ERASE_PAUSE : ERASE_INTERVAL })
      }
      text = chars.slice(0, chars.length - count).join('')
    } else if (item?.wait) {
      steps.push({ key: null, text, delay: item.wait })
    }
  }
  return steps
}
