import React from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar } from 'antd'
import { PieChartOutlined, BookOutlined, ShopOutlined, BoxPlotOutlined, TeamOutlined, DollarOutlined, UserOutlined, BellOutlined, SettingOutlined, SearchOutlined, SolutionOutlined, AppstoreOutlined, ExperimentOutlined } from '@ant-design/icons'
import './App.css'
import DataCenter from './pages/DataCenter.jsx'
import SchoolManagement from './pages/SchoolManagement'
import OrderCenter from './pages/OrderCenter'
import DeliveryTracking from './pages/DeliveryTracking'
import SupplierManagement from './pages/SupplierManagement'
import FinancialManagement from './pages/FinancialManagement'
import TalentManagement from './pages/TalentManagement'
import PlannerManagement from './pages/PlannerManagement'
import DesignerManagement from './pages/DesignerManagement'
import EngineerManagement from './pages/EngineerManagement'
import PhotographerManagement from './pages/PhotographerManagement'
import AISolutionCenter from './pages/AISolutionCenter.jsx'
import CaseLibrary from './pages/CaseLibrary.jsx'
import ProductLibrary from './pages/ProductLibrary.jsx'
import ProductLibraryGallery from './pages/ProductLibraryGallery.jsx'
import AiResearchCenter from './pages/AiResearchCenter.jsx'
import BICockpit from './pages/BICockpit.jsx'
import Login from './pages/Login.jsx'
import { isAuthed } from './utils/auth'

const { Header, Content, Sider } = Layout

function RequireAuth() {
  const location = useLocation()
  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = React.useState([location.pathname])

  React.useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location.pathname])

  const handleMenuClick = (e) => {
    setSelectedKeys([e.key])
    navigate(e.key)
  }

  // 导航菜单项
  const menuItems = [
    {
      key: '/',
      icon: <PieChartOutlined />,
      label: '大数据中心',
      children: [
        {
          key: '/dashboard',
          label: '数据中心分析',
        },
        {
          key: '/bi-cockpit',
          label: 'BI数据驾驶舱',
        }
      ]
    },
    {
      key: '/school',
      icon: <BookOutlined />,
      label: '学校管理'
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
      key: '/supplier',
      icon: <TeamOutlined />,
      label: '共建生态链'
    },
    {
      key: '/financial',
      icon: <DollarOutlined />,
      label: '财务管理'
    },
    {
      key: '/ai-solution',
      icon: <SolutionOutlined />,
      label: 'AI方案中心'
    },
    {
      key: '/ai-research',
      icon: <ExperimentOutlined />,
      label: 'AI研发中心'
    },
    {
      key: 'product-library',
      icon: <AppstoreOutlined />,
      label: '学智产品库',
      children: [
        {
          key: '/product-library/ai-gallery',
          label: 'AI产品展示'
        },
        {
          key: '/product-library',
          label: 'AI产品库'
        }
      ]
    },
    {
      key: '/case-library',
      icon: <BookOutlined />,
      label: '落地案例库'
    },
    {
      key: '/talent',
      icon: <UserOutlined />,
      label: '人才管理',
      children: [
        {
          key: '/talent-overview',
          label: '人才概览'
        },
        {
          key: '/planner-management',
          label: '策划师管理'
        },
        {
          key: '/designer-management',
          label: '设计师管理'
        },
        {
          key: '/engineer-management',
          label: '工程师管理'
        },
        {
          key: '/photographer-management',
          label: '摄影师管理'
        }
      ]
    }
  ]

  const isGalleryPage = location.pathname.startsWith('/product-library/ai-gallery')

  return (
    <Layout className="app-layout">
      <Header className="app-header macos-header">
        <div className="header-left">
          <div className="app-title">学智AI管理平台</div>
        </div>
        <div className="header-center">
          {/* 快速统计数据已移除 */}
        </div>
        <div className="header-right">
          <div className="search-bar">
            <SearchOutlined className="transition-all" />
            <input type="text" placeholder="搜索..." className="search-input" />
          </div>
          <div className="header-actions">
            <button className="action-btn notification-btn transition-all">
              <BellOutlined />
              <span className="badge">3</span>
            </button>
            <button className="action-btn transition-all">
              <SettingOutlined />
            </button>
            <div className="user-profile">
              <Avatar size={32} className="transition-all">U</Avatar>
              <span className="user-name transition-all">管理员</span>
            </div>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider 
          width={240}
          className="app-sider macos-sider"
          theme="light"
          trigger={null}
        >
          {/* 侧边栏标题 */}
          <div className="sidebar-header">
            <h3 className="sidebar-title">导航菜单</h3>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            style={{ 
              height: 'calc(100% - 60px)',
              borderRight: 0,
              backgroundColor: 'transparent'
            }}
            onClick={handleMenuClick}
            items={menuItems}
            className="macos-menu transition-all"
            itemIcon={<span className="transition-all" />}
          />
        </Sider>
        <Content className={isGalleryPage ? 'app-content pl-gallery-content' : 'app-content'}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

function App() {
  const authed = isAuthed()
  return (
    <Routes>
      <Route
        path="/login"
        element={authed ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DataCenter />} />
          <Route path="/dashboard" element={<DataCenter />} />
          <Route path="/bi-cockpit" element={<BICockpit />} />
          <Route path="/school" element={<SchoolManagement />} />
          <Route path="/order" element={<OrderCenter />} />
          <Route path="/delivery" element={<DeliveryTracking />} />
          <Route path="/supplier" element={<SupplierManagement />} />
          <Route path="/financial" element={<FinancialManagement />} />
          <Route path="/ai-solution" element={<AISolutionCenter />} />
          <Route path="/ai-research" element={<AiResearchCenter />} />
          <Route path="/product-library" element={<ProductLibrary />} />
          <Route path="/product-library/ai-gallery" element={<ProductLibraryGallery />} />
          <Route path="/product-library/:categoryKey" element={<ProductLibrary />} />
          <Route path="/product-library/:categoryKey/:productId" element={<ProductLibrary />} />
          <Route path="/talent-overview" element={<TalentManagement />} />
          <Route path="/planner-management" element={<PlannerManagement />} />
          <Route path="/designer-management" element={<DesignerManagement />} />
          <Route path="/engineer-management" element={<EngineerManagement />} />
          <Route path="/photographer-management" element={<PhotographerManagement />} />
          <Route path="/case-library" element={<CaseLibrary />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={authed ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App
