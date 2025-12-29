// 客户管理模拟数据

// 全部客户数据（包含学校、文旅、政府+AI三大板块）
const allCustomers = [
  // ===== 学校板块 =====
  {
    id: 'SCH001',
    schoolName: '北京市第一中学',
    contactPerson: '张老师',
    contactPhone: '13812345678',
    salesman: '李明',
    region: '北京市',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH002',
    schoolName: '上海市实验学校',
    contactPerson: '王老师',
    contactPhone: '13923456789',
    salesman: '张华',
    region: '上海市',
    customerType: '示范学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '初中'
  },
  {
    id: 'SCH003',
    schoolName: '广州市育才小学',
    contactPerson: '李老师',
    contactPhone: '13734567890',
    salesman: '王刚',
    region: '广东省',
    customerType: '普通客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '小学'
  },
  {
    id: 'SCH004',
    schoolName: '深圳市南山中学',
    contactPerson: '陈老师',
    contactPhone: '13645678901',
    salesman: '王丽',
    region: '广东省',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH005',
    schoolName: '杭州市西湖小学',
    contactPerson: '赵老师',
    contactPhone: '13556789012',
    salesman: '刘伟',
    region: '浙江省',
    customerType: '普通客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '小学'
  },
  {
    id: 'SCH006',
    schoolName: '成都市实验中学',
    contactPerson: '刘老师',
    contactPhone: '13467890123',
    salesman: '孙丽',
    region: '四川省',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH007',
    schoolName: '南京市第一小学',
    contactPerson: '周老师',
    contactPhone: '13378901234',
    salesman: '李强',
    region: '江苏省',
    customerType: '普通客户',
    status: '待对接',
    isCooperation: false,
    industryType: '学校',
    schoolType: '小学'
  },
  {
    id: 'SCH008',
    schoolName: '武汉市光谷中学',
    contactPerson: '吴老师',
    contactPhone: '13289012345',
    salesman: '陈明',
    region: '湖北省',
    customerType: '重点客户',
    status: '待对接',
    isCooperation: false,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH009',
    schoolName: '西安市铁一中',
    contactPerson: '郑老师',
    contactPhone: '13190123456',
    salesman: '赵红',
    region: '陕西省',
    customerType: '重点客户',
    status: '待对接',
    isCooperation: false,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH010',
    schoolName: '重庆市南开中学',
    contactPerson: '钱老师',
    contactPhone: '13001234567',
    salesman: '周强',
    region: '重庆市',
    customerType: '重点客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH011',
    schoolName: '长沙市第一中学',
    contactPerson: '孙老师',
    contactPhone: '13876543210',
    salesman: '吴芳',
    region: '湖南省',
    customerType: '普通客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH012',
    schoolName: '天津市耀华中学',
    contactPerson: '朱老师',
    contactPhone: '13965432109',
    salesman: '郑华',
    region: '天津市',
    customerType: '重点客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '学校',
    schoolType: '初中'
  },
  {
    id: 'SCH013',
    schoolName: '北京师范大学',
    contactPerson: '李教授',
    contactPhone: '13811112222',
    salesman: '张明',
    region: '北京市',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '大学'
  },
  {
    id: 'SCH014',
    schoolName: '上海市实验小学幼儿园',
    contactPerson: '王园长',
    contactPhone: '13933334444',
    salesman: '李华',
    region: '上海市',
    customerType: '普通客户',
    status: '已对接',
    isCooperation: true,
    industryType: '学校',
    schoolType: '幼儿园'
  },

  // ===== 文旅板块 =====
  {
    id: 'CUL001',
    schoolName: '中国国家博物馆',
    contactPerson: '张主任',
    contactPhone: '13800001111',
    salesman: '李明',
    region: '北京市',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '文旅',
    schoolType: '博物馆'
  },
  {
    id: 'CUL002',
    schoolName: '上海科技馆',
    contactPerson: '王馆长',
    contactPhone: '13900002222',
    salesman: '张华',
    region: '上海市',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '文旅',
    schoolType: '科技馆'
  },
  {
    id: 'CUL003',
    schoolName: '深圳欢乐谷',
    contactPerson: '刘经理',
    contactPhone: '13700003333',
    salesman: '王刚',
    region: '广东省',
    customerType: '普通客户',
    status: '已对接',
    isCooperation: true,
    industryType: '文旅',
    schoolType: '主题公园'
  },
  {
    id: 'CUL004',
    schoolName: '杭州宋城景区',
    contactPerson: '陈总监',
    contactPhone: '13600004444',
    salesman: '王丽',
    region: '浙江省',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '文旅',
    schoolType: '旅游景区'
  },
  {
    id: 'CUL005',
    schoolName: '成都文化中心',
    contactPerson: '赵主任',
    contactPhone: '13500005555',
    salesman: '刘伟',
    region: '四川省',
    customerType: '普通客户',
    status: '待对接',
    isCooperation: false,
    industryType: '文旅',
    schoolType: '文化中心'
  },
  {
    id: 'CUL006',
    schoolName: '北京798文创园区',
    contactPerson: '周经理',
    contactPhone: '13300006666',
    salesman: '李强',
    region: '北京市',
    customerType: '重点客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '文旅',
    schoolType: '文创园区'
  },
  {
    id: 'CUL007',
    schoolName: '南京博物院',
    contactPerson: '黄主任',
    contactPhone: '13711112222',
    salesman: '陈明',
    region: '江苏省',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '文旅',
    schoolType: '博物馆'
  },
  {
    id: 'CUL008',
    schoolName: '苏州博物馆',
    contactPerson: '沈老师',
    contactPhone: '13622223333',
    salesman: '吴芳',
    region: '江苏省',
    customerType: '普通客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '文旅',
    schoolType: '博物馆'
  },
  {
    id: 'CUL009',
    schoolName: '西安大唐不夜城景区',
    contactPerson: '马经理',
    contactPhone: '13533334444',
    salesman: '赵红',
    region: '陕西省',
    customerType: '重点客户',
    status: '待对接',
    isCooperation: false,
    industryType: '文旅',
    schoolType: '旅游景区'
  },
  {
    id: 'CUL010',
    schoolName: '哈尔滨冰雪大世界',
    contactPerson: '梁总监',
    contactPhone: '13944445555',
    salesman: '周强',
    region: '黑龙江省',
    customerType: '重点客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '文旅',
    schoolType: '主题公园'
  },
  {
    id: 'CUL011',
    schoolName: '桂林两江四湖景区',
    contactPerson: '覃主任',
    contactPhone: '13855556666',
    salesman: '郑华',
    region: '广西壮族自治区',
    customerType: '普通客户',
    status: '待对接',
    isCooperation: false,
    industryType: '文旅',
    schoolType: '旅游景区'
  },
  {
    id: 'CUL012',
    schoolName: '青岛海底世界',
    contactPerson: '丁经理',
    contactPhone: '13766667777',
    salesman: '李华',
    region: '山东省',
    customerType: '普通客户',
    status: '已对接',
    isCooperation: true,
    industryType: '文旅',
    schoolType: '主题公园'
  },

  // ===== 政府+人工智能板块 =====
  {
    id: 'GOV001',
    schoolName: '北京市科学技术局',
    contactPerson: '张处长',
    contactPhone: '13800007777',
    salesman: '李明',
    region: '北京市',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '政府+人工智能',
    schoolType: '政府部门'
  },
  {
    id: 'GOV002',
    schoolName: '上海张江科创园区',
    contactPerson: '王主任',
    contactPhone: '13900008888',
    salesman: '张华',
    region: '上海市',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '政府+人工智能',
    schoolType: '科创园区'
  },
  {
    id: 'GOV003',
    schoolName: '深圳AI创新中心',
    contactPerson: '刘总监',
    contactPhone: '13700009999',
    salesman: '王刚',
    region: '广东省',
    customerType: '重点客户',
    status: '已对接',
    isCooperation: true,
    industryType: '政府+人工智能',
    schoolType: 'AI创新中心'
  },
  {
    id: 'GOV004',
    schoolName: '杭州市智慧城市项目办公室',
    contactPerson: '陈主任',
    contactPhone: '13600001010',
    salesman: '王丽',
    region: '浙江省',
    customerType: '重点客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '政府+人工智能',
    schoolType: '智慧城市项目'
  },
  {
    id: 'GOV005',
    schoolName: '成都市科技创新研究院',
    contactPerson: '赵院长',
    contactPhone: '13500001212',
    salesman: '刘伟',
    region: '四川省',
    customerType: '普通客户',
    status: '待对接',
    isCooperation: false,
    industryType: '政府+人工智能',
    schoolType: '事业单位'
  },
  {
    id: 'GOV006',
    schoolName: '西安高新技术产业开发区管委会',
    contactPerson: '周主任',
    contactPhone: '13300001313',
    salesman: '李强',
    region: '陕西省',
    customerType: '重点客户',
    status: '沟通中',
    isCooperation: false,
    industryType: '政府+人工智能',
    schoolType: '政府部门'
  }
]

// 兼容旧代码：保留 allSchools 和 cooperationSchools 变量名
const allSchools = allCustomers
const cooperationSchools = allCustomers.filter(c => c.isCooperation)

// 合作客户数据 - 包含合作项目和金额
const findCustomer = (id) => allCustomers.find(customer => customer.id === id)
const cooperationCustomers = [
  {
    ...findCustomer('SCH001'),
    cooperationProjects: ['硬件设备', '软件系统'],
    cooperationAmount: 500000
  },
  {
    ...findCustomer('SCH002'),
    cooperationProjects: ['解决方案'],
    cooperationAmount: 350000
  },
  {
    ...findCustomer('SCH003'),
    cooperationProjects: ['硬件设备'],
    cooperationAmount: 200000
  },
  {
    ...findCustomer('SCH004'),
    cooperationProjects: ['定制方案', '软件系统'],
    cooperationAmount: 780000
  },
  {
    ...findCustomer('SCH005'),
    cooperationProjects: ['软件系统', '解决方案', '定制方案'],
    cooperationAmount: 680000
  },
  {
    ...findCustomer('SCH006'),
    cooperationProjects: ['硬件设备', '解决方案', '定制方案'],
    cooperationAmount: 950000
  },
  {
    ...findCustomer('CUL001'),
    cooperationProjects: ['AI智能导览系统'],
    cooperationAmount: 1200000
  },
  {
    ...findCustomer('CUL002'),
    cooperationProjects: ['智慧场馆解决方案'],
    cooperationAmount: 800000
  },
  {
    ...findCustomer('CUL003'),
    cooperationProjects: ['互动展示系统', '票务管理系统'],
    cooperationAmount: 450000
  },
  {
    ...findCustomer('GOV001'),
    cooperationProjects: ['AI政务助手', '智能办公系统'],
    cooperationAmount: 1500000
  },
  {
    ...findCustomer('GOV002'),
    cooperationProjects: ['智慧园区管理平台', 'AI监控系统'],
    cooperationAmount: 2000000
  },
  {
    ...findCustomer('GOV003'),
    cooperationProjects: ['AI算法平台', '智能硬件设备'],
    cooperationAmount: 1800000
  }
]

// 客户类型选项
const customerTypes = [
  { label: '全部', value: '' },
  { label: '重点客户', value: '重点客户' },
  { label: '普通客户', value: '普通客户' }
]

// 对接状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '已对接', value: '已对接' },
  { label: '待对接', value: '待对接' },
  { label: '沟通中', value: '沟通中' }
]

// 合作项目选项
const cooperationProjects = [
  { label: '硬件设备', value: '硬件设备' },
  { label: '软件系统', value: '软件系统' },
  { label: '解决方案', value: '解决方案' },
  { label: '定制方案', value: '定制方案' }
]

// 导出数据
const customerData = {
  allCustomers,
  allSchools, // 兼容旧代码
  cooperationCustomers,
  cooperationSchools: cooperationCustomers, // 兼容旧代码
  customerTypes,
  statusOptions,
  cooperationProjects
}

export default customerData
