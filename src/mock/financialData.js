// 财务管理模拟数据

// 财务交易数据
const financialTransactions = [
  {
    id: 'FIN001',
    orderId: 'ORD2023001',
    schoolName: '北京市第一中学',
    projectCategory: '硬件设备',
    costCategory: '定金款',
    amount: 75000,
    transactionId: 'TXN202312010001',
    transactionDate: '2023-12-01',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN002',
    orderId: 'ORD2023002',
    schoolName: '上海市实验学校',
    projectCategory: '软件系统',
    costCategory: '中期款',
    amount: 90000,
    transactionId: 'TXN202312030002',
    transactionDate: '2023-12-03',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN003',
    orderId: 'ORD2023003',
    schoolName: '广州市育才小学',
    projectCategory: '解决方案',
    costCategory: '后尾款',
    amount: 108000,
    transactionId: 'TXN202312050003',
    transactionDate: '2023-12-05',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN004',
    orderId: 'ORD2023004',
    schoolName: '深圳市南山中学',
    projectCategory: '定制方案',
    costCategory: '定金款',
    amount: 156000,
    transactionId: 'TXN202312070004',
    transactionDate: '2023-12-07',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN005',
    orderId: 'ORD2023005',
    schoolName: '杭州市西湖小学',
    projectCategory: '软件系统',
    costCategory: '中期款',
    amount: 60000,
    transactionId: 'TXN202312090005',
    transactionDate: '2023-12-09',
    paymentStatus: '处理中'
  },
  {
    id: 'FIN006',
    orderId: 'ORD2023006',
    schoolName: '成都市实验中学',
    projectCategory: '硬件设备',
    costCategory: '全款',
    amount: 310000,
    transactionId: 'TXN202312110006',
    transactionDate: '2023-12-11',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN007',
    orderId: 'ORD2023001',
    schoolName: '北京市第一中学',
    projectCategory: '硬件设备',
    costCategory: '中期款',
    amount: 125000,
    transactionId: 'TXN202312130007',
    transactionDate: '2023-12-13',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN008',
    orderId: 'ORD2023004',
    schoolName: '深圳市南山中学',
    projectCategory: '定制方案',
    costCategory: '中期款',
    amount: 208000,
    transactionId: 'TXN202312150008',
    transactionDate: '2023-12-15',
    paymentStatus: '未支付'
  },
  {
    id: 'FIN009',
    orderId: 'ORD2023007',
    schoolName: '武汉市光谷中学',
    projectCategory: '解决方案',
    costCategory: '定金款',
    amount: 186000,
    transactionId: 'TXN202312170009',
    transactionDate: '2023-12-17',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN010',
    orderId: 'ORD2023008',
    schoolName: '西安市铁一中',
    projectCategory: '软件系统',
    costCategory: '中期款',
    amount: 80000,
    transactionId: 'TXN202312190010',
    transactionDate: '2023-12-19',
    paymentStatus: '处理中'
  },
  {
    id: 'FIN011',
    orderId: 'ORD2023009',
    schoolName: '重庆市南开中学',
    projectCategory: '定制方案',
    costCategory: '后尾款',
    amount: 237500,
    transactionId: 'TXN202312210011',
    transactionDate: '2023-12-21',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN012',
    orderId: 'ORD2023010',
    schoolName: '长沙市第一中学',
    projectCategory: '硬件设备',
    costCategory: '定金款',
    amount: 95000,
    transactionId: 'TXN202312230012',
    transactionDate: '2023-12-23',
    paymentStatus: '未支付'
  },
  {
    id: 'FIN013',
    orderId: 'ORD2023011',
    schoolName: '天津市南开中学',
    projectCategory: '解决方案',
    costCategory: '中期款',
    amount: 145000,
    transactionId: 'TXN202312250013',
    transactionDate: '2023-12-25',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN014',
    orderId: 'ORD2023012',
    schoolName: '南京市金陵中学',
    projectCategory: '软件系统',
    costCategory: '定金款',
    amount: 72000,
    transactionId: 'TXN202312270014',
    transactionDate: '2023-12-27',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN015',
    orderId: 'ORD2023013',
    schoolName: '青岛市第二中学',
    projectCategory: '硬件设备',
    costCategory: '后尾款',
    amount: 162000,
    transactionId: 'TXN202312290015',
    transactionDate: '2023-12-29',
    paymentStatus: '处理中'
  },
  {
    id: 'FIN016',
    orderId: 'ORD2023014',
    schoolName: '厦门市第一中学',
    projectCategory: '定制方案',
    costCategory: '全款',
    amount: 298000,
    transactionId: 'TXN202312310016',
    transactionDate: '2023-12-31',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN017',
    orderId: 'ORD2023015',
    schoolName: '沈阳市实验中学',
    projectCategory: '解决方案',
    costCategory: '中期款',
    amount: 118000,
    transactionId: 'TXN202401020017',
    transactionDate: '2024-01-02',
    paymentStatus: '未支付'
  },
  {
    id: 'FIN018',
    orderId: 'ORD2023016',
    schoolName: '郑州市第一中学',
    projectCategory: '软件系统',
    costCategory: '后尾款',
    amount: 96000,
    transactionId: 'TXN202401040018',
    transactionDate: '2024-01-04',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN019',
    orderId: 'ORD2023017',
    schoolName: '福州市第三中学',
    projectCategory: '硬件设备',
    costCategory: '定金款',
    amount: 132000,
    transactionId: 'TXN202401060019',
    transactionDate: '2024-01-06',
    paymentStatus: '处理中'
  },
  {
    id: 'FIN020',
    orderId: 'ORD2023018',
    schoolName: '南昌市第二中学',
    projectCategory: '解决方案',
    costCategory: '全款',
    amount: 256000,
    transactionId: 'TXN202401080020',
    transactionDate: '2024-01-08',
    paymentStatus: '已支付'
  },
  // 新增财务交易记录 - 从FIN021开始
  {
    id: 'FIN021',
    orderId: 'ORD2024001',
    schoolName: '兰州市第一中学',
    projectCategory: '硬件设备',
    costCategory: '中期款',
    amount: 142000,
    transactionId: 'TXN202401100021',
    transactionDate: '2024-01-10',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN022',
    orderId: 'ORD2024002',
    schoolName: '昆明市第三中学',
    projectCategory: '软件系统',
    costCategory: '后尾款',
    amount: 88000,
    transactionId: 'TXN202401120022',
    transactionDate: '2024-01-12',
    paymentStatus: '处理中'
  },
  {
    id: 'FIN023',
    orderId: 'ORD2024003',
    schoolName: '贵阳市第二中学',
    projectCategory: '解决方案',
    costCategory: '定金款',
    amount: 175000,
    transactionId: 'TXN202401140023',
    transactionDate: '2024-01-14',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN024',
    orderId: 'ORD2024004',
    schoolName: '南宁市第十八中学',
    projectCategory: '定制方案',
    costCategory: '中期款',
    amount: 223000,
    transactionId: 'TXN202401160024',
    transactionDate: '2024-01-16',
    paymentStatus: '未支付'
  },
  {
    id: 'FIN025',
    orderId: 'ORD2024005',
    schoolName: '合肥市第四十六中学',
    projectCategory: '硬件设备',
    costCategory: '全款',
    amount: 325000,
    transactionId: 'TXN202401180025',
    transactionDate: '2024-01-18',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN026',
    orderId: 'ORD2024006',
    schoolName: '太原市第五中学',
    projectCategory: '软件系统',
    costCategory: '定金款',
    amount: 68000,
    transactionId: 'TXN202401200026',
    transactionDate: '2024-01-20',
    paymentStatus: '处理中'
  },
  {
    id: 'FIN027',
    orderId: 'ORD2024007',
    schoolName: '石家庄市第二中学',
    projectCategory: '解决方案',
    costCategory: '中期款',
    amount: 152000,
    transactionId: 'TXN202401220027',
    transactionDate: '2024-01-22',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN028',
    orderId: 'ORD2024008',
    schoolName: '哈尔滨市第三中学',
    projectCategory: '定制方案',
    costCategory: '后尾款',
    amount: 205000,
    transactionId: 'TXN202401240028',
    transactionDate: '2024-01-24',
    paymentStatus: '未支付'
  },
  {
    id: 'FIN029',
    orderId: 'ORD2024009',
    schoolName: '乌鲁木齐市第一中学',
    projectCategory: '硬件设备',
    costCategory: '中期款',
    amount: 128000,
    transactionId: 'TXN202401260029',
    transactionDate: '2024-01-26',
    paymentStatus: '已支付'
  },
  {
    id: 'FIN030',
    orderId: 'ORD2024010',
    schoolName: '海口市第一中学',
    projectCategory: '解决方案',
    costCategory: '全款',
    amount: 276000,
    transactionId: 'TXN202401280030',
    transactionDate: '2024-01-28',
    paymentStatus: '处理中'
  }
]

// 项目类别选项
const projectCategoryOptions = [
  { label: '全部', value: '' },
  { label: '硬件设备', value: '硬件设备' },
  { label: '软件系统', value: '软件系统' },
  { label: '解决方案', value: '解决方案' },
  { label: '定制方案', value: '定制方案' }
]

// 费用类别选项
const costCategoryOptions = [
  { label: '全部', value: '' },
  { label: '定金款', value: '定金款' },
  { label: '中期款', value: '中期款' },
  { label: '后尾款', value: '后尾款' },
  { label: '全款', value: '全款' }
]

// 支付状态选项
const paymentStatusOptions = [
  { label: '全部', value: '' },
  { label: '已支付', value: '已支付' },
  { label: '处理中', value: '处理中' },
  { label: '未支付', value: '未支付' }
]

// 项目类别标签颜色
const projectCategoryColors = {
  '硬件设备': 'purple',
  '软件系统': 'cyan',
  '解决方案': 'magenta',
  '定制方案': 'lime'
}

// 费用类别标签颜色
const costCategoryColors = {
  '定金款': 'blue',
  '中期款': 'orange',
  '后尾款': 'green',
  '全款': 'red'
}

// 支付状态标签颜色
const paymentStatusColors = {
  '已支付': 'green',
  '处理中': 'orange',
  '未支付': 'red'
}

// 导出数据
const financialData = {
  transactions: financialTransactions,
  projectCategoryOptions,
  costCategoryOptions,
  paymentStatusOptions,
  projectCategoryColors,
  costCategoryColors,
  paymentStatusColors
}

export default financialData