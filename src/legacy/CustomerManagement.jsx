import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Card, Table, Typography, Button, Input, Select, Space, Modal, Form, Checkbox, Row, Col, Statistic, Tag, Divider, message, Spin } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, TeamOutlined, RocketOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import customerData from '../mock/customerData'
import { generatePolicySearch } from '../services/policySearch.service'

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 苹果蓝品牌色
const APPLE_BLUE = '#0071e3'
const APPLE_GRAY = '#f5f5f7'

// 客户行业类型选项（三大板块）
const customerIndustryTypes = [
  { label: '学校', value: '学校' },
  { label: '文旅', value: '文旅' },
  { label: '政府+人工智能', value: '政府+人工智能' }
]

// 学校类型选项（当选择学校时显示）
const schoolTypes = [
  { label: '幼儿园', value: '幼儿园' },
  { label: '小学', value: '小学' },
  { label: '初中', value: '初中' },
  { label: '高中', value: '高中' },
  { label: '职校', value: '职校' },
  { label: '大学', value: '大学' }
]

// 文旅类型选项（当选择文旅时显示）
const culturalTourismTypes = [
  { label: '博物馆', value: '博物馆' },
  { label: '科技馆', value: '科技馆' },
  { label: '主题公园', value: '主题公园' },
  { label: '文化中心', value: '文化中心' },
  { label: '旅游景区', value: '旅游景区' },
  { label: '文创园区', value: '文创园区' }
]

// 政府类型选项（当选择政府+AI时显示）
const governmentTypes = [
  { label: '政府部门', value: '政府部门' },
  { label: '事业单位', value: '事业单位' },
  { label: '科创园区', value: '科创园区' },
  { label: 'AI创新中心', value: 'AI创新中心' },
  { label: '智慧城市项目', value: '智慧城市项目' }
]

// 合作项目类型选项
const projectTypes = [
  { label: '硬件设备', value: '硬件设备' },
  { label: '软件系统', value: '软件系统' },
  { label: '解决方案', value: '解决方案' },
  { label: '定制方案', value: '定制方案' }
]

// 从mock数据中获取客户数据
const { allSchools, cooperationSchools } = customerData

const CustomerManagement = () => {
  const [searchText, setSearchText] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedIndustryType, setSelectedIndustryType] = useState('') // 新增：行业类型筛选
  const [selectedSchoolType, setSelectedSchoolType] = useState('')
  const [filteredAllCustomers, setFilteredAllCustomers] = useState([])
  const [policySearchSources, setPolicySearchSources] = useState([])
  const [policyStreamingContent, setPolicyStreamingContent] = useState('')
  const [isPolicyGenerating, setIsPolicyGenerating] = useState(false)
  const [policyProgress, setPolicyProgress] = useState('')
  const policyCancelRef = useRef(null)
  const policyChunksRef = useRef([])

  // 处理数据格式，统一字段名
  const processedAllCustomers = allSchools.map(customer => ({
    id: customer.id,
    name: customer.schoolName,
    contact: customer.contactPerson,
    phone: customer.contactPhone,
    salesman: customer.salesman,
    region: customer.region,
    customerType: customer.customerType,
    dockingStatus: customer.status,
    industryType: customer.industryType || '学校', // 新增：行业类型
    schoolType: customer.schoolType || getRandomSchoolType(),
    isCooperation: customer.isCooperation !== undefined ? customer.isCooperation : false,
    cooperationProjects: customer.cooperationProjects || [],
    cooperationAmount: customer.cooperationAmount || 0
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
    const allRegions = [...new Set(allSchools.map(customer => customer.region))]
    setRegions(allRegions)

    // 初始化数据
    setFilteredAllCustomers(processedAllCustomers)

    // 初始化统计数据
    calculateStatistics()
  }, [])

  // 计算统计数据
  const calculateStatistics = () => {
    const industryCounts = {
      '学校': allSchools.filter(c => c.industryType === '学校').length,
      '文旅': allSchools.filter(c => c.industryType === '文旅').length,
      '政府+人工智能': allSchools.filter(c => c.industryType === '政府+人工智能').length
    }
    setIndustryStatistics(industryCounts)
  }

  // 统计数据状态
  const [industryStatistics, setIndustryStatistics] = useState({})

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, selectedRegion)
  }

  // 区域筛选
  const handleRegionChange = (value) => {
    setSelectedRegion(value)
    filterData(searchText, value, selectedIndustryType, selectedSchoolType)
  }

  // 行业类型筛选（新增）
  const handleIndustryTypeChange = (value) => {
    setSelectedIndustryType(value)
    filterData(searchText, selectedRegion, value, selectedSchoolType)
  }

  // 学校/细分类型筛选
  const handleSchoolTypeChange = (value) => {
    setSelectedSchoolType(value)
    filterData(searchText, selectedRegion, selectedIndustryType, value)
  }

  // 综合筛选数据
  const filterData = (search, region, industryType, schoolType) => {
    // 筛选全部客户
    let allCustomersData = [...processedAllCustomers]

    if (search) {
      allCustomersData = allCustomersData.filter(customer =>
        customer.name.includes(search) ||
        customer.contact.includes(search) ||
        customer.salesman.includes(search) ||
        customer.id.includes(search)
      )
    }

    if (region) {
      allCustomersData = allCustomersData.filter(customer => customer.region === region)
    }

    if (industryType) {
      allCustomersData = allCustomersData.filter(customer => customer.industryType === industryType)
    }

    if (schoolType) {
      allCustomersData = allCustomersData.filter(customer => customer.schoolType === schoolType)
    }

    setFilteredAllCustomers(allCustomersData)
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

  // 全部客户的列配置
  const allCustomerColumns = [
    { title: '客户ID', dataIndex: 'id', key: 'id' },
    { title: '客户名称', dataIndex: 'name', key: 'name' },
    { title: '行业类型', dataIndex: 'industryType', key: 'industryType' },
    { title: '细分类型', dataIndex: 'schoolType', key: 'schoolType' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    // 联系电话/业务员不展示，避免假数据露出
    { title: '区域', dataIndex: 'region', key: 'region' },
    { title: '客户等级', dataIndex: 'customerType', key: 'customerType' },
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

  // 合作客户的列配置（增加合作项目和合作金额）
  const cooperationCustomerColumns = [
    { title: '客户ID', dataIndex: 'id', key: 'id' },
    { title: '客户名称', dataIndex: 'name', key: 'name' },
    { title: '行业类型', dataIndex: 'industryType', key: 'industryType' },
    { title: '细分类型', dataIndex: 'schoolType', key: 'schoolType' },
    { title: '联系人', dataIndex: 'contact', key: 'contact' },
    // 联系电话/业务员不展示，避免假数据露出
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
  const [regions, setRegions] = useState([...new Set(allSchools.map(customer => customer.region))])

  // 模态框相关状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSchool, setEditingSchool] = useState(null)
  const [form] = Form.useForm()
  const [policyInputForm] = Form.useForm()

  // 准备图表数据
  const industryDistributionData = [
    { name: '学校', value: industryStatistics['学校'] || 0, color: '#0071e3' },
    { name: '文旅', value: industryStatistics['文旅'] || 0, color: '#52c41a' },
    { name: '政府+AI', value: industryStatistics['政府+人工智能'] || 0, color: '#722ed1' }
  ]

  const regionData = [
    { name: '北京市', value: allSchools.filter(c => c.region === '北京市').length },
    { name: '上海市', value: allSchools.filter(c => c.region === '上海市').length },
    { name: '广东省', value: allSchools.filter(c => c.region === '广东省').length },
    { name: '浙江省', value: allSchools.filter(c => c.region === '浙江省').length },
    { name: '四川省', value: allSchools.filter(c => c.region === '四川省').length }
  ]

  // 快捷筛选函数
  const handleQuickFilter = (industryType) => {
    setSelectedIndustryType(industryType)
    filterData(searchText, selectedRegion, industryType, selectedSchoolType)
  }

  const isGovAI = selectedIndustryType === '政府+人工智能'

  // 政府+AI 政策生成
  const handleGeneratePolicy = useCallback(async () => {
    try {
      const values = await policyInputForm.validateFields()
      const city = values.city?.trim()
      const keywords = values.keywords || []

      setIsPolicyGenerating(true)
      setPolicySearchSources([])
      setPolicyStreamingContent('')
      setPolicyProgress('正在检索政策信息...')
      policyChunksRef.current = []

      if (policyCancelRef.current) {
        policyCancelRef.current()
      }

      policyCancelRef.current = generatePolicySearch({
        city,
        keywords,
        onMessage: (data) => {
          switch (data.type) {
            case 'search_info':
              if (data.search_results) {
                setPolicySearchSources(data.search_results)
                setPolicyProgress(`找到 ${data.search_results.length} 条政策来源，正在生成内容...`)
              }
              break
            case 'content':
              if (data.content) {
                const nextChunks = [...policyChunksRef.current, data.content]
                policyChunksRef.current = nextChunks
                setPolicyStreamingContent(nextChunks.join(''))
                setPolicyProgress('学智AI正在汇总政策信息，请稍候...')
              }
              break
            case 'usage_stats':
              setPolicyProgress('政策信息检索完成')
              break
            case 'completed':
              setPolicyProgress('政策信息检索完成')
              break
            default:
          }
        },
        onComplete: () => {
          setIsPolicyGenerating(false)
          message.success('政策信息检索成功')
        },
        onError: (error) => {
          console.error('检索政策信息失败:', error)
          message.error(`检索失败: ${error.message || '未知错误'}`)
          setIsPolicyGenerating(false)
        }
      })
    } catch (error) {
      if (error?.errorFields) {
        return
      }
      console.error('检索政策信息失败:', error)
      message.error('生成失败，请稍后重试')
      setIsPolicyGenerating(false)
    }
  }, [policyInputForm])

  useEffect(() => {
    return () => {
      if (policyCancelRef.current) {
        policyCancelRef.current()
      }
    }
  }, [])

  return (
    <div style={{ minHeight: '100%' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, fontSize: '32px', fontWeight: 600, color: '#1d1d1f' }}>
          客户管理
        </Title>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#86868b' }}>
          三大板块客户数据统计与管理
        </p>
      </div>

      {/* 核心数据统计卡片 - 苹果风格 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '16px',
              background: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}
            hoverable
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#86868b', fontWeight: 500 }}>客户总数</span>}
              value={allSchools.length}
              prefix={<TeamOutlined style={{ color: APPLE_BLUE }} />}
              valueStyle={{ color: APPLE_BLUE, fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '16px',
              background: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}
            hoverable
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#86868b', fontWeight: 500 }}>学校客户</span>}
              value={industryStatistics['学校'] || 0}
              // prefix={<UserOutlined style={{ color: '#0071e3' }} />}
              valueStyle={{ color: '#0071e3', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '16px',
              background: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}
            hoverable
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#86868b', fontWeight: 500 }}>政府+AI客户</span>}
              value={industryStatistics['政府+人工智能'] || 0}
              prefix={<RocketOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 数据可视化区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* 行业分布饼图 */}
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>行业分布</span>}
            style={{
              borderRadius: '16px',
              background: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={industryDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 区域分布柱状图 */}
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>区域分布</span>}
            style={{
              borderRadius: '16px',
              background: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#86868b" fontSize={12} />
                <YAxis stroke="#86868b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill={APPLE_BLUE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选区域 - 苹果风格 */}
      <Card
        style={{
          borderRadius: '16px',
          background: 'white',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '24px'
        }}
      >
        {/* 快捷筛选标签 */}
        <div style={{ marginBottom: '16px' }}>
          <Space size={[8, 8]} wrap>
            <Button
              type={selectedIndustryType === '' ? 'primary' : 'default'}
              onClick={() => handleQuickFilter('')}
              style={{
                borderRadius: '8px',
                height: '36px',
                fontSize: '14px'
              }}
            >
              全部客户
            </Button>
            <Button
              type={selectedIndustryType === '学校' ? 'primary' : 'default'}
              // icon={<UserOutlined />}
              onClick={() => handleQuickFilter('学校')}
              style={{
                borderRadius: '8px',
                height: '36px',
                fontSize: '14px'
              }}
            >
              学校
            </Button>
            <Button
              type={selectedIndustryType === '文旅' ? 'primary' : 'default'}
              onClick={() => handleQuickFilter('文旅')}
              style={{
                borderRadius: '8px',
                height: '36px',
                fontSize: '14px'
              }}
            >
              文旅
            </Button>
            <Button
              type={selectedIndustryType === '政府+人工智能' ? 'primary' : 'default'}
              // icon={<RocketOutlined />}
              onClick={() => handleQuickFilter('政府+人工智能')}
              style={{
                borderRadius: '8px',
                height: '36px',
                fontSize: '14px'
              }}
            >
              政府+人工智能
            </Button>
          </Space>
        </div>

        {/* 搜索和详细筛选 */}
        {!isGovAI && (
          <Space wrap size="middle">
            <Space.Compact style={{ width: 400 }}>
              <Input
                placeholder="搜索客户名称、联系人、业务员或ID"
                allowClear
                style={{
                  borderRadius: '8px 0 0 8px',
                  height: '40px',
                  fontSize: '14px'
                }}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch(searchText)}
                style={{
                  borderRadius: '0 8px 8px 0',
                  height: '40px',
                  background: APPLE_BLUE
                }}
              />
            </Space.Compact>
            <Select
              placeholder="选择区域"
              allowClear
              style={{
                width: 150,
                borderRadius: '8px'
              }}
              onChange={handleRegionChange}
            >
              {regions.map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
            <Select
              placeholder="细分类型"
              allowClear
              style={{
                width: 150,
                borderRadius: '8px'
              }}
              onChange={handleSchoolTypeChange}
            >
              {schoolTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              style={{
                borderRadius: '8px',
                height: '40px',
                background: APPLE_BLUE
              }}
            >
              添加客户
            </Button>

            {/* 添加/编辑客户模态框 */}
            <Modal
              title={editingSchool ? '编辑客户信息' : '添加新客户'}
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
                  label="客户名称"
                  name="schoolName"
                  rules={[{ required: true, message: '请输入客户名称' }]}
                >
                  <Input placeholder="请输入客户名称" />
                </Form.Item>

                <Form.Item
                  label="行业类型"
                  name="industryType"
                  rules={[{ required: true, message: '请选择行业类型' }]}
                >
                  <Select placeholder="请选择行业类型">
                    {customerIndustryTypes.map(type => (
                      <Option key={type.value} value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="细分类型"
                  name="schoolType"
                  rules={[{ required: true, message: '请选择细分类型' }]}
                >
                  <Select placeholder="请选择细分类型">
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
                  label="是否合作客户"
                  name="isCooperation"
                  valuePropName="checked"
                >
                  <Checkbox>是合作客户</Checkbox>
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
        )}

        {isGovAI && (
          <div>
            <Form form={policyInputForm} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="政府城市"
                    name="city"
                    rules={[{ required: true, message: '请输入城市名称' }]}
                  >
                    <Input placeholder="请输入城市名称，例如：广州" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={16}>
                  <Form.Item label="关键词" name="keywords">
                    <Select
                      mode="tags"
                      tokenSeparators={[',', '，']}
                      placeholder="输入关键词，例如：AI、人工智能、政策"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Space>
                <Button
                  type="primary"
                  onClick={handleGeneratePolicy}
                  loading={isPolicyGenerating}
                  style={{ background: APPLE_BLUE }}
                >
                  检索政策信息
                </Button>
                {policyProgress && (
                  <span style={{ color: '#86868b' }}>{policyProgress}</span>
                )}
              </Space>
            </Form>

            {policySearchSources.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '13px', color: '#86868b', marginBottom: '8px' }}>搜索来源</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {policySearchSources.map((source, index) => (
                    <Button
                      key={source.url || `${source.title}-${index}`}
                      type="link"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        padding: '6px 12px',
                        height: 'auto',
                        borderRadius: '8px',
                        background: '#f5f8ff',
                        border: '1px solid #d6e4ff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {source.title || source.url}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {isPolicyGenerating && policyStreamingContent && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '320px',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Spin size="small" />
                  <span style={{ color: '#86868b' }}>生成中...</span>
                </div>
                {policyStreamingContent}
              </div>
            )}
          </div>
        )}
      </Card>

      {!isGovAI && (
        <Card
          style={{
            borderRadius: '16px',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <Table
            columns={allCustomerColumns}
            dataSource={filteredAllCustomers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true
            }}
            scroll={{ x: 'max-content' }}
            style={{
              fontSize: '14px'
            }}
          />
        </Card>
      )}

      {isGovAI && policySearchSources.length === 0 && (
        <Card
          style={{
            borderRadius: '16px',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <Divider orientation="left">政策列表</Divider>
          <div style={{ color: '#86868b' }}>暂无政策数据</div>
        </Card>
      )}
    </div>
  )
}

export default CustomerManagement
