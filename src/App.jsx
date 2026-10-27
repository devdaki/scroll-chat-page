import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import GuidePage from './pages/GuidePage.jsx'
import StoryPage from './pages/StoryPage.jsx'

// 페이지를 옮길 때마다 맨 위에서 시작
function ScrollToTop() {
  const { pathname } = useLocation()
  // 중괄호 필수: 최신 크롬은 scrollTo가 Promise를 반환해서, 그대로 반환하면 React가 정리 함수로 착각해 에러가 나요
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GuidePage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="*" element={<GuidePage />} />
      </Routes>
    </>
  )
}
