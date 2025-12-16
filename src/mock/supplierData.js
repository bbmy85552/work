// 供应商管理模拟数据

// 供应商数据
const suppliers = [
  {
    id: 'SUP001',
    name: '北京智能科技有限公司',
    company: '北京智能科技有限公司',
    contactPerson: '张伟',
    contactPhone: '13811111111',
    relationshipLevel: '战略合作',
    productCount: 25,
    cooperationCount: 86,
    totalAmount: 5200000,
    address: '北京市海淀区中关村科技园区'
  },
  {
    id: 'SUP002',
    name: '上海教育设备有限公司',
    company: '上海教育设备有限公司',
    contactPerson: '李强',
    contactPhone: '13822222222',
    relationshipLevel: '战略合作',
    productCount: 18,
    cooperationCount: 67,
    totalAmount: 4150000,
    address: '上海市浦东新区张江高科技园区'
  },
  {
    id: 'SUP003',
    name: '广州软件开发有限公司',
    company: '广州软件开发有限公司',
    contactPerson: '王刚',
    contactPhone: '13833333333',
    relationshipLevel: '优质合作',
    productCount: 32,
    cooperationCount: 45,
    totalAmount: 3870000,
    address: '广州市天河区珠江新城'
  },
  {
    id: 'SUP004',
    name: '深圳硬件设备供应商',
    company: '深圳硬件设备供应商',
    contactPerson: '刘芳',
    contactPhone: '13844444444',
    relationshipLevel: '优质合作',
    productCount: 15,
    cooperationCount: 38,
    totalAmount: 2980000,
    address: '深圳市南山区科技园'
  },
  {
    id: 'SUP005',
    name: '杭州系统集成商',
    company: '杭州系统集成商',
    contactPerson: '陈明',
    contactPhone: '13855555555',
    relationshipLevel: '优质合作',
    productCount: 22,
    cooperationCount: 31,
    totalAmount: 2450000,
    address: '杭州市西湖区文三路'
  },
  {
    id: 'SUP006',
    name: '成都解决方案提供商',
    company: '成都解决方案提供商',
    contactPerson: '赵丽',
    contactPhone: '13866666666',
    relationshipLevel: '备选合作',
    productCount: 16,
    cooperationCount: 23,
    totalAmount: 1850000,
    address: '成都市高新区天府大道'
  },
  {
    id: 'SUP007',
    name: '南京教育科技公司',
    company: '南京教育科技公司',
    contactPerson: '周强',
    contactPhone: '13877777777',
    relationshipLevel: '备选合作',
    productCount: 19,
    cooperationCount: 19,
    totalAmount: 1560000,
    address: '南京市鼓楼区中山北路'
  },
  {
    id: 'SUP008',
    name: '武汉软件服务商',
    company: '武汉软件服务商',
    contactPerson: '吴静',
    contactPhone: '13888888888',
    relationshipLevel: '备选合作',
    productCount: 28,
    cooperationCount: 16,
    totalAmount: 1250000,
    address: '武汉市洪山区光谷软件园'
  },
  {
    id: 'SUP009',
    name: '西安硬件供应商',
    company: '西安硬件供应商',
    contactPerson: '郑华',
    contactPhone: '13899999999',
    relationshipLevel: '备选合作',
    productCount: 12,
    cooperationCount: 14,
    totalAmount: 980000,
    address: '西安市雁塔区科技路'
  },
  {
    id: 'SUP010',
    name: '重庆教育设备公司',
    company: '重庆教育设备公司',
    contactPerson: '孙丽',
    contactPhone: '13900000000',
    relationshipLevel: '备选合作',
    productCount: 14,
    cooperationCount: 12,
    totalAmount: 850000,
    address: '重庆市渝中区解放碑'
  }
]

// 关系级别选项
const relationshipLevelOptions = [
  { label: '全部', value: '' },
  { label: '战略合作', value: '战略合作' },
  { label: '优质合作', value: '优质合作' },
  { label: '备选合作', value: '备选合作' }
]

// 关系级别标签颜色
const relationshipLevelColors = {
  '战略合作': 'red',
  '优质合作': 'orange',
  '备选合作': 'green'
}

// 导出数据
const supplierData = {
  suppliers,
  relationshipLevelOptions,
  relationshipLevelColors
}

export default supplierData