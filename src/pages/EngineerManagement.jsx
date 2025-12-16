import React, { useState } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tag, Modal, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 模拟数据
const mockEngineers = [
  {
    id: 'ENG001',
    name: '张开发',
    gender: '男',
    age: 30,
    phone: '13700137001',
    email: 'zhangkaifa@example.com',
    education: '本科',
    experience: '7年',
    specialty: '前端开发',
    techStack: ['React', 'Vue', 'JavaScript', 'TypeScript'],
    level: '高级',
    status: '在职',
    projectCount: 32,
    joinDate: '2017-12-01'
  },
  {
    id: 'ENG002',
    name: '李后端',
    gender: '男',
    age: 35,
    phone: '13700137002',
    email: 'lihoutai@example.com',
    education: '硕士',
    experience: '10年',
    specialty: '后端开发',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    level: '资深',
    status: '在职',
    projectCount: 45,
    joinDate: '2015-08-15'
  },
  {
    id: 'ENG003',
    name: '王全栈',
    gender: '男',
    age: 28,
    phone: '13700137003',
    email: 'wangquanzhan@example.com',
    education: '本科',
    experience: '5年',
    specialty: '全栈开发',
    techStack: ['Node.js', 'React', 'MongoDB', 'Express'],
    level: '中级',
    status: '在职',
    projectCount: 20,
    joinDate: '2019-05-20'
  },
  {
    id: 'ENG004',
    name: '陈测试',
    gender: '女',
    age: 27,
    phone: '13700137004',
    email: 'chenceshi@example.com',
    education: '本科',
    experience: '4年',
    specialty: '测试工程师',
    techStack: ['Selenium', 'JMeter', 'Postman', 'Python'],
    level: '中级',
    status: '在职',
    projectCount: 18,
    joinDate: '2020-03-10'
  },
  {
    id: 'ENG005',
    name: '赵运维',
    gender: '男',
    age: 32,
    phone: '13700137005',
    email: 'zhaoyunwei@example.com',
    education: '大专',
    experience: '8年',
    specialty: '运维工程师',
    techStack: ['Docker', 'Kubernetes', 'Linux', 'AWS'],
    level: '高级',
    status: '离职',
    projectCount: 25,
    joinDate: '2016-11-25'
  }
]

const EngineerManagement = () => {
  const [filteredData, setFilteredData] = useState(mockEngineers)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedEngineer, setSelectedEngineer] = useState(null)
  const [engineers, setEngineers] = useState(mockEngineers)
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
    let data = [...engineers]
    
    if (search) {
      data = data.filter(engineer => 
        engineer.id.includes(search) || 
        engineer.name.includes(search) ||
        engineer.phone.includes(search) ||
        engineer.email.includes(search)
      )
    }
    
    if (status) {
      data = data.filter(engineer => engineer.status === status)
    }
    
    if (specialty) {
      data = data.filter(engineer => engineer.specialty === specialty)
    }
    
    setFilteredData(data)
  }
  
  // 显示新增工程师Modal
  const showCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }
  
  // 显示编辑工程师Modal
  const showEditModal = (record) => {
    setSelectedEngineer(record)
    form.setFieldsValue(record)
    setIsEditModalVisible(true)
  }
  

  
  // 关闭Modal
  const handleModalCancel = () => {
    form.resetFields()
    setIsCreateModalVisible(false)
    setIsEditModalVisible(false)
    setSelectedEngineer(null)
  }
  
  // 新增工程师提交处理
  const handleCreateEngineer = async () => {
    try {
      const values = await form.validateFields()
      const newEngineer = {
        ...values,
        id: `ENG${Date.now()}`,
        projectCount: 0
      }
      
      const updatedEngineers = [newEngineer, ...engineers]
      setEngineers(updatedEngineers)
      filterData(searchText, selectedStatus, selectedSpecialty)
      setIsCreateModalVisible(false)
      form.resetFields()
      message.success('创建成功')
    } catch (error) {
      console.error('验证失败:', error)
    }
  }
  
  // 编辑工程师提交处理
  const handleEditEngineer = async () => {
    try {
      const values = await form.validateFields()
      const updatedEngineers = engineers.map(engineer => 
        engineer.id === selectedEngineer.id ? values : engineer
      )
      setEngineers(updatedEngineers)
      filterData(searchText, selectedStatus, selectedSpecialty)
      setIsEditModalVisible(false)
      setSelectedEngineer(null)
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
      title: '技术级别',
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
      title: '技术栈',
      key: 'techStack',
      render: (_, record) => (
        <Space wrap>
          {record.techStack.map(tech => (
            <Tag key={tech}>{tech}</Tag>
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
      <Title level={2}>工程师管理</Title>
      
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
            <Option value="前端开发">前端开发</Option>
            <Option value="后端开发">后端开发</Option>
            <Option value="全栈开发">全栈开发</Option>
            <Option value="测试工程师">测试工程师</Option>
            <Option value="运维工程师">运维工程师</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={showCreateModal}
          >
            新增工程师
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
      
      {/* 新增工程师Modal */}
      <Modal
        title="新增工程师"
        open={isCreateModalVisible}
        onOk={handleCreateEngineer}
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
              <Option value="前端开发">前端开发</Option>
              <Option value="后端开发">后端开发</Option>
              <Option value="全栈开发">全栈开发</Option>
              <Option value="测试工程师">测试工程师</Option>
              <Option value="运维工程师">运维工程师</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="技术级别" 
            name="level" 
            rules={[{ required: true, message: '请选择技术级别' }]}
          >
            <Select>
              <Option value="初级">初级</Option>
              <Option value="中级">中级</Option>
              <Option value="高级">高级</Option>
              <Option value="资深">资深</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="技术栈" 
            name="techStack" 
            rules={[{ required: true, message: '请至少选择一项技术栈' }]}
          >
            <Select mode="multiple" placeholder="请选择技术栈">
              <Option value="React">React</Option>
              <Option value="Vue">Vue</Option>
              <Option value="JavaScript">JavaScript</Option>
              <Option value="TypeScript">TypeScript</Option>
              <Option value="Java">Java</Option>
              <Option value="Spring Boot">Spring Boot</Option>
              <Option value="Node.js">Node.js</Option>
              <Option value="Python">Python</Option>
              <Option value="MySQL">MySQL</Option>
              <Option value="MongoDB">MongoDB</Option>
              <Option value="Docker">Docker</Option>
              <Option value="Kubernetes">Kubernetes</Option>
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
      
      {/* 编辑工程师Modal */}
      <Modal
        title="编辑工程师"
        open={isEditModalVisible}
        onOk={handleEditEngineer}
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
              <Option value="前端开发">前端开发</Option>
              <Option value="后端开发">后端开发</Option>
              <Option value="全栈开发">全栈开发</Option>
              <Option value="测试工程师">测试工程师</Option>
              <Option value="运维工程师">运维工程师</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="技术级别" 
            name="level" 
            rules={[{ required: true, message: '请选择技术级别' }]}
          >
            <Select>
              <Option value="初级">初级</Option>
              <Option value="中级">中级</Option>
              <Option value="高级">高级</Option>
              <Option value="资深">资深</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="技术栈" 
            name="techStack" 
            rules={[{ required: true, message: '请至少选择一项技术栈' }]}
          >
            <Select mode="multiple" placeholder="请选择技术栈">
              <Option value="React">React</Option>
              <Option value="Vue">Vue</Option>
              <Option value="JavaScript">JavaScript</Option>
              <Option value="TypeScript">TypeScript</Option>
              <Option value="Java">Java</Option>
              <Option value="Spring Boot">Spring Boot</Option>
              <Option value="Node.js">Node.js</Option>
              <Option value="Python">Python</Option>
              <Option value="MySQL">MySQL</Option>
              <Option value="MongoDB">MongoDB</Option>
              <Option value="Docker">Docker</Option>
              <Option value="Kubernetes">Kubernetes</Option>
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

export default EngineerManagement