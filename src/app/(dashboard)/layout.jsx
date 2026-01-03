'use client'

import React from 'react'
import { Layout, Menu, Avatar } from 'antd'
import {
  PieChartOutlined,
  BookOutlined,
  ShopOutlined,
  BoxPlotOutlined,
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  SearchOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  ExperimentOutlined
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/utils/auth'

const { Header, Content, Sider } = Layout

const menuItems = [
  {
    key: '/bi-cockpit',
    icon: <PieChartOutlined />,
    label: '大数据中心'
  },
  {
    key: '/customer',
    icon: <BookOutlined />,
    label: '客户管理'
  },
  {
    key: '/order',
    icon: <ShopOutlined />,
    label: '订单中心'
  },
  {
    key: '/delivery',
    icon: <BoxPlotOutlined />,
    label: '交付跟踪'
  },
  {
    key: 'ecosystem',
    icon: <TeamOutlined />,
    label: '共建生态链',
    children: [
      { key: '/xuezhi-ecosystem', label: '学智生态圈' },
      { key: '/supplier', label: '供应商管理' }
    ]
  },
  {
    key: '/ai-solution',
    icon: <SolutionOutlined />,
    label: 'AI方案中心'
  },
  {
    key: 'product-library',
    icon: <AppstoreOutlined />,
    label: '学智产品库',
    children: [
      { key: '/product-library/ai-gallery', label: 'AI产品展示' },
      { key: '/product-library', label: 'AI产品库' }
    ]
  },
  {
    key: '/ai-research',
    icon: <ExperimentOutlined />,
    label: 'AI研发中心'
  },
  {
    key: '/case-library',
    icon: <BookOutlined />,
    label: '落地案例库'
  },
  {
    key: 'talent',
    icon: <UserOutlined />,
    label: '全球人才库',
    children: [
      { key: '/talent-overview', label: '人才概览' },
      { key: '/planner-management', label: '全球AI工程师库' },
      { key: '/designer-management', label: '全球教育专家库' },
      { key: '/engineer-management', label: '全球设计师中心' },
      { key: '/photographer-management', label: '全球建设工程师' }
    ]
  },
  {
    key: '/financial',
    icon: <DollarOutlined />,
    label: '财务管理'
  }
]

const fullScreenRoutes = [
  '/product-library/ai-gallery',
  '/xuezhi-ecosystem',
  '/talent-overview',
  '/planner-management',
  '/designer-management',
  '/engineer-management',
  '/photographer-management'
]

const flatContentRoutes = ['/customer']

const getMenuKey = (pathname) => {
  const keys = []
  menuItems.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => keys.push(child.key))
    }
    if (item.key) keys.push(item.key)
  })

  const match = keys.find((key) => pathname === key || pathname.startsWith(`${key}/`))
  return match || pathname
}

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedKeys, setSelectedKeys] = React.useState([getMenuKey(pathname)])

  React.useEffect(() => {
    setSelectedKeys([getMenuKey(pathname)])
  }, [pathname])

  const handleMenuClick = ({ key }) => {
    router.push(key)
  }

  const handleLogout = async () => {
    await signOut()
    router.replace('/login')
  }

  const isFullScreenPage = fullScreenRoutes.some((path) => pathname.startsWith(path))
  const isFlatContentPage = flatContentRoutes.some((path) => pathname.startsWith(path))

  return (
    <Layout className="app-layout">
      <Header className="app-header macos-header">
        <div className="header-left">
          <div className="app-title">学智AI管理平台</div>
        </div>
        <div className="header-center" />
        <div className="header-right">
          <div className="search-bar">
            <SearchOutlined className="transition-all" />
            <input type="text" placeholder="搜索..." className="search-input" />
          </div>
          <div className="header-actions">
            <button className="action-btn notification-btn transition-all" type="button">
              <BellOutlined />
              <span className="badge">3</span>
            </button>
            <button className="action-btn transition-all" type="button">
              <SettingOutlined />
            </button>
            <button className="action-btn transition-all" type="button" onClick={handleLogout}>
              退出
            </button>
            <div className="user-profile">
              <Avatar size={32} className="transition-all">
                U
              </Avatar>
              <span className="user-name transition-all">管理员</span>
            </div>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider width={240} className="app-sider macos-sider" theme="light" trigger={null}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">导航菜单</h3>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            style={{ height: 'calc(100% - 60px)', borderRight: 0, backgroundColor: 'transparent' }}
            onClick={handleMenuClick}
            items={menuItems}
            className="macos-menu transition-all"
          />
        </Sider>
        <Content
          className={
            isFullScreenPage
              ? 'app-content pl-gallery-content'
              : isFlatContentPage
                ? 'app-content app-content-flat'
                : 'app-content'
          }
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
