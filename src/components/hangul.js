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
