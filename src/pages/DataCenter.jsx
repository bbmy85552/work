import React, { useState, useEffect } from 'react'
import { Card, Statistic, Row, Col, Select, Typography } from 'antd'
import { SyncOutlined, FileTextOutlined, ShoppingCartOutlined, CheckCircleOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons'
const { Text } = Typography
const { Option } = Select

import dataCenterData from '../mock/dataCenterData.js';
import schoolData from '../mock/schoolData.js';
import deliveryData from '../mock/deliveryData.js';
import DataVisualizationDashboard from './components/DataVisualizationDashboard';

const DataCenter = () => {
  const [selectedEducationStage, setSelectedEducationStage] = useState('全部')
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('全部')
  const [filteredStats, setFilteredStats] = useState(dataCenterData.realTimeStats)
  
  // 筛选数据函数
  const filterData = () => {
    // 获取所有合作学校
    let filteredSchools = schoolData.cooperationSchools;
    
    // 根据教育阶段筛选
    if (selectedEducationStage !== '全部') {
      filteredSchools = filteredSchools.filter(school => 
        school.schoolType === selectedEducationStage
      );
    }
    
    // 根据项目交付类型筛选
    if (selectedDeliveryType !== '全部') {
      filteredSchools = filteredSchools.filter(school => 
        school.cooperationProjects && school.cooperationProjects.includes(selectedDeliveryType)
      );
    }
    
    // 获取所有相关的交付项目
    const schoolIds = filteredSchools.map(school => school.id);
    const filteredDeliveries = deliveryData.deliveries.filter(delivery => 
      schoolIds.some(id => delivery.orderId.includes(id))
    );
    
    // 计算统计数据
    const stats = {
      pendingSchools: filteredSchools.filter(school => school.status === '待对接').length,
      pendingDesign: Math.floor(filteredSchools.length * 0.3),
      pendingOrders: filteredDeliveries.filter(d => d.purchaseStatus === '采购已完成' && d.deliveryStatus === '未交付通过').length,
      completedSchools: filteredSchools.filter(school => school.status === '已对接').length,
      totalStudents: Math.floor(filteredSchools.length * 750),
      totalRevenue: filteredSchools.reduce((sum, school) => sum + (school.cooperationAmount || 0), 0),
      monthlyRevenue: Math.floor(filteredSchools.reduce((sum, school) => sum + (school.cooperationAmount || 0), 0) * 0.1)
    };
    
    return stats;
  }
  
  // 当选择变化时重新筛选数据
  useEffect(() => {
    const newStats = filterData();
    setFilteredStats(newStats);
  }, [selectedEducationStage, selectedDeliveryType])
  
  // 处理教育阶段选择
  const handleEducationStageChange = (value) => {
    setSelectedEducationStage(value)
    // 这里可以根据选择的教育阶段更新数据
    console.log('教育阶段选择:', value)
  }
  
  // 处理项目交付类型选择
  const handleDeliveryTypeChange = (value) => {
    setSelectedDeliveryType(value)
    // 这里可以根据选择的项目交付类型更新数据
    console.log('项目交付类型选择:', value)
  }
  
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* 头部信息区域 */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          color: '#333333', 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: 0,
          textAlign: 'left'
        }}>业务数据中心</h1>
      </div>
      
      {/* 教育阶段选择器 */}
      <div style={{ 
            padding: '16px 24px', 
            marginBottom: '24px',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }} className="filter-container">
        <span style={{ color: '#333333', marginRight: '10px', fontSize: '14px', marginLeft: '20px' }}>选择教育阶段：</span>
        <Select 
            value={selectedEducationStage} 
            onChange={handleEducationStageChange}
            style={{ width: 160, marginRight: '30px' }}
            optionFilterProp="children"
            className="transition-all"
          >
          <Option value="全部">全部</Option>
          <Option value="幼儿园">幼儿园</Option>
          <Option value="小学">小学</Option>
          <Option value="初中">初中</Option>
          <Option value="大学">大学</Option>
        </Select>
        
        <span style={{ color: '#333333', marginRight: '10px', fontSize: '14px' }}>选择项目交付：</span>
        <Select 
            value={selectedDeliveryType} 
            onChange={handleDeliveryTypeChange}
            style={{ width: 160 }}
            optionFilterProp="children"
            className="transition-all"
          >
          <Option value="全部">全部</Option>
          <Option value="硬件设备">硬件设备</Option>
          <Option value="软件系统">软件系统</Option>
          <Option value="解决方案">解决方案</Option>
          <Option value="定制方案">定制方案</Option>
        </Select>
      </div>
      
      {/* 业务数据中心指标卡片 */}
      <div style={{ marginBottom: '20px' }}>
        <Row gutter={[24, 24]} style={{ margin: '0 8px' }}>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card pending-design-card transition-all">
              <Statistic 
                  title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>待确定学校</Typography.Text>} 
                  value={filteredStats.pendingSchools} 
                  valueStyle={{ color: '#1677ff', fontSize: '20px', fontWeight: 600 }} 
                  prefix={<SyncOutlined style={{ color: '#1677ff', fontSize: '20px' }} />} 
                />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card pending-orders-card transition-all">
              <Statistic 
                  title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>待设计学校</Typography.Text>} 
                  value={filteredStats.pendingDesign} 
                  valueStyle={{ color: '#ff7a45', fontSize: '20px', fontWeight: 600 }} 
                  prefix={<FileTextOutlined style={{ color: '#ff7a45', fontSize: '20px' }} />} 
                />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card completed-schools-card transition-all">
              <Statistic 
                  title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>待采购订单</Typography.Text>} 
                  value={filteredStats.pendingOrders} 
                  valueStyle={{ color: '#fd7e14', fontSize: '20px', fontWeight: 600 }} 
                  prefix={<ShoppingCartOutlined style={{ color: '#fd7e14', fontSize: '20px' }} />} 
                />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card students-card transition-all">
              <Statistic 
                  title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>已完成学校</Typography.Text>} 
                  value={filteredStats.completedSchools} 
                  valueStyle={{ color: '#52c41a', fontSize: '20px', fontWeight: 600 }} 
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />} 
                />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card monthly-revenue-card transition-all">
              <Statistic
                  title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>学生总人数</Typography.Text>}
                  value={filteredStats.totalStudents}
                  valueStyle={{ color: '#dc3545', fontSize: '20px', fontWeight: 600 }}
                  prefix={<TeamOutlined style={{ color: '#dc3545', fontSize: '20px' }} />}
                  suffix="人"
                />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card total-revenue-card transition-all">
              <Statistic 
                title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>本月营收</Typography.Text>} 
                value={filteredStats.monthlyRevenue} 
                valueStyle={{ color: '#0dcaf0', fontSize: '20px', fontWeight: 600 }} 
                prefix={<DollarOutlined style={{ color: '#0dcaf0', fontSize: '20px' }} />} 
                formatter={value => `¥ ${value.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card className="macos-card total-revenue-card transition-all">
              <Statistic 
                  title={<Typography.Text style={{ color: '#6b7280', fontSize: '14px', fontWeight: 400 }}>总营收</Typography.Text>} 
                  value={filteredStats.totalRevenue} 
                  valueStyle={{ color: '#6f42c1', fontSize: '20px', fontWeight: 600 }} 
                  prefix={<DollarOutlined style={{ color: '#6f42c1', fontSize: '20px' }} />} 
                  formatter={value => `¥ ${value.toLocaleString()}`}
                />
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 高级数据可视化大屏部分 */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
        <DataVisualizationDashboard />
      </div>
    </div>
  )
}

export default DataCenter