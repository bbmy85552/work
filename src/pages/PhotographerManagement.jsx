import React, { useState } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tag, Modal, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 模拟数据
const mockPhotographers = [
  {
    id: 'PHOTO001',
    name: '刘摄影',
    gender: '男',
    age: 32,
    phone: '13800138001',
    email: 'liusheying@example.com',
    education: '大专',
    experience: '8年',
    photographyStyle: ['人像', '时尚', '广告'],
    equipment: ['Canon R5', 'Nikon Z7', 'DJI Mavic 3'],
    level: '高级',
    status: '在职',
    projectCount: 56,
    joinDate: '2016-03-15'
  },
  {
    id: 'PHOTO002',
    name: '王纪实',
    gender: '男',
    age: 28,
    phone: '13800138002',
    email: 'wangjishi@example.com',
    education: '本科',
    experience: '5年',
    photographyStyle: ['纪实', '风光', '旅行'],
    equipment: ['Sony A7R IV', 'Fujifilm X-T4'],
    level: '中级',
    status: '在职',
    projectCount: 32,
    joinDate: '2019-06-20'
  },
  {
    id: 'PHOTO003',
    name: '陈婚礼',
    gender: '女',
    age: 30,
    phone: '13800138003',
    email: 'chenhunli@example.com',
    education: '本科',
    experience: '6年',
    photographyStyle: ['婚礼', '人像', '婚纱'],
    equipment: ['Canon 5D Mark IV', 'Sony A7 III'],
    level: '高级',
    status: '在职',
    projectCount: 48,
    joinDate: '2018-09-10'
  },
  {
    id: 'PHOTO004',
    name: '张产品',
    gender: '男',
    age: 35,
    phone: '13800138004',
    email: 'zhangchanpin@example.com',
    education: '本科',
    experience: '10年',
    photographyStyle: ['产品', '商业', '广告'],
    equipment: ['Phase One XF', 'Canon EOS R3'],
    level: '资深',
    status: '在职',
    projectCount: 76,
    joinDate: '2014-01-05'
  },
  {
    id: 'PHOTO005',
    name: '李风景',
    gender: '男',
    age: 40,
    phone: '13800138005',
    email: 'lifengjing@example.com',
    education: '大专',
    experience: '15年',
    photographyStyle: ['风光', '自然', '野生动物'],
    equipment: ['Nikon D850', 'DJI Inspire 2'],
    level: '资深',
    status: '离职',
    projectCount: 92,
    joinDate: '2010-07-22'
  }
]

const PhotographerManagement = () => {
  const [filteredData, setFilteredData] = useState(mockPhotographers)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [photographers, setPhotographers] = useState(mockPhotographers)
  const [form] = Form.useForm()

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedStatus)
  }

  // 状态筛选
  const handleStatusChange = (value) => {
    setSelectedStatus(value)
    filterData(searchText, value)
  }

  // 综合筛选数据
  const filterData = (search, status) => {
    let data = [...photographers]
    
    if (search) {
      data = data.filter(photographer => 
        photographer.id.includes(search) || 
        photographer.name.includes(search) ||
        photographer.phone.includes(search) ||
        photographer.email.includes(search)
      )
    }
    
    if (status) {
      data = data.filter(photographer => photographer.status === status)
    }
    
    setFilteredData(data)
  }
  
  // 显示新增摄影师Modal
  const showCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }
  
  // 显示编辑摄影师Modal
  const showEditModal = (record) => {
    setSelectedPhotographer(record)
    form.setFieldsValue(record)
    setIsEditModalVisible(true)
  }
  

  
  // 关闭Modal
  const handleModalCancel = () => {
    form.resetFields()
    setIsCreateModalVisible(false)
    setIsEditModalVisible(false)
    setSelectedPhotographer(null)
  }
  
  // 新增摄影师提交处理
  const handleCreatePhotographer = async () => {
    try {
      const values = await form.validateFields()
      const newPhotographer = {
        ...values,
        id: `PHOTO${Date.now()}`,
        projectCount: 0
      }
      
      const updatedPhotographers = [newPhotographer, ...photographers]
      setPhotographers(updatedPhotographers)
      filterData(searchText, selectedStatus)
      setIsCreateModalVisible(false)
      form.resetFields()
      message.success('创建成功')
    } catch (error) {
      console.error('验证失败:', error)
    }
  }
  
  // 编辑摄影师提交处理
  const handleEditPhotographer = async () => {
    try {
      const values = await form.validateFields()
      const updatedPhotographers = photographers.map(photographer => 
        photographer.id === selectedPhotographer.id ? values : photographer
      )
      setPhotographers(updatedPhotographers)
      filterData(searchText, selectedStatus)
      setIsEditModalVisible(false)
      setSelectedPhotographer(null)
      form.resetFields()
      message.success('更新成功')
    } catch (error) {
      console.error('验证失败:', error)
    }
  }

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '摄影风格',
      key: 'photographyStyle',
      render: (_, record) => (
        <Space wrap>
          {record.photographyStyle.map(style => (
            <Tag key={style}>{style}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '擅长设备',
      key: 'equipment',
      render: (_, record) => (
        <Space wrap>
          {record.equipment.map(eq => (
            <Tag key={eq} color="blue">{eq}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        let color = ''
        switch (level) {
          case '初级':
            color = 'blue'
            break
          case '中级':
            color = 'green'
            break
          case '高级':
            color = 'orange'
            break
          case '资深':
            color = 'red'
            break
          default:
            color = 'blue'
        }
        return <Tag color={color}>{level}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = ''
        switch (status) {
          case '在职':
            color = 'green'
            break
          case '请假':
            color = 'orange'
            break
          case '离职':
            color = 'gray'
            break
          default:
            color = 'blue'
        }
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: '拍摄项目数',
      dataIndex: 'projectCount',
      key: 'projectCount',
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {      title: '操作',      key: 'action',      render: (_, record) => (        <Space size="middle">          <Button            type="primary"            icon={<EditOutlined />}            onClick={() => showEditModal(record)}          />        </Space>      ),    },
  ]

  return (
    <div>
      <Title level={2}>摄影师管理</Title>
      
      {/* 搜索筛选区域 */}
      <Card className="mb-4">
        <Space wrap>
          <Space.Compact size="large">
            <Input
              placeholder="搜索ID/姓名/电话/邮箱"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch(searchText)} />
          </Space.Compact>
          <Select
            placeholder="选择状态"
            allowClear
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="在职">在职</Option>
            <Option value="请假">请假</Option>
            <Option value="离职">离职</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={showCreateModal}
          >
            新增摄影师
          </Button>
        </Space>
      </Card>
      
      {/* 表格区域 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />
      
      {/* 新增摄影师Modal */}
      <Modal
        title="新增摄影师"
        open={isCreateModalVisible}
        onOk={handleCreatePhotographer}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="姓名" 
            name="name" 
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="性别" 
            name="gender" 
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="年龄" 
            name="age" 
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item 
            label="电话" 
            name="phone" 
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="邮箱" 
            name="email" 
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="学历" 
            name="education" 
            rules={[{ required: true, message: '请选择学历' }]}
          >
            <Select>
              <Option value="大专">大专</Option>
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="拍摄经验" 
            name="experience" 
            rules={[{ required: true, message: '请输入拍摄经验' }]}
          >
            <Input placeholder="例如：5年" />
          </Form.Item>
          <Form.Item 
            label="摄影风格" 
            name="photographyStyle" 
            rules={[{ required: true, message: '请至少选择一种摄影风格' }]}
          >
            <Select mode="multiple" placeholder="请选择摄影风格">
              <Option value="人像">人像</Option>
              <Option value="风光">风光</Option>
              <Option value="纪实">纪实</Option>
              <Option value="商业">商业</Option>
              <Option value="广告">广告</Option>
              <Option value="产品">产品</Option>
              <Option value="婚礼">婚礼</Option>
              <Option value="婚纱">婚纱</Option>
              <Option value="时尚">时尚</Option>
              <Option value="旅行">旅行</Option>
              <Option value="自然">自然</Option>
              <Option value="野生动物">野生动物</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="擅长设备" 
            name="equipment" 
            rules={[{ required: true, message: '请至少选择一种设备' }]}
          >
            <Select mode="multiple" placeholder="请选择擅长设备">
              <Option value="Canon 5D Mark IV">Canon 5D Mark IV</Option>
              <Option value="Canon R5">Canon R5</Option>
              <Option value="Canon EOS R3">Canon EOS R3</Option>
              <Option value="Nikon D850">Nikon D850</Option>
              <Option value="Nikon Z7">Nikon Z7</Option>
              <Option value="Sony A7 III">Sony A7 III</Option>
              <Option value="Sony A7R IV">Sony A7R IV</Option>
              <Option value="Fujifilm X-T4">Fujifilm X-T4</Option>
              <Option value="Phase One XF">Phase One XF</Option>
              <Option value="DJI Mavic 3">DJI Mavic 3</Option>
              <Option value="DJI Inspire 2">DJI Inspire 2</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="级别" 
            name="level" 
            rules={[{ required: true, message: '请选择级别' }]}
          >
            <Select>
              <Option value="初级">初级</Option>
              <Option value="中级">中级</Option>
              <Option value="高级">高级</Option>
              <Option value="资深">资深</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="状态" 
            name="status" 
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="在职">在职</Option>
              <Option value="请假">请假</Option>
              <Option value="离职">离职</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="入职日期" 
            name="joinDate" 
            rules={[{ required: true, message: '请输入入职日期' }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 编辑摄影师Modal */}
      <Modal
        title="编辑摄影师"
        open={isEditModalVisible}
        onOk={handleEditPhotographer}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="姓名" 
            name="name" 
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="性别" 
            name="gender" 
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Select>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="年龄" 
            name="age" 
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item 
            label="电话" 
            name="phone" 
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="邮箱" 
            name="email" 
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="学历" 
            name="education" 
            rules={[{ required: true, message: '请选择学历' }]}
          >
            <Select>
              <Option value="大专">大专</Option>
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="拍摄经验" 
            name="experience" 
            rules={[{ required: true, message: '请输入拍摄经验' }]}
          >
            <Input placeholder="例如：5年" />
          </Form.Item>
          <Form.Item 
            label="摄影风格" 
            name="photographyStyle" 
            rules={[{ required: true, message: '请至少选择一种摄影风格' }]}
          >
            <Select mode="multiple" placeholder="请选择摄影风格">
              <Option value="人像">人像</Option>
              <Option value="风光">风光</Option>
              <Option value="纪实">纪实</Option>
              <Option value="商业">商业</Option>
              <Option value="广告">广告</Option>
              <Option value="产品">产品</Option>
              <Option value="婚礼">婚礼</Option>
              <Option value="婚纱">婚纱</Option>
              <Option value="时尚">时尚</Option>
              <Option value="旅行">旅行</Option>
              <Option value="自然">自然</Option>
              <Option value="野生动物">野生动物</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="擅长设备" 
            name="equipment" 
            rules={[{ required: true, message: '请至少选择一种设备' }]}
          >
            <Select mode="multiple" placeholder="请选择擅长设备">
              <Option value="Canon 5D Mark IV">Canon 5D Mark IV</Option>
              <Option value="Canon R5">Canon R5</Option>
              <Option value="Canon EOS R3">Canon EOS R3</Option>
              <Option value="Nikon D850">Nikon D850</Option>
              <Option value="Nikon Z7">Nikon Z7</Option>
              <Option value="Sony A7 III">Sony A7 III</Option>
              <Option value="Sony A7R IV">Sony A7R IV</Option>
              <Option value="Fujifilm X-T4">Fujifilm X-T4</Option>
              <Option value="Phase One XF">Phase One XF</Option>
              <Option value="DJI Mavic 3">DJI Mavic 3</Option>
              <Option value="DJI Inspire 2">DJI Inspire 2</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="级别" 
            name="level" 
            rules={[{ required: true, message: '请选择级别' }]}
          >
            <Select>
              <Option value="初级">初级</Option>
              <Option value="中级">中级</Option>
              <Option value="高级">高级</Option>
              <Option value="资深">资深</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="状态" 
            name="status" 
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="在职">在职</Option>
              <Option value="请假">请假</Option>
              <Option value="离职">离职</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="入职日期" 
            name="joinDate" 
            rules={[{ required: true, message: '请输入入职日期' }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PhotographerManagement