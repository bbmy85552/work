import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider 
        theme={{
          token: {
            colorPrimary: '#1677ff',
            fontSize: 14,
          },
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)