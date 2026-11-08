import { createContext, useCallback, useContext, useState } from 'react'

// 채팅 언어 전역 상태 ('ja' | 'ko'). 안내 페이지에서 고르고, story의 채팅방·알림·대화 목록에 적용돼요.
// 고른 값은 브라우저에 저장돼서 새로고침해도 유지돼요.
export const CHAT_LANGUAGES = [
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
]
const DEFAULT = 'ja'
const STORAGE_KEY = 'chat-language'

const ChatLanguageContext = createContext({ language: DEFAULT, setLanguage: () => {} })

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return CHAT_LANGUAGES.some((l) => l.value === saved) ? saved : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function ChatLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(load)
  const setLanguage = useCallback((value) => {
    setLanguageState(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // 저장이 막힌 브라우저(시크릿 모드 등)에선 이번 방문 동안만 유지
    }
  }, [])
  return <ChatLanguageContext.Provider value={{ language, setLanguage }}>{children}</ChatLanguageContext.Provider>
}

export const useChatLanguage = () => useContext(ChatLanguageContext)

// { text: '日本語', ko: '한국어' } 에서 지금 언어에 맞는 글자 꺼내기 (ko가 없으면 text 그대로)
export function useLocalized() {
  const { language } = useChatLanguage()
  return (item) => (language === 'ko' && item.ko ? item.ko : item.text)
}
