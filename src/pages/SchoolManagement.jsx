import React, { useState, useEffect } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Tabs, Modal, Form, Checkbox } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import schoolData from '../mock/schoolData'

const { Title } = Typography
const { Search } = Input
const { Option } = Select
// Tabs组件不再需要解构TabPane

// 学校类型选项
const schoolTypes = [
  { label: '幼儿园', value: '幼儿园' },
  { label: '小学', value: '小学' },
  { label: '初中', value: '初中' },
  { label: '高中', value: '高中' },
  { label: '职校', value: '职校' },
  { label: '大学', value: '大学' }
]

// 合作项目类型选项
const projectTypes = [
  { label: '硬件设备', value: '硬件设备' },
  { label: '软件系统', value: '软件系统' },
  { label: '解决方案', value: '解决方案' },
  { label: '定制方案', value: '定制方案' }
]

// 从mock数据中获取学校数据
const { allSchools, cooperationSchools } = schoolData

const SchoolManagement = () => {
  const [activeTab, setActiveTab] = useState('1') // 1: 全部学校, 2: 合作学校
  const [searchText, setSearchText] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedSchoolType, setSelectedSchoolType] = useState('')
  const [selectedProjectType, setSelectedProjectType] = useState('')
  const [filteredAllSchools, setFilteredAllSchools] = useState([])
  const [filteredCooperationSchools, setFilteredCooperationSchools] = useState([])

  // 处理数据格式，统一字段名
  const processedAllSchools = allSchools.map(school => ({
    id: school.id,
    name: school.schoolName,
    contact: school.contactPerson,
    phone: school.contactPhone,
    salesman: school.salesman,
    region: school.region,
    customerType: school.customerType,
    dockingStatus: school.status,
    schoolType: school.schoolType || getRandomSchoolType(), // 默认为随机学校类型
    isCooperation: school.isCooperation !== undefined ? school.isCooperation : false
  }))

  // 处理合作学校数据
  const processedCooperationSchools = cooperationSchools.map(school => ({
    id: school.id,
    name: school.schoolName,
    contact: school.contactPerson,
    phone: school.contactPhone,
    salesman: school.salesman,
    region: school.region,
    customerType: school.customerType,
    dockingStatus: school.status,
    schoolType: school.schoolType || getRandomSchoolType(), // 默认为随机学校类型
    cooperationProjects: school.cooperationProjects || getRandomProjects(), // 默认为随机合作项目
    cooperationAmount: school.cooperationAmount || 0
  }))

  // 随机获取合作项目
  function getRandomProjects() {
    const allProjects = [
      '硬件设备', 
      '软件系统', 
      '解决方案', 
      '定制方案',
      '校史文化墙科',
      '校园科创文化墙',
      '党建文化墙',
      '美育文化墙'
    ]
    const projectCount = Math.floor(Math.random() * 3) + 1 // 随机1-3个项目
    const shuffled = [...allProjects].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, projectCount)
  }

  // 随机获取学校类型
  function getRandomSchoolType() {
    const types = ['幼儿园', '小学', '初中', '高中', '职校', '大学']
    return types[Math.floor(Math.random() * types.length)]
  }

  // 初始化过滤后的数据
  React.useEffect(() => {
    // 获取所有区域选项
    const allRegions = [...new Set([...allSchools, ...cooperationSchools].map(school => school.region))]
    setRegions(allRegions)
    
    // 初始化数据
    setFilteredAllSchools(processedAllSchools)
    setFilteredCooperationSchools(processedCooperationSchools)
  }, [])

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedRegion)
  }

  // 区域筛选
  const handleRegionChange = (value) => {
    setSelectedRegion(value)
    filterData(searchText, value, selectedSchoolType)
  }

  // 学校类型筛选
  const handleSchoolTypeChange = (value) => {
    setSelectedSchoolType(value)
    filterData(searchText, selectedRegion, value, selectedProjectType)
  }

  // 合作项目类型筛选
  const handleProjectTypeChange = (value) => {
    setSelectedProjectType(value)
    filterData(searchText, selectedRegion, selectedSchoolType, value)
  }

  // 综合筛选数据
  const filterData = (search, region, schoolType, projectType) => {
    // 筛选全部学校
    let allSchoolsData = [...processedAllSchools]
    
    if (search) {
      allSchoolsData = allSchoolsData.filter(school => 
        school.name.includes(search) || 
        school.contact.includes(search) ||
        school.salesman.includes(search) ||
        school.id.includes(search)
      )
    }
    
    if (region) {
      allSchoolsData = allSchoolsData.filter(school => school.region === region)
    }
    
    if (schoolType) {
      allSchoolsData = allSchoolsData.filter(school => school.schoolType === schoolType)
    }
    
    setFilteredAllSchools(allSchoolsData)

    // 筛选合作学校
    let cooperationSchoolsData = [...processedCooperationSchools]
    
    if (search) {
      cooperationSchoolsData = cooperationSchoolsData.filter(school => 
        school.name.includes(search) || 
        school.contact.includes(search) ||
        school.salesman.includes(search) ||
        school.id.includes(search)
      )
    }
    
    if (region) {
      cooperationSchoolsData = cooperationSchoolsData.filter(school => school.region === region)
    }
    
    if (schoolType) {
      cooperationSchoolsData = cooperationSchoolsData.filter(school => school.schoolType === schoolType)
    }
    
    if (projectType) {
      cooperationSchoolsData = cooperationSchoolsData.filter(school => 
        school.cooperationProjects.includes(projectType)
      )
    }
    
    setFilteredCooperationSchools(cooperationSchoolsData)
  }
  
  // 打开添加/编辑模态框
  const showModal = (school = null) => {
    setEditingSchool(school)
    if (school) {
      // 编辑模式，填充表单
      form.setFieldsValue({
        schoolName: school.name,
        schoolType: school.schoolType,
        contactPerson: school.contact,
        contactPhone: school.phone,
        salesman: school.salesman,
        region: school.region,
        customerType: school.customerType,
        status: school.dockingStatus,
        isCooperation: school.isCooperation || false,
        cooperationProjects: school.cooperationProjects || [],
        cooperationAmount: school.cooperationAmount || 0
      })
    } else {
      // 新增模式，重置表单
      form.resetFields()
    }
    setIsModalVisible(true)
  }
  
  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingSchool(null)
    form.resetFields()
  }
  
  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 处理表单提交逻辑
      const schoolData = {
        id: editingSchool ? editingSchool.id : `S${Date.now()}`,
        schoolName: values.schoolName,
        schoolType: values.schoolType,
        contactPerson: values.contactPerson,
        contactPhone: values.contactPhone,
        salesman: values.salesman,
        region: values.region,
        customerType: values.customerType,
        status: values.status,
        isCooperation: values.isCooperation,
        cooperationProjects: values.isCooperation ? values.cooperationProjects : [],
        cooperationAmount: values.isCooperation ? values.cooperationAmount : 0
      }
      
      // 在实际应用中，这里应该调用API保存数据
      console.log('保存学校数据:', schoolData)
      
      // 模拟添加成功，刷新数据
      if (editingSchool) {
        // 更新现有学校
        console.log('更新学校:', schoolData)
      } else {
        // 添加新学校
        console.log('添加新学校:', schoolData)
      }
      
      // 关闭模态框
      handleCancel()
      
      // 重新加载数据
      // 在实际应用中，这里应该重新获取最新数据
      alert(editingSchool ? '学校信息更新成功！' : '学校添加成功！')
    }).catch(info => {
      console.log('表单验证失败:', info)
    })
  }

  // 全部学校的列配置
  const allSchoolColumns = [
    { title: '学校ID', dataIndex: 'id', key: 'id' },
    { title: '学校名称', dataIndex: 'name', key: 'name' },
    { title: '学校类型', dataIndex: 'schoolType', key: 'schoolType' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '业务员', dataIndex: 'salesman', key: 'salesman' },
    { title: '区域', dataIndex: 'region', key: 'region' },
    { title: '学校类型', dataIndex: 'customerType', key: 'customerType' },
    { title: '对接情况', dataIndex: 'dockingStatus', key: 'dockingStatus' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>编辑</Button>
        </Space>
      )
    }
  ]

  // 合作项目的标签样式映射
  const projectTagStyles = {
    '硬件设备': { backgroundColor: '#f6ffed', color: '#52c41a' },
    '软件系统': { backgroundColor: '#fff1f0', color: '#ff4d4f' },
    '解决方案': { backgroundColor: '#f0f5ff', color: '#597ef7' },
    '定制方案': { backgroundColor: '#fff7e6', color: '#fa8c16' }
  }

  // 合作学校的列配置（增加合作项目和合作金额）
  const cooperationSchoolColumns = [
    { title: '学校ID', dataIndex: 'id', key: 'id' },
    { title: '学校名称', dataIndex: 'name', key: 'name' },
    { title: '学校类型', dataIndex: 'schoolType', key: 'schoolType' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '业务员', dataIndex: 'salesman', key: 'salesman' },
    { title: '区域', dataIndex: 'region', key: 'region' },
    { title: '客户类型', dataIndex: 'customerType', key: 'customerType' },
    {
      title: '合作项目',
      dataIndex: 'cooperationProjects',
      key: 'cooperationProjects',
      render: projects => (
        <Space size="small">
          {projects.map((project, index) => {
            const style = projectTagStyles[project] || { backgroundColor: '#e6f7ff', color: '#1890ff' }
            return (
              <span key={index} className="project-tag" style={{ ...style, padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{project}</span>
            )
          })}
        </Space>
      )
    },
    {
      title: '合作金额',
      dataIndex: 'cooperationAmount',
      key: 'cooperationAmount',
      render: amount => `¥${amount.toLocaleString()}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>编辑</Button>
        </Space>
      )
    }
  ]

  // 获取所有区域选项
  const [regions, setRegions] = useState([...new Set(allSchools.map(school => school.region))])
  
  // 模态框相关状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSchool, setEditingSchool] = useState(null)
  const [form] = Form.useForm()

  return (
    <div>
      <Title level={2}>学校管理</Title>
      
      {/* 搜索和筛选区域 */}
      <Card className="mb-4">
        <Space wrap>
          <Space.Compact style={{ width: 400 }}>
            <Input
              placeholder="搜索学校名称、联系人、业务员或ID"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch(searchText)} />
          </Space.Compact>
          <Select
            placeholder="选择区域"
            allowClear
            style={{ width: 150 }}
            onChange={handleRegionChange}
          >
            {regions.map(region => (
              <Option key={region} value={region}>{region}</Option>
            ))}
          </Select>
          <Select
            placeholder="学校类型"
            allowClear
            style={{ width: 120 }}
            onChange={handleSchoolTypeChange}
          >
            {schoolTypes.map(type => (
              <Option key={type.value} value={type.value}>{type.label}</Option>
            ))}
          </Select>
          {activeTab === '2' && (
            <Select
              placeholder="选择合作项目"
              allowClear
              style={{ width: 120, marginLeft: 8 }}
              onChange={handleProjectTypeChange}
            >
              {projectTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            添加学校
          </Button>
          
          {/* 添加/编辑学校模态框 */}
          <Modal
            title={editingSchool ? '编辑学校信息' : '添加新学校'}
            open={isModalVisible}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="保存"
            cancelText="取消"
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                schoolType: '小学',
                customerType: '新客户',
                status: '对接中',
                isCooperation: false,
                cooperationProjects: [],
                cooperationAmount: 0
              }}
            >
              <Form.Item
                label="学校名称"
                name="schoolName"
                rules={[{ required: true, message: '请输入学校名称' }]}
              >
                <Input placeholder="请输入学校名称" />
              </Form.Item>
              
              <Form.Item
                label="学校类型"
                name="schoolType"
                rules={[{ required: true, message: '请选择学校类型' }]}
              >
                <Select placeholder="请选择学校类型">
                  {schoolTypes.map(type => (
                    <Option key={type.value} value={type.value}>{type.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                label="联系人"
                name="contactPerson"
                rules={[{ required: true, message: '请输入联系人姓名' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
              
              <Form.Item
                label="联系电话"
                name="contactPhone"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
              
              <Form.Item
                label="负责业务员"
                name="salesman"
                rules={[{ required: true, message: '请输入负责业务员' }]}
              >
                <Input placeholder="请输入负责业务员" />
              </Form.Item>
              
              <Form.Item
                label="区域"
                name="region"
                rules={[{ required: true, message: '请选择区域' }]}
              >
                <Select placeholder="请选择区域">
                  {regions.map(region => (
                    <Option key={region} value={region}>{region}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                label="客户类型"
                name="customerType"
                rules={[{ required: true, message: '请选择客户类型' }]}
              >
                <Select placeholder="请选择客户类型">
                  <Option value="新客户">新客户</Option>
                  <Option value="老客户">老客户</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="对接情况"
                name="status"
                rules={[{ required: true, message: '请选择对接情况' }]}
              >
                <Select placeholder="请选择对接情况">
                  <Option value="未对接">未对接</Option>
                  <Option value="对接中">对接中</Option>
                  <Option value="已对接">已对接</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="是否合作学校"
                name="isCooperation"
                valuePropName="checked"
              >
                <Checkbox>是合作学校</Checkbox>
              </Form.Item>
              
              {form.getFieldValue('isCooperation') && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    label="合作项目"
                    name="cooperationProjects"
                    rules={[{ required: true, message: '请选择合作项目' }]}
                  >
                    <Select placeholder="请选择合作项目" mode="multiple">
                      {projectTypes.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    label="合作金额"
                    name="cooperationAmount"
                    rules={[{ required: true, message: '请输入合作金额' }]}
                  >
                    <Input type="number" placeholder="请输入合作金额" />
                  </Form.Item>
                </Space>
              )}
            </Form>
          </Modal>
        </Space>
      </Card>
      
      {/* Tab切换 - 使用新的items属性方式 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: '全部学校',
            children: (
              <Table 
                columns={allSchoolColumns} 
                dataSource={filteredAllSchools} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            )
          },
          {
            key: '2',
            label: '合作学校',
            children: (
              <Table 
                columns={cooperationSchoolColumns} 
                dataSource={filteredCooperationSchools} 
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
              />
            )
          }
        ]}
      />
    </div>
  )
}

export default SchoolManagement