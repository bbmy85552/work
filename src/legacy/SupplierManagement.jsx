import React, { useState } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tag, Modal, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { supplierData } from '../mock/mockData'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 从集中管理的Mock数据中获取数据
const { suppliers: suppliersData } = supplierData

const SupplierManagement = () => {
  const [filteredData, setFilteredData] = useState(suppliersData)
  const [searchText, setSearchText] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [suppliers, setSuppliers] = useState(suppliersData)

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedLevel)
  }

  // 关系级别筛选
  const handleLevelChange = (value) => {
    setSelectedLevel(value)
    filterData(searchText, value)
  }

  // 综合筛选数据
  const filterData = (search, level) => {
    let data = [...suppliers]
    
    if (search) {
      data = data.filter(supplier => 
        supplier.name.includes(search) || 
        supplier.company.includes(search) ||
        supplier.contact.includes(search) ||
        supplier.id.includes(search)
      )
    }
    
    if (level) {
      data = data.filter(supplier => supplier.relationshipLevel === level)
    }
    
    setFilteredData(data)
  }
  
  // 显示添加供应商Modal
  const showAddSupplierModal = () => {
    setIsModalVisible(true)
  }
  
  // 关闭添加供应商Modal
  const handleModalCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }
  
  // 添加供应商提交处理
  const handleAddSupplier = async () => {
    try {
      const values = await form.validateFields()
      const newSupplier = {
        ...values,
        id: `SUP${Date.now()}`,
        productCount: parseInt(values.productCount) || 0,
        cooperationTimes: parseInt(values.cooperationTimes) || 0,
        totalAmount: parseFloat(values.totalAmount) || 0
      }
      
      const updatedSuppliers = [newSupplier, ...suppliers]
      setSuppliers(updatedSuppliers)
      setFilteredData(updatedSuppliers)
      form.resetFields()
      setIsModalVisible(false)
      message.success('供应商添加成功')
    } catch (errorInfo) {
      console.log('表单验证失败:', errorInfo)
    }
  }

  // 关系级别标签颜色
  const getRelationshipLevelColor = (level) => {
    switch (level) {
      case '战略合作': return 'red'
      case '优质合作': return 'orange'
      case '备选合作': return 'blue'
      default: return 'default'
    }
  }

  // 表格列配置
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '公司', dataIndex: 'company', key: 'company' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '关系级别', 
      dataIndex: 'relationshipLevel', 
      key: 'relationshipLevel',
      render: level => 
        <Tag color={getRelationshipLevelColor(level)}>{level}</Tag>
    },
    { title: '产品数量', dataIndex: 'productCount', key: 'productCount' },
    { title: '合作次数', dataIndex: 'cooperationTimes', key: 'cooperationTimes' },
    {
      title: '总金额', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: amount => `¥${amount.toLocaleString()}`
    },
    { title: '公司地址', dataIndex: 'address', key: 'address' }
  ]

  return (
    <div>
      <Title level={2}>供应商管理</Title>
      
      {/* 搜索和筛选区域 */}
      <Card className="mb-4">
        <Space wrap size="middle">
          <Space.Compact size="middle" style={{ width: 400 }}>
            <Input
              placeholder="搜索供应商名称、公司、联系人或ID"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch(searchText)} />
          </Space.Compact>
          <Select
            placeholder="关系级别"
            allowClear
            style={{ width: 150 }}
            onChange={handleLevelChange}
          >
            <Option value="战略合作">战略合作</Option>
            <Option value="优质合作">优质合作</Option>
            <Option value="备选合作">备选合作</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddSupplierModal}>
            添加供应商
          </Button>
        </Space>
      </Card>
      
      {/* 供应商表格 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      
      {/* 添加供应商Modal */}
      <Modal
        title="添加供应商"
        open={isModalVisible}
        onOk={handleAddSupplier}
        onCancel={handleModalCancel}
        okText="确认添加"
        cancelText="取消"
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            relationshipLevel: '备选合作',
            productCount: '0',
            cooperationTimes: '0',
            totalAmount: '0'
          }}
        >
          <Space wrap direction="vertical" style={{ width: '100%' }}>
            <Space wrap style={{ width: '100%' }}>
              <Form.Item
                name="name"
                label="供应商名称"
                rules={[{ required: true, message: '请输入供应商名称' }]}
                style={{ width: '48%' }}
              >
                <Input placeholder="请输入供应商名称" />
              </Form.Item>
              <Form.Item
                name="company"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
                style={{ width: '48%' }}
              >
                <Input placeholder="请输入公司名称" />
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
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
                style={{ width: '31%' }}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
              <Form.Item
                name="relationshipLevel"
                label="关系级别"
                rules={[{ required: true, message: '请选择关系级别' }]}
                style={{ width: '31%' }}
              >
                <Select placeholder="请选择关系级别">
                  <Option value="战略合作">战略合作</Option>
                  <Option value="优质合作">优质合作</Option>
                  <Option value="备选合作">备选合作</Option>
                </Select>
              </Form.Item>
            </Space>
            
            <Space wrap style={{ width: '100%' }}>
              <Form.Item
                name="productCount"
                label="产品数量"
                rules={[{ required: true, message: '请输入产品数量' }]}
                style={{ width: '31%' }}
              >
                <Input placeholder="请输入产品数量" />
              </Form.Item>
              <Form.Item
                name="cooperationTimes"
                label="合作次数"
                rules={[{ required: true, message: '请输入合作次数' }]}
                style={{ width: '31%' }}
              >
                <Input placeholder="请输入合作次数" />
              </Form.Item>
              <Form.Item
                name="totalAmount"
                label="总金额"
                rules={[{ required: true, message: '请输入总金额' }]}
                style={{ width: '31%' }}
              >
                <Input placeholder="请输入总金额" prefix="¥" />
              </Form.Item>
            </Space>
            
            <Form.Item
              name="address"
              label="公司地址"
              rules={[{ required: true, message: '请输入公司地址' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入公司地址" />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}

export default SupplierManagement