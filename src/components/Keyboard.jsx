// 아이폰 한글(두벌식) 키보드 모양. 누를 수는 없고, pressed에 넣은 키가 눌린 것처럼 보여요.
const ROWS = [
  [...'ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ'],
  [...'ㅁㄴㅇㄹㅎㅗㅓㅏㅣ'],
  [...'ㅋㅌㅊㅍㅠㅜㅡ'],
]

export default function Keyboard({ pressed }) {
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
    <div aria-hidden="true" className="flex flex-col gap-3 bg-[#d1d3d9] px-1 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] text-neutral-900 select-none">
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
