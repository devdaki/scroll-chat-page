import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import GuidePage from './pages/GuidePage.jsx'
import StoryPage from './pages/StoryPage.jsx'
import ChatPage from './pages/ChatPage.jsx'

// 페이지를 옮길 때마다 맨 위에서 시작
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GuidePage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<GuidePage />} />
      </Routes>
    </>
  )
}
