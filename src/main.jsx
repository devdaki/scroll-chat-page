import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { ChatLanguageProvider } from './context/ChatLanguage.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatLanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChatLanguageProvider>
  </StrictMode>
)
