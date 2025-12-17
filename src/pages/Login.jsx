import React from 'react'
import { Tabs, Form, Input, Button, Checkbox, message } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '../utils/auth'
import './Login.css'

function BrandBlock() {
  return (
    <div className="login-brand">
      <div className="login-brand-inner">
        <div className="login-logo">
          <img
            className="login-logo-img"
            src="https://student-1320907290.cos.ap-guangzhou.myqcloud.com/logo.png"
            alt="学智AI Logo"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="login-brand-text">
          <div className="login-brand-title">学智AI</div>
          <div className="login-brand-subtitle">智建未来，简驭校园</div>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = React.useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const ok = signIn({ username: values.username, password: values.password })
      if (!ok) {
        message.error('账号或密码错误')
        return
      }
      message.success('登录成功')
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const form = (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ remember: true }}
      className="login-form"
    >
      <Form.Item
        label="用户名 / 邮箱"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input size="large" placeholder="请输入用户名 / 邮箱" prefix={<UserOutlined />} autoComplete="username" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          size="large"
          placeholder="请输入密码"
          prefix={<LockOutlined />}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          autoComplete="current-password"
        />
      </Form.Item>

      <div className="login-form-row">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
        </Form.Item>
        <button
          type="button"
          className="login-link"
          onClick={() => message.info('请联系管理员重置密码')}
        >
          忘记密码？
        </button>
      </div>

      <Button type="primary" htmlType="submit" size="large" loading={loading} block className="login-submit">
        登录
      </Button>
    </Form>
  )

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />
      <div className="login-container">
        <BrandBlock />
        <div className="login-panel">
          <div className="login-card">
            <Tabs
              defaultActiveKey="account"
              items={[
                { key: 'account', label: '账号登录', children: form },
                { key: 'password', label: '密码登录', children: form },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


