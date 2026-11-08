import { typingSteps } from './hangul.js'
import { kanaSteps } from './kana.js'

// ChatRoom의 draft를 키 누르는 순서로 바꿔요.
// draft: '괜찮아?' 처럼 문자열 하나, 또는 아래 항목들의 배열
//   '문자열'                    → 지금 입력칸 뒤에 이어서 타이핑
//   { text: '문자열', speed: 300 } → 이 부분만 키 하나당 300ms로 타이핑
//   { text: '大丈夫', kana: 'だいじょうぶ' } → (일본어) 히라가나로 친 뒤 변환
//   { erase: 3 }                → 뒤에서부터 3글자 지우기 ('all'이면 전부), speed도 쓸 수 있어요
//   { wait: 800 }               → 0.8초 멈추기
// 언어별로 다르게: { ko: [...], ja: [...] } (채팅 언어에 맞는 쪽, 없으면 다른 쪽을 써요)
// typeSpeed: 키 하나 누르는 간격(ms) 기본값. 숫자가 클수록 느려요.
// 각 단계의 delay(ms) = 그 단계 전에 기다리는 시간
const ERASE_INTERVAL = 110
const ERASE_PAUSE = 700
const CONVERT_PAUSE = 500

// 채팅 언어에 맞는 draft와 키보드 언어 고르기
export function pickDraft(draft, language) {
  if (!draft) return null
  if (typeof draft === 'string' || Array.isArray(draft)) return { lang: 'ko', items: draft }
  const lang = draft[language] ? language : language === 'ko' ? 'ja' : 'ko'
  return draft[lang] ? { lang, items: draft[lang] } : null
}

export function draftSteps(draft, typeSpeed = 170, lang = 'ko') {
  const items = Array.isArray(draft) ? draft : [draft]
  const steps = []
  let text = ''
  let composing = 0

  for (const raw of items) {
    const item = typeof raw === 'string' ? { text: raw } : raw
    if (typeof item?.text === 'string') {
      const typed = lang === 'ja' ? kanaSteps(item, text, composing) : typingSteps(item.text, text)
      const delay = item.speed ?? typeSpeed
      steps.push(...typed.map((step) => ({ ...step, delay: step.convert ? CONVERT_PAUSE : delay })))
      text = typed.at(-1)?.text ?? text
      composing = typed.at(-1)?.composing ?? 0
    } else if (item?.erase) {
      const chars = [...text]
      const count = item.erase === 'all' ? chars.length : Math.min(item.erase, chars.length)
      for (let n = 1; n <= count; n++) {
        // 지우기 시작 전엔 잠깐 망설이고, 그다음은 빠르게
        const delay = n === 1 ? ERASE_PAUSE : (item.speed ?? ERASE_INTERVAL)
        const left = Math.max(composing - n, 0)
        steps.push({ key: 'back', text: chars.slice(0, chars.length - n).join(''), composing: left, candidates: left ? undefined : [], delay })
      }
      text = chars.slice(0, chars.length - count).join('')
      composing = Math.max(composing - count, 0)
    } else if (item?.wait) {
      steps.push({ key: null, text, composing, delay: item.wait })
    }
  }

  // 후보가 안 적힌 단계는 바로 앞 단계 후보를 이어서 보여줘요
  let candidates = []
  for (const step of steps) {
    if (step.candidates) candidates = step.candidates
    else if (step.key === 'back' && step.composing) candidates = [[...step.text].slice(-step.composing).join('')]
    step.candidates = candidates
  }
  return steps
}
