// 订单中心模拟数据

// 订单数据
const orders = [
  {
    id: 'ORD2024001',
    applicant: '张经理',
    status: '已通过',
    projectType: '硬件设备',
    school: '北京市第一中学',
    contact: '张老师',
    totalAmount: 500000,
    paymentStatus: '定金款',
    deliveryDate: '2024-01-15',
    manager: '李明',
    remark: '需要提前安排安装团队'
  },
  {
    id: 'ORD2024002',
    applicant: '王经理',
    status: '交付中',
    projectType: '软件系统',
    school: '上海市实验学校',
    contact: '王老师',
    totalAmount: 350000,
    paymentStatus: '中期款',
    deliveryDate: '2024-02-20',
    manager: '张华',
    remark: '系统需要进行远程培训'
  },
  {
    id: 'ORD2024003',
    applicant: '李经理',
    status: '已完成',
    projectType: '解决方案',
    school: '广州市育才小学',
    contact: '李老师',
    totalAmount: 200000,
    paymentStatus: '后尾款',
    deliveryDate: '2023-11-25',
    manager: '王刚',
    remark: '项目已顺利验收'
  },
  {
    id: 'ORD2024004',
    applicant: '陈经理',
    status: '交付中',
    projectType: '定制方案',
    school: '深圳市南山中学',
    contact: '陈老师',
    totalAmount: 780000,
    paymentStatus: '中期款',
    deliveryDate: '2024-03-10',
    manager: '王丽',
    remark: '需要进行需求再次确认'
  },
  {
    id: 'ORD2024005',
    applicant: '刘经理',
    status: '已通过',
    projectType: '硬件设备',
    school: '杭州市西湖小学',
    contact: '赵老师',
    totalAmount: 680000,
    paymentStatus: '定金款',
    deliveryDate: '2024-02-05',
    manager: '刘伟',
    remark: '需要加急处理订单'
  },
  {
    id: 'ORD2024006',
    applicant: '周经理',
    status: '已完成',
    projectType: '软件系统',
    school: '成都市实验中学',
    contact: '刘老师',
    totalAmount: 950000,
    paymentStatus: '后尾款',
    deliveryDate: '2023-12-05',
    manager: '孙丽',
    remark: '系统已完成上线部署'
  },
  {
    id: 'ORD2024007',
    applicant: '吴经理',
    status: '已通过',
    projectType: '解决方案',
    school: '南京市第一小学',
    contact: '周老师',
    totalAmount: 420000,
    paymentStatus: '定金款',
    deliveryDate: '2024-04-20',
    manager: '李强',
    remark: '需要提供详细的项目实施方案'
  },
  {
    id: 'ORD2024008',
    applicant: '郑经理',
    status: '交付中',
    projectType: '软件系统',
    school: '武汉市光谷中学',
    contact: '吴老师',
    totalAmount: 580000,
    paymentStatus: '中期款',
    deliveryDate: '2024-01-30',
    manager: '赵红',
    remark: '需要进行二期功能规划'
  },
  {
    id: 'ORD2024009',
    applicant: '钱经理',
    status: '已完成',
    projectType: '定制方案',
    school: '重庆市南开中学',
    contact: '钱老师',
    totalAmount: 950000,
    paymentStatus: '后尾款',
    deliveryDate: '2023-11-15',
    manager: '周强',
    remark: '项目成果获得学校高度评价'
  },
  {
    id: 'ORD2024010',
    applicant: '孙经理',
    status: '已通过',
    projectType: '硬件设备',
    school: '长沙市第一中学',
    contact: '孙老师',
    totalAmount: 380000,
    paymentStatus: '定金款',
    deliveryDate: '2024-03-05',
    manager: '吴芳',
    remark: '需要加急处理'
  },
  {
    id: 'ORD2024011',
    applicant: '朱经理',
    status: '已通过',
    projectType: '解决方案',
    school: '天津市耀华中学',
    contact: '朱老师',
    totalAmount: 480000,
    paymentStatus: '定金款',
    deliveryDate: '2024-04-15',
    manager: '郑华',
    remark: '需要提供技术支持培训'
  },
  {
    id: 'ORD2024012',
    applicant: '马经理',
    status: '交付中',
    projectType: '软件系统',
    school: '北京师范大学',
    contact: '李教授',
    totalAmount: 820000,
    paymentStatus: '中期款',
    deliveryDate: '2024-02-28',
    manager: '张明',
    remark: '需要与科研团队合作'
  },
  {
    id: 'ORD2024013',
    applicant: '牛经理',
    status: '已完成',
    projectType: '硬件设备',
    school: '上海市实验小学幼儿园',
    contact: '王园长',
    totalAmount: 250000,
    paymentStatus: '后尾款',
    deliveryDate: '2023-12-20',
    manager: '李华',
    remark: '幼儿园设备已安全交付'
  },
  {
    id: 'ORD2024014',
    applicant: '杨经理',
    status: '已通过',
    projectType: '定制方案',
    school: '深圳市实验学校',
    contact: '林老师',
    totalAmount: 650000,
    paymentStatus: '定金款',
    deliveryDate: '2024-05-10',
    manager: '刘芳',
    remark: '需要定制特殊功能模块'
  },
  {
    id: 'ORD2024015',
    applicant: '黄经理',
    status: '交付中',
    projectType: '解决方案',
    school: '广州市第四中学',
    contact: '黄老师',
    totalAmount: 450000,
    paymentStatus: '中期款',
    deliveryDate: '2024-03-25',
    manager: '周明',
    remark: '正在进行系统集成测试'
  },
  {
    id: 'ORD2024016',
    applicant: '徐经理',
    status: '已完成',
    projectType: '软件系统',
    school: '杭州市第二中学',
    contact: '徐老师',
    totalAmount: 520000,
    paymentStatus: '后尾款',
    deliveryDate: '2023-11-30',
    manager: '陈明',
    remark: '系统运行稳定，用户反馈良好'
  },
  {
    id: 'ORD2024017',
    applicant: '何经理',
    status: '已通过',
    projectType: '硬件设备',
    school: '重庆市第一实验小学',
    contact: '何老师',
    totalAmount: 320000,
    paymentStatus: '定金款',
    deliveryDate: '2024-04-05',
    manager: '赵强',
    remark: '需要提供安装指导'
  },
  {
    id: 'ORD2024018',
    applicant: '罗经理',
    status: '交付中',
    projectType: '定制方案',
    school: '西安市实验小学',
    contact: '罗老师',
    totalAmount: 720000,
    paymentStatus: '中期款',
    deliveryDate: '2024-03-15',
    manager: '孙强',
    remark: '定制功能开发中'
  },
  {
    id: 'ORD2024019',
    applicant: '梁经理',
    status: '已通过',
    projectType: '解决方案',
    school: '武汉市第一幼儿园',
    contact: '梁园长',
    totalAmount: 280000,
    paymentStatus: '定金款',
    deliveryDate: '2024-05-05',
    manager: '吴强',
    remark: '适合幼儿的特殊设计要求'
  },
  {
    id: 'ORD2024020',
    applicant: '谢经理',
    status: '已完成',
    projectType: '软件系统',
    school: '南京大学',
    contact: '谢教授',
    totalAmount: 980000,
    paymentStatus: '后尾款',
    deliveryDate: '2023-12-15',
    manager: '刘华',
    remark: '高校科研系统顺利交付'
  }
]

// 订单状态选项
const orderStatusOptions = [
  { label: '全部', value: '' },
  { label: '已通过', value: '已通过' },
  { label: '交付中', value: '交付中' },
  { label: '已完成', value: '已完成' }
]

// 项目类型选项
const projectTypeOptions = [
  { label: '全部', value: '' },
  { label: '硬件设备', value: '硬件设备' },
  { label: '软件系统', value: '软件系统' },
  { label: '解决方案', value: '解决方案' },
  { label: '定制方案', value: '定制方案' }
]

// 付款状态选项
const paymentStatusOptions = [
  { label: '全部', value: '' },
  { label: '定金款', value: '定金款' },
  { label: '中期款', value: '中期款' },
  { label: '后尾款', value: '后尾款' }
]

// 导出数据
const orderData = {
  ordersData: orders,
  orderStatusOptions,
  projectTypeOptions,
  paymentStatusOptions
}

export default orderData