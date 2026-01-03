import React, { useState } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tag, DatePicker, Modal, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { orderData } from '../mock/mockData'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

// 从集中管理的Mock数据中获取数据
const { ordersData: ordersData } = orderData

const OrderCenter = () => {
  const [filteredData, setFilteredData] = useState(ordersData)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedProjectType, setSelectedProjectType] = useState('')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [orders, setOrders] = useState(ordersData)

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedStatus, selectedProjectType, selectedPaymentStatus)
  }

  // 状态筛选
  const handleStatusChange = (value) => {
    setSelectedStatus(value)
    filterData(searchText, value, selectedProjectType, selectedPaymentStatus)
  }

  // 项目类型筛选
  const handleProjectTypeChange = (value) => {
    setSelectedProjectType(value)
    filterData(searchText, selectedStatus, value, selectedPaymentStatus)
  }

  // 付款状态筛选
  const handlePaymentStatusChange = (value) => {
    setSelectedPaymentStatus(value)
    filterData(searchText, selectedStatus, selectedProjectType, value)
  }

  // 综合筛选数据
  const filterData = (search, status, projectType, paymentStatus) => {
    let data = [...orders]
    
    if (search) {
      data = data.filter(order => 
        order.id.includes(search) || 
        order.school.includes(search) ||
        order.applicant.includes(search) ||
        order.contact.includes(search) ||
        order.manager.includes(search)
      )
    }
    
    if (status) {
      data = data.filter(order => order.status === status)
    }
    
    if (projectType) {
      data = data.filter(order => order.projectType === projectType)
    }
    
    if (paymentStatus) {
      data = data.filter(order => order.paymentStatus === paymentStatus)
    }
    
    setFilteredData(data)
  }
  
  // 显示新建订单Modal
  const showCreateProjectModal = () => {
    setIsModalVisible(true)
  }
  
  // 关闭新建订单Modal
  const handleModalCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }
  
  // 新建项目提交处理
  const handleCreateProject = async () => {
    try {
      const values = await form.validateFields()
      const newOrder = {
        ...values,
        id: `ORD${Date.now()}`,
        totalAmount: parseFloat(values.totalAmount),
        deliveryDate: values.deliveryDate.format('YYYY-MM-DD')
      }
      
      const updatedOrders = [newOrder, ...orders]
      setOrders(updatedOrders)
      setFilteredData(updatedOrders)
      form.resetFields()
      setIsModalVisible(false)
      message.success('订单创建成功')
    } catch (errorInfo) {
      console.log('表单验证失败:', errorInfo)
    }
  }

  // 订单状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case '已通过': return 'blue'
      case '交付中': return 'orange'
      case '已完成': return 'green'
      default: return 'default'
    }
  }

  // 项目类型标签颜色
  const getProjectTypeColor = (type) => {
    switch (type) {
      case '硬件设备': return 'purple'
      case '软件系统': return 'cyan'
      case '解决方案': return 'magenta'
      case '定制方案': return 'lime'
      default: return 'default'
    }
  }

  // 付款状态标签颜色
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case '定金款': return 'blue'
      case '中期款': return 'orange'
      case '后尾款': return 'green'
      default: return 'default'
    }
  }

  // 表格列配置
  const columns = [
    {
      title: '项目编号', dataIndex: 'id', key: 'id'
    },
    { title: '项目申请人', dataIndex: 'applicant', key: 'applicant' },
    {
        title: '项目状态', 
        dataIndex: 'status', 
        key: 'status',
      render: status => 
        <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: '项目类型', 
      dataIndex: 'projectType', 
      key: 'projectType',
      render: type => 
        <Tag color={getProjectTypeColor(type)}>{type}</Tag>
    },
    { title: '学校', dataIndex: 'school', key: 'school' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    {
      title: '项目总金额', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: amount => `¥${amount.toLocaleString()}`
    },
    {
      title: '付款状态', 
      dataIndex: 'paymentStatus', 
      key: 'paymentStatus',
      render: status => 
        <Tag color={getPaymentStatusColor(status)}>{status}</Tag>
    },
    { title: '交付日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '总负责人', dataIndex: 'manager', key: 'manager' },
    { title: '备注', dataIndex: 'remark', key: 'remark' }
  ]

  return (
    <div>
      <Title level={2}>订单中心</Title>
      
      {/* 搜索和筛选区域 */}
      <Card className="mb-4">
        <Space wrap size="middle">
          <Space.Compact size="middle" style={{ width: 400 }}>
            <Input
              placeholder="搜索订单编号、学校、申请人、联系人或负责人"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch(searchText)} />
          </Space.Compact>
          <Select
            placeholder="订单状态"
            allowClear
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="已通过">已通过</Option>
            <Option value="交付中">交付中</Option>
            <Option value="已完成">已完成</Option>
          </Select>
          <Select
            placeholder="项目类型"
            allowClear
            style={{ width: 120 }}
            onChange={handleProjectTypeChange}
          >
            <Option value="硬件设备">硬件设备</Option>
            <Option value="软件系统">软件系统</Option>
            <Option value="解决方案">解决方案</Option>
            <Option value="定制方案">定制方案</Option>
          </Select>
          <Select
            placeholder="付款状态"
            allowClear
            style={{ width: 120 }}
            onChange={handlePaymentStatusChange}
          >
            <Option value="定金款">定金款</Option>
            <Option value="中期款">中期款</Option>
              <Option value="后尾款">后尾款</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreateProjectModal}>
            新建项目
          </Button>
        </Space>
      </Card>
      
      {/* 订单表格 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      
      {/* 新建项目Modal */}
      <Modal
        title="新建项目"
        open={isModalVisible}
        onOk={handleCreateProject}
        onCancel={handleModalCancel}
        okText="确认创建"
        cancelText="取消"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '已通过',
            projectType: '硬件设备',
            paymentStatus: '定金款'
          }}
        >
          <Space wrap direction="vertical" style={{ width: '100%' }}>
            <Space wrap style={{ width: '100%' }}>
              <Form.Item
                name="applicant"
                label="项目申请人"
                rules={[{ required: true, message: '请输入项目申请人' }]}
                style={{ width: '48%' }}
              >
                <Input placeholder="请输入订单申请人" />
              </Form.Item>
              <Form.Item
                name="school"
                label="学校"
                rules={[{ required: true, message: '请输入学校名称' }]}
                style={{ width: '48%' }}
              >
                <Input placeholder="请输入学校名称" />
              </Form.Item>
            </Space>
            
            <Space wrap style={{ width: '100%' }}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人姓名' }]}
                style={{ width: '31%' }}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
              <Form.Item
                name="manager"
                label="总负责人"
                rules={[{ required: true, message: '请输入总负责人姓名' }]}
                style={{ width: '31%' }}
              >
                <Input placeholder="请输入总负责人姓名" />
              </Form.Item>
              <Form.Item
                name="deliveryDate"
                label="交付日期"
                rules={[{ required: true, message: '请选择交付日期' }]}
                style={{ width: '31%' }}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择交付日期" />
              </Form.Item>
            </Space>
            
            <Space wrap style={{ width: '100%' }}>
              <Form.Item
                name="status"
                label="项目状态"
                rules={[{ required: true, message: '请选择项目状态' }]}
                style={{ width: '31%' }}
              >
                <Select placeholder="请选择订单状态">
                  <Option value="已通过">已通过</Option>
                  <Option value="交付中">交付中</Option>
                  <Option value="已完成">已完成</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="projectType"
                label="项目类型"
                rules={[{ required: true, message: '请选择项目类型' }]}
                style={{ width: '31%' }}
              >
                <Select placeholder="请选择项目类型">
                  <Option value="硬件设备">硬件设备</Option>
                  <Option value="软件系统">软件系统</Option>
                  <Option value="解决方案">解决方案</Option>
                  <Option value="定制方案">定制方案</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="paymentStatus"
                label="付款状态"
                rules={[{ required: true, message: '请选择付款状态' }]}
                style={{ width: '31%' }}
              >
                <Select placeholder="请选择付款状态">
                  <Option value="定金款">定金款</Option>
                  <Option value="中期款">中期款</Option>
                  <Option value="后尾款">后尾款</Option>
                </Select>
              </Form.Item>
            </Space>
            
            <Space wrap style={{ width: '100%' }}>
              <Form.Item
                name="totalAmount"
                label="项目总金额"
                rules={[{ required: true, message: '请输入项目总金额' }]}
                style={{ width: '48%' }}
              >
                <Input placeholder="请输入订单总金额" prefix="¥" />
              </Form.Item>
            </Space>
            
            <Form.Item
              name="remark"
              label="备注"
            >
              <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}

export default OrderCenter