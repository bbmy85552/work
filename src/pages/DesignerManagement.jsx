import React, { useState } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tag, Modal, Form, message, Checkbox } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 模拟数据
const mockDesigners = [
  {
    id: 'DES001',
    name: '陈晨',
    gender: '女',
    age: 28,
    phone: '13900139001',
    email: 'chenchen@example.com',
    education: '本科',
    experience: '6年',
    specialty: 'UI设计',
    skills: ['Photoshop', 'Sketch', 'Figma'],
    status: '在职',
    projectCount: 28,
    joinDate: '2019-03-12'
  },
  {
    id: 'DES002',
    name: '林设计',
    gender: '男',
    age: 31,
    phone: '13900139002',
    email: 'linsheji@example.com',
    education: '硕士',
    experience: '9年',
    specialty: 'UX设计',
    skills: ['Figma', 'Adobe XD', 'Axure'],
    status: '在职',
    projectCount: 42,
    joinDate: '2016-08-23'
  },
  {
    id: 'DES003',
    name: '王丽',
    gender: '女',
    age: 26,
    phone: '13900139003',
    email: 'wangli@example.com',
    education: '本科',
    experience: '4年',
    specialty: '视觉设计',
    skills: ['Photoshop', 'Illustrator', 'After Effects'],
    status: '在职',
    projectCount: 18,
    joinDate: '2021-04-30'
  },
  {
    id: 'DES004',
    name: '赵明',
    gender: '男',
    age: 33,
    phone: '13900139004',
    email: 'zhaoming@example.com',
    education: '大专',
    experience: '10年',
    specialty: '动效设计',
    skills: ['AE', 'Principle', 'ProtoPie'],
    status: '离职',
    projectCount: 35,
    joinDate: '2015-11-18'
  },
  {
    id: 'DES005',
    name: '孙艺',
    gender: '女',
    age: 29,
    phone: '13900139005',
    email: 'sunyi@example.com',
    education: '本科',
    experience: '7年',
    specialty: 'UI设计',
    skills: ['Figma', 'Sketch', 'Webflow'],
    status: '请假',
    projectCount: 24,
    joinDate: '2018-07-05'
  }
]

const DesignerManagement = () => {
  const [filteredData, setFilteredData] = useState(mockDesigners)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedDesigner, setSelectedDesigner] = useState(null)
  const [designers, setDesigners] = useState(mockDesigners)
  const [form] = Form.useForm()

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedStatus, selectedSpecialty)
  }

  // 状态筛选
  const handleStatusChange = (value) => {
    setSelectedStatus(value)
    filterData(searchText, value, selectedSpecialty)
  }

  // 专业筛选
  const handleSpecialtyChange = (value) => {
    setSelectedSpecialty(value)
    filterData(searchText, selectedStatus, value)
  }

  // 综合筛选数据
  const filterData = (search, status, specialty) => {
    let data = [...designers]
    
    if (search) {
      data = data.filter(designer => 
        designer.id.includes(search) || 
        designer.name.includes(search) ||
        designer.phone.includes(search) ||
        designer.email.includes(search)
      )
    }
    
    if (status) {
      data = data.filter(designer => designer.status === status)
    }
    
    if (specialty) {
      data = data.filter(designer => designer.specialty === specialty)
    }
    
    setFilteredData(data)
  }
  
  // 显示新建设计师Modal
  const showCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }
  
  // 显示编辑设计师Modal
  const showEditModal = (record) => {
    setSelectedDesigner(record)
    form.setFieldsValue(record)
    setIsEditModalVisible(true)
  }
  

  
  // 关闭Modal
  const handleModalCancel = () => {
    form.resetFields()
    setIsCreateModalVisible(false)
    setIsEditModalVisible(false)
    setSelectedDesigner(null)
  }
  
  // 新建设计师提交处理
  const handleCreateDesigner = async () => {
    try {
      const values = await form.validateFields()
      const newDesigner = {
        ...values,
        id: `DES${Date.now()}`,
        projectCount: 0
      }
      
      const updatedDesigners = [newDesigner, ...designers]
      setDesigners(updatedDesigners)
      filterData(searchText, selectedStatus, selectedSpecialty)
      setIsCreateModalVisible(false)
      form.resetFields()
      message.success('创建成功')
    } catch (error) {
      console.error('验证失败:', error)
    }
  }
  
  // 编辑设计师提交处理
  const handleEditDesigner = async () => {
    try {
      const values = await form.validateFields()
      const updatedDesigners = designers.map(designer => 
        designer.id === selectedDesigner.id ? values : designer
      )
      setDesigners(updatedDesigners)
      filterData(searchText, selectedStatus, selectedSpecialty)
      setIsEditModalVisible(false)
      setSelectedDesigner(null)
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
      title: '专业方向',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: '擅长技能',
      key: 'skills',
      render: (_, record) => (
        <Space>
          {record.skills.map(skill => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </Space>
      ),
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
      title: '项目数量',
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
      <Title level={2}>设计师管理</Title>
      
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
          <Select
            placeholder="选择专业方向"
            allowClear
            style={{ width: 150 }}
            onChange={handleSpecialtyChange}
          >
            <Option value="UI设计">UI设计</Option>
            <Option value="UX设计">UX设计</Option>
            <Option value="视觉设计">视觉设计</Option>
            <Option value="动效设计">动效设计</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={showCreateModal}
          >
            新增设计师
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
      
      {/* 新建设计师Modal */}
      <Modal
        title="新增设计师"
        open={isCreateModalVisible}
        onOk={handleCreateDesigner}
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
            label="工作经验" 
            name="experience" 
            rules={[{ required: true, message: '请输入工作经验' }]}
          >
            <Input placeholder="例如：5年" />
          </Form.Item>
          <Form.Item 
            label="专业方向" 
            name="specialty" 
            rules={[{ required: true, message: '请选择专业方向' }]}
          >
            <Select>
              <Option value="UI设计">UI设计</Option>
              <Option value="UX设计">UX设计</Option>
              <Option value="视觉设计">视觉设计</Option>
              <Option value="动效设计">动效设计</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="擅长工具" 
            name="skills" 
            rules={[{ required: true, message: '请至少选择一项技能' }]}
          >
            <Select mode="multiple" placeholder="请选择擅长工具">
              <Option value="Photoshop">Photoshop</Option>
              <Option value="Sketch">Sketch</Option>
              <Option value="Figma">Figma</Option>
              <Option value="Adobe XD">Adobe XD</Option>
              <Option value="Illustrator">Illustrator</Option>
              <Option value="After Effects">After Effects</Option>
              <Option value="Principle">Principle</Option>
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
      
      {/* 编辑设计师Modal */}
      <Modal
        title="编辑设计师"
        open={isEditModalVisible}
        onOk={handleEditDesigner}
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
            label="工作经验" 
            name="experience" 
            rules={[{ required: true, message: '请输入工作经验' }]}
          >
            <Input placeholder="例如：5年" />
          </Form.Item>
          <Form.Item 
            label="专业方向" 
            name="specialty" 
            rules={[{ required: true, message: '请选择专业方向' }]}
          >
            <Select>
              <Option value="UI设计">UI设计</Option>
              <Option value="UX设计">UX设计</Option>
              <Option value="视觉设计">视觉设计</Option>
              <Option value="动效设计">动效设计</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="擅长工具" 
            name="skills" 
            rules={[{ required: true, message: '请至少选择一项技能' }]}
          >
            <Select mode="multiple" placeholder="请选择擅长工具">
              <Option value="Photoshop">Photoshop</Option>
              <Option value="Sketch">Sketch</Option>
              <Option value="Figma">Figma</Option>
              <Option value="Adobe XD">Adobe XD</Option>
              <Option value="Illustrator">Illustrator</Option>
              <Option value="After Effects">After Effects</Option>
              <Option value="Principle">Principle</Option>
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

export default DesignerManagement