import { CHAT_LANGUAGES, useChatLanguage } from '../context/ChatLanguage.jsx'

// 채팅 언어 선택 (안내 페이지용 language 블록)
export default function LanguagePicker({ title = '채팅 언어', description }) {
  const { language, setLanguage } = useChatLanguage()
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {description && <p className="mb-3 text-[15px] leading-relaxed break-keep text-neutral-500">{description}</p>}
      <div role="radiogroup" aria-label={title} className="grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1">
        {CHAT_LANGUAGES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={language === value}
            onClick={() => setLanguage(value)}
            className={`rounded-xl py-3 text-[15px] font-semibold transition-colors ${
              language === value ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
