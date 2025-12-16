// AI方案中心模拟数据

// 学校类型数据
export const schoolTypes = [
  { value: 'primary', label: '小学', description: '适合小学生AI启蒙教育' },
  { value: 'junior', label: '初中', description: '适合初中生基础AI课程' },
  { value: 'senior', label: '高中', description: '适合高中生进阶AI学习' },
  { value: 'vocational', label: '职校', description: '适合职业院校专业AI培训' },
  { value: 'university', label: '大学', description: '适合高校专业AI研究' }
];

// 空间面积预设数据
export const spaceAreaOptions = [
  { value: 30, label: '30平方', capacity: 1 },
  { value: 50, label: '50平方', capacity: 2 },
  { value: 100, label: '100平方', capacity: 4 }
];

// 预算范围数据
export const budgetRanges = [
  { value: '10w', label: '10万左右', description: '基础配置方案' },
  { value: '20w', label: '20万左右', description: '标准配置方案' },
  { value: '30w', label: '30万左右', description: '专业配置方案' },
  { value: '50w+', label: '50万以上', description: '企业级配置方案' }
];

// 付款方式数据
export const paymentMethods = [
  { value: 'full', label: '一次性全款支付', discount: 0.97, description: '享受3%折扣' },
  { value: '80-20', label: '80% + 20%分期支付', discount: 1, description: '首付80%，验收后支付20%' },
  { value: '70-30', label: '70% + 30%分期支付', discount: 1, description: '首付70%，验收后支付30%' },
  { value: '50-50', label: '50% + 50%分期支付', discount: 1, description: '首付50%，验收后支付50%' }
];

// 硬件产品分类
export const hardwareCategories = [
  { id: 'cpu', name: 'CPU系列', icon: '💻' },
  { id: 'gpu', name: 'GPU系列', icon: '🎮' },
  { id: 'memory', name: '内存系列', icon: '🧠' },
  { id: 'storage', name: '存储系列', icon: '💾' },
  { id: 'motherboard', name: '主板系列', icon: '🔌' },
  { id: 'server', name: '服务器系列', icon: '🖥️' },
  { id: 'network', name: '网络设备系列', icon: '🌐' },
  { id: 'software', name: '软件系列', icon: '📱' }
];

// CPU产品数据
export const cpuProducts = [
  {
    id: 'cpu-1',
    name: 'Intel Core i9-13900K',
    brand: 'Intel',
    specs: '24核(8P+16E)/5.8GHz',
    price: 4599,
    stock: 50,
    performance: 95,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3']
  },
  {
    id: 'cpu-2',
    name: 'AMD Ryzen 9 7950X',
    brand: 'AMD',
    specs: '16核32线程/5.7GHz',
    price: 3999,
    stock: 45,
    performance: 92,
    compatibility: ['motherboard-4', 'motherboard-5']
  },
  {
    id: 'cpu-3',
    name: 'Intel Core i7-13700K',
    brand: 'Intel',
    specs: '16核(8P+8E)/5.4GHz',
    price: 3299,
    stock: 60,
    performance: 85,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3']
  }
];

// GPU产品数据
export const gpuProducts = [
  {
    id: 'gpu-1',
    name: 'NVIDIA RTX 4090',
    brand: 'NVIDIA',
    specs: '24GB GDDR6X/16384 CUDA',
    price: 12999,
    stock: 20,
    performance: 98,
    powerRequirement: 450,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  },
  {
    id: 'gpu-2',
    name: 'NVIDIA RTX 4080',
    brand: 'NVIDIA',
    specs: '16GB GDDR6X/9728 CUDA',
    price: 8999,
    stock: 30,
    performance: 90,
    powerRequirement: 320,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  },
  {
    id: 'gpu-3',
    name: 'NVIDIA RTX 4070 Ti',
    brand: 'NVIDIA',
    specs: '12GB GDDR6X/7680 CUDA',
    price: 5999,
    stock: 40,
    performance: 82,
    powerRequirement: 285,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  }
];

// 内存产品数据
export const memoryProducts = [
  {
    id: 'memory-1',
    name: 'Corsair DDR5 64GB(32G×2)',
    brand: 'Corsair',
    specs: '6000MHz CL36',
    price: 2199,
    stock: 50,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  },
  {
    id: 'memory-2',
    name: 'G.SKILL DDR5 32GB(16G×2)',
    brand: 'G.SKILL',
    specs: '6400MHz CL32',
    price: 1299,
    stock: 60,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  },
  {
    id: 'memory-3',
    name: 'Kingston DDR5 128GB(32G×4)',
    brand: 'Kingston',
    specs: '5600MHz CL36',
    price: 4299,
    stock: 30,
    compatibility: ['motherboard-1', 'motherboard-3', 'motherboard-4']
  }
];

// 存储产品数据
export const storageProducts = [
  {
    id: 'storage-1',
    name: 'Samsung 990 PRO 2TB',
    brand: 'Samsung',
    specs: 'PCIe 4.0 NVMe SSD',
    price: 1499,
    stock: 45,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  },
  {
    id: 'storage-2',
    name: 'Western Digital SN850X 1TB',
    brand: 'Western Digital',
    specs: 'PCIe 4.0 NVMe SSD',
    price: 799,
    stock: 60,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  },
  {
    id: 'storage-3',
    name: 'Seagate IronWolf Pro 16TB',
    brand: 'Seagate',
    specs: 'HDD 7200RPM',
    price: 2199,
    stock: 30,
    compatibility: ['motherboard-1', 'motherboard-2', 'motherboard-3', 'motherboard-4', 'motherboard-5']
  }
];

// 应用场景数据
export const applicationScenarios = [
  {
    id: 'scenario-1',
    name: '学校走廊',
    description: '展示型AI实验室',
    suitableArea: '30-50平方',
    templates: [
      { id: 'template-1-1', name: '单排展示布局', description: '适合狭长走廊空间' },
      { id: 'template-1-2', name: '交互式展示布局', description: '增强学生参与感' }
    ]
  },
  {
    id: 'scenario-2',
    name: '学校课室',
    description: '教学型AI实验室',
    suitableArea: '50-80平方',
    templates: [
      { id: 'template-2-1', name: '传统教室布局', description: '适合常规教学活动' },
      { id: 'template-2-2', name: '分组讨论布局', description: '促进小组协作学习' }
    ]
  },
  {
    id: 'scenario-3',
    name: '学校功能室',
    description: '专业型AI实验室',
    suitableArea: '80-120平方',
    templates: [
      { id: 'template-3-1', name: '工作站布局', description: '专业AI创作环境' },
      { id: 'template-3-2', name: '岛式布局', description: '灵活的创作空间' }
    ]
  },
  {
    id: 'scenario-4',
    name: '学校科技角',
    description: '小型AI体验区',
    suitableArea: '10-30平方',
    templates: [
      { id: 'template-4-1', name: '紧凑型布局', description: '最大化利用空间' },
      { id: 'template-4-2', name: '互动体验布局', description: '吸引学生参与' }
    ]
  }
];

// 方案模板数据
export const proposalTemplates = [
  {
    id: 'template-standard',
    name: '标准AI实验室方案',
    description: '适用于大多数学校的标准配置',
    pages: 8,
    suitableFor: ['primary', 'junior', 'senior']
  },
  {
    id: 'template-professional',
    name: '专业AI实验室方案',
    description: '适用于专业教学和研究的高配方案',
    pages: 10,
    suitableFor: ['vocational', 'university']
  },
  {
    id: 'template-compact',
    name: '紧凑型AI实验室方案',
    description: '适用于空间有限的学校',
    pages: 8,
    suitableFor: ['primary', 'junior']
  }
];

// 模拟方案数据
export const mockProposals = [
  {
    id: 'prop-001',
    name: '第一中学AI实验室方案',
    schoolType: 'senior',
    spaceArea: 80,
    budget: 350000,
    createTime: '2024-01-15',
    lastUpdate: '2024-01-15',
    status: 'completed',
    version: 1,
    createdBy: 'admin'
  },
  {
    id: 'prop-002',
    name: '实验小学AI角方案',
    schoolType: 'primary',
    spaceArea: 30,
    budget: 150000,
    createTime: '2024-01-14',
    lastUpdate: '2024-01-14',
    status: 'draft',
    version: 2,
    createdBy: 'admin'
  },
  {
    id: 'prop-003',
    name: '职业技术学院AI实训中心方案',
    schoolType: 'vocational',
    spaceArea: 120,
    budget: 600000,
    createTime: '2024-01-10',
    lastUpdate: '2024-01-12',
    status: 'exported',
    version: 3,
    createdBy: 'admin'
  }
];

// 导出功能配置
export const exportFormats = [
  { value: 'ppt', label: 'PPT格式', description: 'PowerPoint 2016+' },
  { value: 'pdf', label: 'PDF格式', description: '通用文档格式' },
  { value: 'word', label: 'Word格式', description: '可编辑文档' },
  { value: 'images', label: '图片格式', description: '所有效果图' }
];

// 性能评估指标
export const performanceMetrics = [
  { name: 'AI训练速度', weight: 0.3 },
  { name: '多任务处理', weight: 0.2 },
  { name: '图形渲染', weight: 0.25 },
  { name: '数据存储', weight: 0.15 },
  { name: '扩展性', weight: 0.1 }
];

// 获取所有硬件产品
export const getAllHardwareProducts = () => {
  return {
    cpu: cpuProducts,
    gpu: gpuProducts,
    memory: memoryProducts,
    storage: storageProducts
  };
};

// 根据分类获取产品
export const getProductsByCategory = (categoryId) => {
  switch (categoryId) {
    case 'cpu': return cpuProducts;
    case 'gpu': return gpuProducts;
    case 'memory': return memoryProducts;
    case 'storage': return storageProducts;
    // 为其他硬件分类提供空数组作为默认值，避免未定义的情况
    case 'motherboard':
    case 'server':
    case 'network':
    case 'software':
      return [];
    default: return [];
  }
};

// 模拟案例数据
export const mockCases = {
  primary: [
    { name: '阳光小学AI启蒙教室', area: 50, budget: 180000, description: '为小学生提供AI基础知识学习环境' },
    { name: '希望小学AI创新角', area: 30, budget: 120000, description: '激发小学生对AI技术的兴趣' }
  ],
  junior: [
    { name: '实验中学AI基础实验室', area: 60, budget: 250000, description: '适合初中生AI课程教学' },
    { name: '第一初中AI创新实验室', area: 80, budget: 320000, description: '支持初中生AI项目实践' }
  ],
  senior: [
    { name: '重点高中AI研究实验室', area: 100, budget: 450000, description: '支持高中生AI竞赛培训' },
    { name: '示范高中AI创新中心', area: 120, budget: 580000, description: '综合性AI教育平台' }
  ],
  vocational: [
    { name: '职业技术学院AI实训基地', area: 150, budget: 750000, description: '专业AI技能培训环境' },
    { name: '技师学院AI应用实验室', area: 100, budget: 620000, description: '面向就业的AI应用训练' }
  ],
  university: [
    { name: '理工大学AI研究中心', area: 200, budget: 1500000, description: '高性能AI研究平台' },
    { name: '科技大学智能计算实验室', area: 180, budget: 1200000, description: '前沿AI技术研发环境' }
  ]
};
