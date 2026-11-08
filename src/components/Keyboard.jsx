// 아이폰 키보드 모양. 누를 수는 없고, pressed에 넣은 키가 눌린 것처럼 보여요.
// layout: 'ko' = 한글 두벌식, 'ja' = 일본어 12키(플릭). candidates: 일본어 변환 후보
const ROWS = [
  [...'ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ'],
  [...'ㅁㄴㅇㄹㅎㅗㅓㅏㅣ'],
  [...'ㅋㅌㅊㅍㅠㅜㅡ'],
]

export default function Keyboard({ layout = 'ko', pressed, candidates }) {
  return layout === 'ja' ? <JapaneseKeyboard pressed={pressed} candidates={candidates} /> : <KoreanKeyboard pressed={pressed} />
}

const KEYBOARD_BG = 'bg-[#d1d3d9] text-neutral-900 select-none'

function KoreanKeyboard({ pressed }) {
  const key = (label, id = label, wide = '') => (
    <span
      key={id}
      className={`flex h-10.5 items-center justify-center rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.3)] transition-colors duration-75 ${
        pressed === id ? 'bg-neutral-300' : 'bg-white'
      } ${wide || 'flex-1 text-[19px]'}`}
    >
      {label}
    </span>
  )
  const fnKey = (label, id, wide) => (
    <span
      key={id}
      className={`flex h-10.5 items-center justify-center rounded-[5px] text-[15px] shadow-[0_1px_0_rgba(0,0,0,0.3)] transition-colors duration-75 ${
        pressed === id ? 'bg-white' : 'bg-neutral-400/60'
      } ${wide}`}
    >
      {label}
    </span>
  )

  return (
    <div aria-hidden="true" className={`flex flex-col gap-3 px-1 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] ${KEYBOARD_BG}`}>
      <div className="flex gap-1.5">{ROWS[0].map((k) => key(k))}</div>
      <div className="flex gap-1.5 px-[5%]">{ROWS[1].map((k) => key(k))}</div>
      <div className="flex gap-1.5">
        {fnKey('⇧', 'shift', 'w-11 mr-2')}
        {ROWS[2].map((k) => key(k))}
        {fnKey('⌫', 'back', 'w-11 ml-2')}
      </div>
      <div className="flex gap-1.5">
        {fnKey('123', '123', 'w-11')}
        {fnKey('☺', 'emoji', 'w-11')}
        {key('스페이스', 'space', 'flex-1 text-[15px]')}
        {fnKey('return', 'return', 'w-22')}
      </div>
    </div>
  )
}

// 일본어 12키: 가운데 3열이 글자 키, 양옆이 기능 키, 오른쪽 아래 改行은 2칸 높이
const JA_GRID = [
  ['→', 'あ', 'か', 'さ', '⌫'],
  ['↺', 'た', 'な', 'は', '空白'],
  ['ABC', 'ま', 'や', 'ら', '改行'],
  ['☺', '小゛゜', 'わ', '、。?!'],
]
const JA_ID = { '⌫': 'back', 空白: 'space', 改行: 'return', '小゛゜': '小', '、。?!': '、' }
const JA_FN = ['→', '↺', 'ABC', '☺', '⌫', '空白', '改行']

function JapaneseKeyboard({ pressed, candidates = [] }) {
  return (
    <div aria-hidden="true" className={KEYBOARD_BG}>
      {/* 변환 후보 */}
      <div className="flex h-10 items-center gap-5 overflow-hidden px-4 text-[17px] whitespace-nowrap">
        {candidates.map((c, i) => (
          <span key={i} className={`rounded px-1.5 transition-colors ${pressed === 'cand' && i === 0 ? 'bg-white' : ''}`}>
            {c}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1.4fr_1.4fr_1.4fr_1fr] grid-rows-4 gap-1.5 px-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
        {JA_GRID.flat().map((label) => {
          const id = JA_ID[label] ?? label
          const fn = JA_FN.includes(label)
          return (
            <span
              key={label}
              className={`flex h-11 items-center justify-center rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.3)] transition-colors duration-75 ${
                fn ? 'text-[15px]' : 'text-[21px]'
              } ${label === '小゛゜' || label === '、。?!' ? 'text-[15px]' : ''} ${
                label === '改行' ? 'row-span-2 h-auto' : ''
              } ${pressed === id ? (fn ? 'bg-white' : 'bg-neutral-300') : fn ? 'bg-neutral-400/60' : 'bg-white'}`}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
