import React from 'react'
import { Card, Statistic, Row, Col, Typography, Button } from 'antd'
import { UserOutlined, CodeOutlined, CameraOutlined, EditOutlined, RocketOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const TalentManagement = () => {
  const navigate = useNavigate()

  // 模拟数据
  const talentStats = {
    planners: 15,
    designers: 12,
    engineers: 20,
    photographers: 8,
    total: 55
  }

  // 导航到各子模块
  const navigateToModule = (path) => {
    navigate(path)
  }

  return (
    <div>
      <Title level={2}>人才管理</Title>
      
      {/* 总体统计区域 */}
      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic 
                title="策划师总数" 
                value={talentStats.planners} 
                prefix={<EditOutlined />}
                valueStyle={{ color: '#1677ff' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic 
                title="设计师总数" 
                value={talentStats.designers} 
                prefix={<RocketOutlined />}
                valueStyle={{ color: '#faad14' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic 
                title="工程师总数" 
                value={talentStats.engineers} 
                prefix={<CodeOutlined />}
                valueStyle={{ color: '#13c2c2' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic 
                title="摄影师总数" 
                value={talentStats.photographers} 
                prefix={<CameraOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix="人"
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={16} lg={12}>
            <Card>
              <Statistic 
                title="人才总数" 
                value={talentStats.total} 
                prefix={<UserOutlined />}
                valueStyle={{ color: '#f5222d' }}
                suffix="人"
              />
            </Card>
          </Col>
        </Row>
      </Card>
      
      {/* 子模块入口区域 */}
      <Title level={4}>人才分类管理</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable 
            actions={[
              <Button 
                key="view" 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => navigateToModule('/talent/planner')}
              >
                管理策划师
              </Button>
            ]}
          >
            <Title level={5} style={{ margin: 0 }}>
              <EditOutlined /> 策划师管理
            </Title>
            <p>管理所有策划师信息，包括基础资料、项目经验和工作状态</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable 
            actions={[
              <Button 
                key="view" 
                type="primary" 
                icon={<RocketOutlined />}
                onClick={() => navigateToModule('/talent/designer')}
              >
                管理设计师
              </Button>
            ]}
          >
            <Title level={5} style={{ margin: 0 }}>
              <RocketOutlined /> 设计师管理
            </Title>
            <p>管理所有设计师信息，包括设计作品、擅长领域和工作状态</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable 
            actions={[
              <Button 
                key="view" 
                type="primary" 
                icon={<CodeOutlined />}
                onClick={() => navigateToModule('/talent/engineer')}
              >
                管理工程师
              </Button>
            ]}
          >
            <Title level={5} style={{ margin: 0 }}>
              <CodeOutlined /> 工程师管理
            </Title>
            <p>管理所有工程师信息，包括技术栈、项目经验和工作状态</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable 
            actions={[
              <Button 
                key="view" 
                type="primary" 
                icon={<CameraOutlined />}
                onClick={() => navigateToModule('/talent/photographer')}
              >
                管理摄影师
              </Button>
            ]}
          >
            <Title level={5} style={{ margin: 0 }}>
              <CameraOutlined /> 摄影师管理
            </Title>
            <p>管理所有摄影师信息，包括作品集、拍摄类型和工作状态</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default TalentManagement