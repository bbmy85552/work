// 学校管理模拟数据

// 学校类型选项
const schoolTypes = [
  { label: '全部', value: '' },
  { label: '幼儿园', value: '幼儿园' },
  { label: '小学', value: '小学' },
  { label: '初中', value: '初中' },
  { label: '大学', value: '大学' }
]

// 全部学校数据
const allSchools = [
  {
    id: 'SCH001',
    schoolName: '北京市第一中学',
    contactPerson: '张老师',
    contactPhone: '13812345678',
    salesman: '李明',
    region: '北京市',
    customerType: '重点学校',
    status: '已对接',
    isCooperation: true,
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
    customerType: '普通学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '小学'
  },
  {
    id: 'SCH004',
    schoolName: '深圳市南山中学',
    contactPerson: '陈老师',
    contactPhone: '13645678901',
    salesman: '王丽',
    region: '广东省',
    customerType: '重点学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '初中'
  },
  {
    id: 'SCH005',
    schoolName: '杭州市西湖小学',
    contactPerson: '赵老师',
    contactPhone: '13556789012',
    salesman: '刘伟',
    region: '浙江省',
    customerType: '普通学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '小学'
  },
  {
    id: 'SCH006',
    schoolName: '成都市实验中学',
    contactPerson: '刘老师',
    contactPhone: '13467890123',
    salesman: '孙丽',
    region: '四川省',
    customerType: '示范学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '初中'
  },
  {
    id: 'SCH007',
    schoolName: '南京市第一小学',
    contactPerson: '周老师',
    contactPhone: '13378901234',
    salesman: '李强',
    region: '江苏省',
    customerType: '普通学校',
    status: '待对接',
    isCooperation: false,
    schoolType: '小学'
  },
  {
    id: 'SCH008',
    schoolName: '武汉市光谷中学',
    contactPerson: '吴老师',
    contactPhone: '13289012345',
    salesman: '陈明',
    region: '湖北省',
    customerType: '重点学校',
    status: '待对接',
    isCooperation: false,
    schoolType: '初中'
  },
  {
    id: 'SCH009',
    schoolName: '西安市铁一中',
    contactPerson: '郑老师',
    contactPhone: '13190123456',
    salesman: '赵红',
    region: '陕西省',
    customerType: '示范学校',
    status: '待对接',
    isCooperation: false,
    schoolType: '初中'
  },
  {
    id: 'SCH010',
    schoolName: '重庆市南开中学',
    contactPerson: '钱老师',
    contactPhone: '13001234567',
    salesman: '周强',
    region: '重庆市',
    customerType: '重点学校',
    status: '沟通中',
    isCooperation: false,
    schoolType: '初中'
  },
  {
    id: 'SCH011',
    schoolName: '长沙市第一中学',
    contactPerson: '孙老师',
    contactPhone: '13876543210',
    salesman: '吴芳',
    region: '湖南省',
    customerType: '普通学校',
    status: '沟通中',
    isCooperation: false,
    schoolType: '初中'
  },
  {
    id: 'SCH012',
    schoolName: '天津市耀华中学',
    contactPerson: '朱老师',
    contactPhone: '13965432109',
    salesman: '郑华',
    region: '天津市',
    customerType: '示范学校',
    status: '沟通中',
    isCooperation: false,
    schoolType: '初中'
  },
  {
    id: 'SCH013',
    schoolName: '北京师范大学',
    contactPerson: '李教授',
    contactPhone: '13811112222',
    salesman: '张明',
    region: '北京市',
    customerType: '重点学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '大学'
  },
  {
    id: 'SCH014',
    schoolName: '上海市实验小学幼儿园',
    contactPerson: '王园长',
    contactPhone: '13933334444',
    salesman: '李华',
    region: '上海市',
    customerType: '普通学校',
    status: '已对接',
    isCooperation: true,
    schoolType: '幼儿园'
  }
]

// 合作学校数据 - 包含合作项目和金额
const cooperationSchools = [
  {
    ...allSchools[0],
    cooperationProjects: ['硬件设备', '软件系统'],
    cooperationAmount: 500000
  },
  {
    ...allSchools[1],
    cooperationProjects: ['解决方案'],
    cooperationAmount: 350000
  },
  {
    ...allSchools[2],
    cooperationProjects: ['硬件设备'],
    cooperationAmount: 200000
  },
  {
    ...allSchools[3],
    cooperationProjects: ['定制方案', '软件系统'],
    cooperationAmount: 780000
  },
  {
    ...allSchools[4],
    cooperationProjects: ['软件系统', '解决方案', '定制方案'],
    cooperationAmount: 680000
  },
  {
    ...allSchools[5],
    cooperationProjects: ['硬件设备', '解决方案', '定制方案'],
    cooperationAmount: 950000
  }
]

// 客户类型选项
const customerTypes = [
  { label: '全部', value: '' },
  { label: '重点学校', value: '重点学校' },
  { label: '示范学校', value: '示范学校' },
  { label: '普通学校', value: '普通学校' }
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
const schoolData = {
  allSchools,
  cooperationSchools,
  customerTypes,
  statusOptions,
  cooperationProjects,
  schoolTypes
}

export default schoolData