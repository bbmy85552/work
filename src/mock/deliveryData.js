// 交付跟踪模拟数据

// 交付跟踪数据
const deliveryTrackings = [
  {
    id: 'DEL001',
    orderId: 'ORD2023001',
    projectType: '硬件设备',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    procurementStatus: '采购已完成',
    deliveryDate: '2024-01-15',
    acceptanceDate: '2024-01-20',
    deliveryStatus: '已交付通过',
    personInCharge: '李明',
    manager: '李明' // 添加与组件中使用的字段名一致
  },
  // 成品采购示例
  {
    id: 'DEL021',
    orderId: 'ORD2023021',
    projectType: '硬件采购',
    purchaseStatus: '硬件采购',
    productPurchaseStatus: '下单生产中',
    deliveryDate: '2024-06-10',
    estimatedDeliveryTime: '预计3天后完成生产',
    deliveryStatus: '未交付通过',
    manager: '张三'
  },
  {
    id: 'DEL022',
    orderId: 'ORD2023022',
    projectType: '硬件采购',
    purchaseStatus: '硬件采购',
    productPurchaseStatus: '运输中',
    deliveryDate: '2024-06-05',
    estimatedDeliveryTime: '预计2天后到达',
    deliveryStatus: '未交付通过',
    manager: '张三'
  },
  {
    id: 'DEL023',
    orderId: 'ORD2023023',
    projectType: '硬件采购',
    purchaseStatus: '硬件采购',
    productPurchaseStatus: '到货安装',
    deliveryDate: '2024-05-30',
    estimatedDeliveryTime: '预计1天内完成安装',
    deliveryStatus: '已交付通过',
    manager: '张三'
  },
  // 广告制作示例
  {
    id: 'DEL024',
    orderId: 'ORD2023024',
    projectType: '广告制作',
    purchaseStatus: '广告制作',
    adProductionStatus: '设计排版',
    deliveryDate: '2024-06-15',
    estimatedDeliveryTime: '预计2天后完成设计',
    deliveryStatus: '未交付通过',
    manager: '李四'
  },
  {
    id: 'DEL025',
    orderId: 'ORD2023025',
    projectType: '广告制作',
    purchaseStatus: '广告制作',
    adProductionStatus: '制作',
    deliveryDate: '2024-06-12',
    estimatedDeliveryTime: '预计3天后完成制作',
    deliveryStatus: '未交付通过',
    manager: '李四'
  },
  // 装饰装修示例
  {
    id: 'DEL026',
    orderId: 'ORD2023026',
    projectType: '装饰装修',
    purchaseStatus: '装饰装修',
    decorationStatus: '备料',
    deliveryDate: '2024-07-20',
    estimatedDeliveryTime: '预计5天后开始施工',
    deliveryStatus: '未交付通过',
    manager: '王五'
  },
  {
    id: 'DEL027',
    orderId: 'ORD2023027',
    projectType: '装饰装修',
    purchaseStatus: '装饰装修',
    decorationStatus: '施工中',
    deliveryDate: '2024-07-10',
    estimatedDeliveryTime: '预计10天后完工',
    deliveryStatus: '未交付通过',
    manager: '王五'
  },
  {
    id: 'DEL002',
    orderId: 'ORD2023002',
    projectType: '软件系统',
    planStatus: '方案已完成',
    designStatus: '设计交付中',
    purchaseStatus: '无需采购', // 修改为purchaseStatus
    deliveryDate: '2024-02-20',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '张华' // 修改为manager
  },
  {
    id: 'DEL003',
    orderId: 'ORD2023003',
    projectType: '解决方案',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2023-11-25',
    acceptanceDate: '2023-11-30',
    deliveryStatus: '已交付通过',
    manager: '王刚' // 修改为manager
  },
  {
    id: 'DEL004',
    orderId: 'ORD2023004',
    projectType: '定制方案',
    planStatus: '方案已完成',
    designStatus: '设计交付中',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-03-10',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '王丽' // 修改为manager
  },
  {
    id: 'DEL005',
    orderId: 'ORD2023005',
    projectType: '软件系统',
    planStatus: '方案策划中',
    designStatus: '设计已派单',
    purchaseStatus: '无需采购', // 修改为purchaseStatus
    deliveryDate: '2024-02-05',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '刘伟' // 修改为manager
  },
  {
    id: 'DEL006',
    orderId: 'ORD2023006',
    projectType: '硬件设备',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2023-12-05',
    acceptanceDate: '2023-12-10',
    deliveryStatus: '已交付通过',
    manager: '孙丽' // 修改为manager
  },
  {
    id: 'DEL007',
    orderId: 'ORD2023007',
    projectType: '解决方案',
    planStatus: '方案已接单',
    designStatus: '设计已派单',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-04-20',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '陈明' // 修改为manager
  },
  {
    id: 'DEL008',
    orderId: 'ORD2023008',
    projectType: '软件系统',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '无需采购', // 修改为purchaseStatus
    deliveryDate: '2024-01-30',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '赵红' // 修改为manager
  },
  {
    id: 'DEL009',
    orderId: 'ORD2023009',
    projectType: '定制方案',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2023-11-15',
    acceptanceDate: '2023-11-20',
    deliveryStatus: '已交付通过',
    manager: '周强' // 修改为manager
  },
  {
    id: 'DEL010',
    orderId: 'ORD2023010',
    projectType: '硬件设备',
    planStatus: '方案已接单',
    designStatus: '设计已派单',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-03-05',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '吴芳' // 修改为manager
  },
  {
    id: 'DEL011',
    orderId: 'ORD2023011',
    projectType: '解决方案',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2023-12-20',
    acceptanceDate: '2023-12-25',
    deliveryStatus: '已交付通过',
    manager: '陈晓' // 修改为manager
  },
  {
    id: 'DEL012',
    orderId: 'ORD2023012',
    projectType: '软件系统',
    planStatus: '方案策划中',
    designStatus: '设计交付中',
    purchaseStatus: '无需采购', // 修改为purchaseStatus
    deliveryDate: '2024-03-25',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '林雨' // 修改为manager
  },
  {
    id: 'DEL013',
    orderId: 'ORD2023013',
    projectType: '硬件设备',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-01-10',
    acceptanceDate: '2024-01-15',
    deliveryStatus: '已交付通过',
    manager: '黄亮' // 修改为manager
  },
  {
    id: 'DEL014',
    orderId: 'ORD2023014',
    projectType: '定制方案',
    planStatus: '方案已接单',
    designStatus: '设计已派单',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-04-10',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '胡雪' // 修改为manager
  },
  {
    id: 'DEL015',
    orderId: 'ORD2023015',
    projectType: '解决方案',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2023-11-05',
    acceptanceDate: '2023-11-10',
    deliveryStatus: '已交付通过',
    manager: '朱明' // 修改为manager
  },
  {
    id: 'DEL016',
    orderId: 'ORD2023016',
    projectType: '软件系统',
    planStatus: '方案已完成',
    designStatus: '设计交付中',
    purchaseStatus: '无需采购', // 修改为purchaseStatus
    deliveryDate: '2024-02-15',
    acceptanceDate: null,
    deliveryStatus: '部分未通过',
    manager: '徐静' // 修改为manager
  },
  {
    id: 'DEL017',
    orderId: 'ORD2023017',
    projectType: '硬件设备',
    planStatus: '方案策划中',
    designStatus: '设计已派单',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-03-20',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '马超' // 修改为manager
  },
  {
    id: 'DEL018',
    orderId: 'ORD2023018',
    projectType: '定制方案',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2023-12-15',
    acceptanceDate: '2023-12-20',
    deliveryStatus: '已交付通过',
    manager: '谢芳' // 修改为manager
  },
  {
    id: 'DEL019',
    orderId: 'ORD2023019',
    projectType: '解决方案',
    planStatus: '方案已接单',
    designStatus: '设计交付中',
    purchaseStatus: '采购已完成', // 修改为purchaseStatus
    deliveryDate: '2024-04-05',
    acceptanceDate: null,
    deliveryStatus: '未交付通过',
    manager: '姚军' // 修改为manager
  },
  {
    id: 'DEL020',
    orderId: 'ORD2023020',
    projectType: '软件系统',
    planStatus: '方案已完成',
    designStatus: '设计已完成',
    purchaseStatus: '无需采购', // 修改为purchaseStatus
    deliveryDate: '2024-02-10',
    acceptanceDate: '2024-02-15',
    deliveryStatus: '已交付通过',
    manager: '郭婷' // 修改为manager
  }
]

// 方案状态选项
const planStatusOptions = [
  { label: '全部', value: '' },
  { label: '方案已接单', value: '方案已接单' },
  { label: '方案策划中', value: '方案策划中' },
  { label: '方案已完成', value: '方案已完成' }
]

// 设计状态选项
const designStatusOptions = [
  { label: '全部', value: '' },
  { label: '设计已派单', value: '设计已派单' },
  { label: '设计交付中', value: '设计交付中' },
  { label: '设计已完成', value: '设计已完成' }
]

// 采购状态选项
const procurementStatusOptions = [
  { label: '全部', value: '' },
  { label: '无需采购', value: '无需采购' },
  { label: '采购已完成', value: '采购已完成' },
  { label: '硬件采购', value: '硬件采购' },
  { label: '广告制作', value: '广告制作' },
  { label: '装饰装修', value: '装饰装修' }
]

// 交付状态选项
const deliveryStatusOptions = [
  { label: '全部', value: '' },
  { label: '已交付通过', value: '已交付通过' },
  { label: '未交付通过', value: '未交付通过' },
  { label: '部分未通过', value: '部分未通过' }
]

// 项目类型选项
const projectTypeOptions = [
  { label: '全部', value: '' },
  { label: '硬件设备', value: '硬件设备' },
  { label: '软件系统', value: '软件系统' },
  { label: '解决方案', value: '解决方案' },
  { label: '定制方案', value: '定制方案' },
  { label: '硬件采购', value: '硬件采购' },
  { label: '广告制作', value: '广告制作' },
  { label: '装饰装修', value: '装饰装修' }
]

// 成品采购状态选项
const productPurchaseStatusOptions = [
  { label: '全部', value: '' },
  { label: '下单生产中', value: '下单生产中' },
  { label: '运输中', value: '运输中' },
  { label: '到货安装', value: '到货安装' }
]

// 广告制作状态选项
const adProductionStatusOptions = [
  { label: '全部', value: '' },
  { label: '设计排版', value: '设计排版' },
  { label: '下单', value: '下单' },
  { label: '制作', value: '制作' },
  { label: '到货安装', value: '到货安装' }
]

// 装饰装修状态选项
const decorationStatusOptions = [
  { label: '全部', value: '' },
  { label: '施工图输出', value: '施工图输出' },
  { label: '备料', value: '备料' },
  { label: '施工中', value: '施工中' },
  { label: '完工', value: '完工' }
]

// 导出数据
const deliveryData = {
  deliveries: deliveryTrackings, // 修改为与组件中使用的字段名一致
  planStatusOptions,
  designStatusOptions,
  purchaseStatusOptions: procurementStatusOptions, // 修改为与组件中使用的字段名一致
  deliveryStatusOptions,
  projectTypeOptions,
  productPurchaseStatusOptions,
  adProductionStatusOptions,
  decorationStatusOptions
}

export default deliveryData