import React, { useState } from 'react'
import { Card, Table, Typography, Input, Button, Select, Space, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { financialData } from '../mock/mockData'

const { Title } = Typography
// Search 组件已替换为 Space.Compact + Input
const { Option } = Select

// 从集中管理的Mock数据中获取财务信息
// 假设financialData中包含了所有需要的数据结构

const FinancialManagement = () => {
  const [filteredData, setFilteredData] = useState(financialData.transactions)
  const [searchText, setSearchText] = useState('')
  const [selectedProjectCategory, setSelectedProjectCategory] = useState('')
  const [selectedCostCategory, setSelectedCostCategory] = useState('')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('')

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedProjectCategory, selectedCostCategory, selectedPaymentStatus)
  }

  // 项目类别筛选
  const handleProjectCategoryChange = (value) => {
    setSelectedProjectCategory(value)
    filterData(searchText, value, selectedCostCategory, selectedPaymentStatus)
  }

  // 费用类别筛选
  const handleCostCategoryChange = (value) => {
    setSelectedCostCategory(value)
    filterData(searchText, selectedProjectCategory, value, selectedPaymentStatus)
  }

  // 支付状态筛选
  const handlePaymentStatusChange = (value) => {
    setSelectedPaymentStatus(value)
    filterData(searchText, selectedProjectCategory, selectedCostCategory, value)
  }

  // 综合筛选数据
  const filterData = (search, projectCategory, costCategory, paymentStatus) => {
    let data = financialData.transactions
    
    if (search) {
      data = data.filter(item => 
        item.orderId.includes(search) || 
        item.schoolName.includes(search) ||
        item.transactionId.includes(search)
      )
    }
    
    if (projectCategory) {
      data = data.filter(item => item.projectCategory === projectCategory)
    }
    
    if (costCategory) {
      data = data.filter(item => item.costCategory === costCategory)
    }
    
    if (paymentStatus) {
      data = data.filter(item => item.paymentStatus === paymentStatus)
    }
    
    setFilteredData(data)
  }

  // 项目类别标签颜色
  const getProjectCategoryColor = (category) => {
    switch (category) {
      case '硬件设备': return 'purple'
      case '软件系统': return 'cyan'
      case '解决方案': return 'magenta'
      case '定制方案': return 'lime'
      case '校史文化墙科': return 'orange'
      case '校园科创文化墙': return 'green'
      case '党建文化墙': return 'red'
      case '美育文化墙': return 'pink'
      default: return 'default'
    }
  }

  // 费用类别标签颜色
  const getCostCategoryColor = (category) => {
    switch (category) {
      case '定金款': return 'blue'
      case '中期款': return 'orange'
      case '后尾款': return 'green'
      case '全款': return 'red'
      default: return 'default'
    }
  }

  // 支付状态标签颜色
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case '已支付': return 'green'
      case '处理中': return 'orange'
      case '未支付': return 'red'
      default: return 'default'
    }
  }

  // 表格列配置
  const columns = [
    { title: '订单编号', dataIndex: 'orderId', key: 'orderId' },
    { title: '学校名称', dataIndex: 'schoolName', key: 'schoolName' },
    {
      title: '项目类别', 
      dataIndex: 'projectCategory', 
      key: 'projectCategory',
      render: category => 
        <Tag color={getProjectCategoryColor(category)}>{category}</Tag>
    },
    {
      title: '费用类别', 
      dataIndex: 'costCategory', 
      key: 'costCategory',
      render: category => 
        <Tag color={getCostCategoryColor(category)}>{category}</Tag>
    },
    {
      title: '金额', 
      dataIndex: 'amount', 
      key: 'amount',
      render: amount => `¥${amount.toLocaleString()}`
    },
    { title: '交易流水号', dataIndex: 'transactionId', key: 'transactionId' },
    { title: '交易日期', dataIndex: 'transactionDate', key: 'transactionDate' },
    {
      title: '支付状态', 
      dataIndex: 'paymentStatus', 
      key: 'paymentStatus',
      render: status => 
        <Tag color={getPaymentStatusColor(status)}>{status}</Tag>
    }
  ]

  return (
    <div>
      <Title level={2}>财务管理</Title>
      
      {/* 搜索和筛选区域 */}
      <Card className="mb-4">
        <Space wrap size="middle">
          <Space.Compact size="middle" style={{ width: 400 }}>
            <Input
              placeholder="搜索订单编号、学校名称或交易流水号"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch(searchText)} />
          </Space.Compact>
          <Select
            placeholder="项目类别"
            allowClear
            style={{ width: 120 }}
            onChange={handleProjectCategoryChange}
          >
            <Option value="硬件设备">硬件设备</Option>
            <Option value="软件系统">软件系统</Option>
            <Option value="解决方案">解决方案</Option>
            <Option value="定制方案">定制方案</Option>
          </Select>
          <Select
            placeholder="费用类别"
            allowClear
            style={{ width: 120 }}
            onChange={handleCostCategoryChange}
          >
            <Option value="定金款">定金款</Option>
            <Option value="中期款">中期款</Option>
            <Option value="后尾款">后尾款</Option>
            <Option value="全款">全款</Option>
          </Select>
          <Select
            placeholder="支付状态"
            allowClear
            style={{ width: 120 }}
            onChange={handlePaymentStatusChange}
          >
            <Option value="已支付">已支付</Option>
            <Option value="处理中">处理中</Option>
            <Option value="未支付">未支付</Option>
          </Select>
        </Space>
      </Card>
      
      {/* 财务表格 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default FinancialManagement