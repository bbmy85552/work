import 'antd/dist/reset.css'
import './globals.css'
import '@/legacy/AISolutionCenter.css'
import '@/legacy/AiResearchCenter.css'
import '@/legacy/BICockpit.css'
import '@/legacy/Login.css'
import '@/legacy/ProductGallery.css'
import '@/legacy/ProductLibrary.css'
import '@/legacy/ProductLibraryGallery.css'
import '@/legacy/TalentIframePage.css'
import '@/legacy/XuezhiEcosystem.css'
import '@/legacy/components/AISolution/AISolutionStyles.css'
import 'react-quill/dist/quill.snow.css'

export const metadata = {
  title: '学智AI管理平台',
  description: '学智AI统一管理平台 - Next.js 14',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
