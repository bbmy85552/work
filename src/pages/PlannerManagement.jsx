import React, { useState } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tag, Modal, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 模拟数据
const mockPlanners = [
  {
    id: 'PLAN001',
    name: '张三',
    gender: '男',
    age: 32,
    phone: '13800138001',
    email: 'zhangsan@example.com',
    education: '本科',
    experience: '8年',
    specialty: '品牌策划',
    status: '在职',
    projectCount: 35,
    joinDate: '2018-05-15'
  },
  {
    id: 'PLAN002',
    name: '李四',
    gender: '女',
    age: 28,
    phone: '13800138002',
    email: 'lisi@example.com',
    education: '硕士',
    experience: '5年',
    specialty: '活动策划',
    status: '在职',
    projectCount: 22,
    joinDate: '2020-03-10'
  },
  {
    id: 'PLAN003',
    name: '王五',
    gender: '男',
    age: 35,
    phone: '13800138003',
    email: 'wangwu@example.com',
    education: '大专',
    experience: '10年',
    specialty: '营销策划',
    status: '在职',
    projectCount: 48,
    joinDate: '2015-08-20'
  },
  {
    id: 'PLAN004',
    name: '赵六',
    gender: '女',
    age: 29,
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    education: '本科',
    experience: '6年',
    specialty: '内容策划',
    status: '请假',
    projectCount: 18,
    joinDate: '2019-11-05'
  },
  {
    id: 'PLAN005',
    name: '孙七',
    gender: '男',
    age: 33,
    phone: '13800138005',
    email: 'sunqi@example.com',
    education: '本科',
    experience: '7年',
    specialty: '品牌策划',
    status: '在职',
    projectCount: 31,
    joinDate: '2017-04-18'
  }
]

const PlannerManagement = () => {
  const [filteredData, setFilteredData] = useState(mockPlanners)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [selectedPlanner, setSelectedPlanner] = useState(null)
  const [planners, setPlanners] = useState(mockPlanners)
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
    let data = [...planners]
    
    if (search) {
      data = data.filter(planner => 
        planner.id.includes(search) || 
        planner.name.includes(search) ||
        planner.phone.includes(search) ||
        planner.email.includes(search)
      )
    }
    
    if (status) {
      data = data.filter(planner => planner.status === status)
    }
    
    if (specialty) {
      data = data.filter(planner => planner.specialty === specialty)
    }
    
    setFilteredData(data)
  }
  
  // 显示新建策划师Modal
  const showCreateModal = () => {
    form.resetFields()
    setIsCreateModalVisible(true)
  }
  
  // 显示编辑策划师Modal
  const showEditModal = (record) => {
    setSelectedPlanner(record)
    form.setFieldsValue(record)
    setIsEditModalVisible(true)
  }
  
  
  
  // 关闭Modal
  const handleModalCancel = () => {
    form.resetFields()
    setIsCreateModalVisible(false)
    setIsEditModalVisible(false)
    setSelectedPlanner(null)
  }
  
  // 新建策划师提交处理
  const handleCreatePlanner = async () => {
    try {
      const values = await form.validateFields()
      const newPlanner = {
        ...values,
        id: `PLAN${Date.now()}`,
        projectCount: 0
      }
      
      const updatedPlanners = [newPlanner, ...planners]
      setPlanners(updatedPlanners)
      filterData(searchText, selectedStatus, selectedSpecialty)
      setIsCreateModalVisible(false)
      form.resetFields()
      message.success('创建成功')
    } catch (error) {
      console.error('验证失败:', error)
    }
  }
  
  // 编辑策划师提交处理
  const handleEditPlanner = async () => {
    try {
      const values = await form.validateFields()
      const updatedPlanners = planners.map(planner => 
        planner.id === selectedPlanner.id ? values : planner
      )
      setPlanners(updatedPlanners)
      filterData(searchText, selectedStatus, selectedSpecialty)
      setIsEditModalVisible(false)
      setSelectedPlanner(null)
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
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
    },
    {
      title: '工作经验',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: '专业方向',
      dataIndex: 'specialty',
      key: 'specialty',
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
      <Title level={2}>策划师管理</Title>
      
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
            <Option value="品牌策划">品牌策划</Option>
            <Option value="活动策划">活动策划</Option>
            <Option value="营销策划">营销策划</Option>
            <Option value="内容策划">内容策划</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={showCreateModal}
          >
            新增策划师
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
      
      {/* 新建策划师Modal */}
      <Modal
        title="新增策划师"
        open={isCreateModalVisible}
        onOk={handleCreatePlanner}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
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
              <Option value="品牌策划">品牌策划</Option>
              <Option value="活动策划">活动策划</Option>
              <Option value="营销策划">营销策划</Option>
              <Option value="内容策划">内容策划</Option>
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
      
      {/* 编辑策划师Modal */}
      <Modal
        title="编辑策划师"
        open={isEditModalVisible}
        onOk={handleEditPlanner}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
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
              <Option value="品牌策划">品牌策划</Option>
              <Option value="活动策划">活动策划</Option>
              <Option value="营销策划">营销策划</Option>
              <Option value="内容策划">内容策划</Option>
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

export default PlannerManagement