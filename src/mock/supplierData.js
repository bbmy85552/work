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
  },
  {
    id: 'SUP011',
    name: '苏州智教科技股份公司',
    company: '苏州智教科技股份公司',
    contactPerson: '黄建国',
    contactPhone: '13911112222',
    relationshipLevel: '战略合作',
    productCount: 35,
    cooperationCount: 92,
    totalAmount: 6800000,
    address: '苏州市工业园区星湖街218号'
  },
  {
    id: 'SUP012',
    name: '天津启航教育装备有限公司',
    company: '天津启航教育装备有限公司',
    contactPerson: '林小敏',
    contactPhone: '13922223333',
    relationshipLevel: '优质合作',
    productCount: 28,
    cooperationCount: 56,
    totalAmount: 3200000,
    address: '天津市滨海新区泰达大街'
  },
  {
    id: 'SUP013',
    name: '长沙智慧校园解决方案',
    company: '长沙智慧校园解决方案',
    contactPerson: '郭强',
    contactPhone: '13933334444',
    relationshipLevel: '优质合作',
    productCount: 21,
    cooperationCount: 43,
    totalAmount: 2750000,
    address: '长沙市岳麓区麓谷高新区'
  },
  {
    id: 'SUP014',
    name: '济南科教仪器有限公司',
    company: '济南科教仪器有限公司',
    contactPerson: '马晓华',
    contactPhone: '13944445555',
    relationshipLevel: '备选合作',
    productCount: 17,
    cooperationCount: 28,
    totalAmount: 1920000,
    address: '济南市历下区经十路'
  },
  {
    id: 'SUP015',
    name: '青岛创新科技有限公司',
    company: '青岛创新科技有限公司',
    contactPerson: '罗明',
    contactPhone: '13955556666',
    relationshipLevel: '优质合作',
    productCount: 24,
    cooperationCount: 51,
    totalAmount: 2890000,
    address: '青岛市崂山区科技园'
  },
  {
    id: 'SUP016',
    name: '大连系统集成服务商',
    company: '大连系统集成服务商',
    contactPerson: '苏静',
    contactPhone: '13966667777',
    relationshipLevel: '备选合作',
    productCount: 13,
    cooperationCount: 21,
    totalAmount: 1650000,
    address: '大连市甘井子区高新园区'
  },
  {
    id: 'SUP017',
    name: '厦门智联科技有限公司',
    company: '厦门智联科技有限公司',
    contactPerson: '唐伟',
    contactPhone: '13977778888',
    relationshipLevel: '战略合作',
    productCount: 42,
    cooperationCount: 78,
    totalAmount: 5400000,
    address: '厦门市思明区软件园二期'
  },
  {
    id: 'SUP018',
    name: '宁波教育装备集团',
    company: '宁波教育装备集团',
    contactPerson: '董丽华',
    contactPhone: '13988889999',
    relationshipLevel: '优质合作',
    productCount: 29,
    cooperationCount: 62,
    totalAmount: 3650000,
    address: '宁波市鄞州区南部商务区'
  },
  {
    id: 'SUP019',
    name: '无锡智慧科技有限公司',
    company: '无锡智慧科技有限公司',
    contactPerson: '梁超',
    contactPhone: '13999110000',
    relationshipLevel: '备选合作',
    productCount: 15,
    cooperationCount: 18,
    totalAmount: 1180000,
    address: '无锡市新吴区长江北路'
  },
  {
    id: 'SUP020',
    name: '沈阳科教设备有限公司',
    company: '沈阳科教设备有限公司',
    contactPerson: '于红',
    contactPhone: '13800112222',
    relationshipLevel: '备选合作',
    productCount: 11,
    cooperationCount: 15,
    totalAmount: 920000,
    address: '沈阳市和平区三好街'
  },
  {
    id: 'SUP021',
    name: '长春教育科技公司',
    company: '长春教育科技公司',
    contactPerson: '高峰',
    contactPhone: '13800223333',
    relationshipLevel: '备选合作',
    productCount: 9,
    cooperationCount: 11,
    totalAmount: 750000,
    address: '长春市朝阳区前进大街'
  },
  {
    id: 'SUP022',
    name: '哈尔滨智教装备',
    company: '哈尔滨智教装备',
    contactPerson: '姜涛',
    contactPhone: '13800334444',
    relationshipLevel: '备选合作',
    productCount: 8,
    cooperationCount: 9,
    totalAmount: 620000,
    address: '哈尔滨市南岗区学府路'
  },
  {
    id: 'SUP023',
    name: '石家庄教育信息化中心',
    company: '石家庄教育信息化中心',
    contactPerson: '崔敏',
    contactPhone: '13800445555',
    relationshipLevel: '优质合作',
    productCount: 20,
    cooperationCount: 34,
    totalAmount: 2150000,
    address: '石家庄市裕华区槐安东路'
  },
  {
    id: 'SUP024',
    name: '太原科教仪器有限公司',
    company: '太原科教仪器有限公司',
    contactPerson: '范建国',
    contactPhone: '13800556666',
    relationshipLevel: '备选合作',
    productCount: 12,
    cooperationCount: 16,
    totalAmount: 1280000,
    address: '太原市小店区亲贤街'
  },
  {
    id: 'SUP025',
    name: '合肥智慧教育科技',
    company: '合肥智慧教育科技',
    contactPerson: '方丽',
    contactPhone: '13800667777',
    relationshipLevel: '优质合作',
    productCount: 26,
    cooperationCount: 47,
    totalAmount: 2980000,
    address: '合肥市高新区创新大道'
  },
  {
    id: 'SUP026',
    name: '南昌智能教育装备',
    company: '南昌智能教育装备',
    contactPerson: '侯强',
    contactPhone: '13800778888',
    relationshipLevel: '备选合作',
    productCount: 14,
    cooperationCount: 22,
    totalAmount: 1460000,
    address: '南昌市红谷滩新区丰和中大道'
  },
  {
    id: 'SUP027',
    name: '福州科教设备有限公司',
    company: '福州科教设备有限公司',
    contactPerson: '邵明华',
    contactPhone: '13800889999',
    relationshipLevel: '优质合作',
    productCount: 23,
    cooperationCount: 39,
    totalAmount: 2620000,
    address: '福州市仓山区金山大道'
  },
  {
    id: 'SUP028',
    name: '广州优教信息科技',
    company: '广州优教信息科技',
    contactPerson: '龚静',
    contactPhone: '13800990000',
    relationshipLevel: '战略合作',
    productCount: 38,
    cooperationCount: 85,
    totalAmount: 5850000,
    address: '广州市天河区科韵路'
  },
  {
    id: 'SUP029',
    name: '南宁教育解决方案',
    company: '南宁教育解决方案',
    contactPerson: '白强',
    contactPhone: '13700001111',
    relationshipLevel: '备选合作',
    productCount: 10,
    cooperationCount: 13,
    totalAmount: 980000,
    address: '南宁市青秀区民族大道'
  },
  {
    id: 'SUP030',
    name: '海口智教科技有限公司',
    company: '海口智教科技有限公司',
    contactPerson: '邹丽',
    contactPhone: '13700012222',
    relationshipLevel: '备选合作',
    productCount: 7,
    cooperationCount: 8,
    totalAmount: 540000,
    address: '海口市龙华区国贸大道'
  },
  {
    id: 'SUP031',
    name: '成都西川教育装备',
    company: '成都西川教育装备',
    contactPerson: '杨明',
    contactPhone: '13700023333',
    relationshipLevel: '优质合作',
    productCount: 31,
    cooperationCount: 58,
    totalAmount: 3420000,
    address: '成都市武侯区天府大道'
  },
  {
    id: 'SUP032',
    name: '贵阳科教信息有限公司',
    company: '贵阳科教信息有限公司',
    contactPerson: '姚静',
    contactPhone: '13700034444',
    relationshipLevel: '备选合作',
    productCount: 9,
    cooperationCount: 12,
    totalAmount: 820000,
    address: '贵阳市观山湖区林城东路'
  },
  {
    id: 'SUP033',
    name: '昆明智慧校园科技',
    company: '昆明智慧校园科技',
    contactPerson: '贺强',
    contactPhone: '13700045555',
    relationshipLevel: '优质合作',
    productCount: 19,
    cooperationCount: 36,
    totalAmount: 2280000,
    address: '昆明市五华区学府路'
  },
  {
    id: 'SUP034',
    name: '西安启明星教育科技',
    company: '西安启明星教育科技',
    contactPerson: '建军',
    contactPhone: '13700056666',
    relationshipLevel: '战略合作',
    productCount: 44,
    cooperationCount: 95,
    totalAmount: 7150000,
    address: '西安市高新区锦业路'
  },
  {
    id: 'SUP035',
    name: '兰州教育装备中心',
    company: '兰州教育装备中心',
    contactPerson: '倪华',
    contactPhone: '13700067777',
    relationshipLevel: '备选合作',
    productCount: 8,
    cooperationCount: 10,
    totalAmount: 680000,
    address: '兰州市城关区东岗西路'
  },
  {
    id: 'SUP036',
    name: '银川智能科技有限公司',
    company: '银川智能科技有限公司',
    contactPerson: '康敏',
    contactPhone: '13700078888',
    relationshipLevel: '备选合作',
    productCount: 6,
    cooperationCount: 7,
    totalAmount: 490000,
    address: '银川市金凤区北京中路'
  },
  {
    id: 'SUP037',
    name: '西宁科教设备有限公司',
    company: '西宁科教设备有限公司',
    contactPerson: '毛强',
    contactPhone: '13700089999',
    relationshipLevel: '备选合作',
    productCount: 5,
    cooperationCount: 6,
    totalAmount: 420000,
    address: '西宁市城西区胜利路'
  },
  {
    id: 'SUP038',
    name: '乌鲁木齐教育科技',
    company: '乌鲁木齐教育科技',
    contactPerson: '乔丽',
    contactPhone: '13700090000',
    relationshipLevel: '备选合作',
    productCount: 4,
    cooperationCount: 5,
    totalAmount: 380000,
    address: '乌鲁木齐市水磨沟区南湖东路'
  },
  {
    id: 'SUP039',
    name: '拉萨智教装备有限公司',
    company: '拉萨智教装备有限公司',
    contactPerson: '汤明',
    contactPhone: '13600001111',
    relationshipLevel: '备选合作',
    productCount: 3,
    cooperationCount: 4,
    totalAmount: 290000,
    address: '拉萨市城关区江苏大道'
  },
  {
    id: 'SUP040',
    name: '呼和浩特教育科技公司',
    company: '呼和浩特教育科技公司',
    contactPerson: '殷静',
    contactPhone: '13600012222',
    relationshipLevel: '备选合作',
    productCount: 7,
    cooperationCount: 9,
    totalAmount: 560000,
    address: '呼和浩特市赛罕区大学东街'
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