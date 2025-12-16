// 人才管理相关的mock数据

// 策划师数据
export const mockPlanners = [
  {
    id: 'PLAN001',
    name: '张明',
    gender: '男',
    age: 35,
    phone: '13800138001',
    email: 'zhangming@example.com',
    education: '本科',
    experience: '10年',
    specialty: '活动策划',
    skills: ['文案撰写', '市场分析', '资源协调', '危机处理'],
    level: '资深',
    status: '在职',
    projectCount: 68,
    successRate: '95%',
    joinDate: '2014-05-10'
  },
  {
    id: 'PLAN002',
    name: '李华',
    gender: '女',
    age: 28,
    phone: '13800138002',
    email: 'lihua@example.com',
    education: '硕士',
    experience: '5年',
    specialty: '营销策划',
    skills: ['数据分析', '品牌策略', '用户研究', '内容营销'],
    level: '高级',
    status: '在职',
    projectCount: 35,
    successRate: '88%',
    joinDate: '2019-03-15'
  },
  {
    id: 'PLAN003',
    name: '王强',
    gender: '男',
    age: 32,
    phone: '13800138003',
    email: 'wangqiang@example.com',
    education: '本科',
    experience: '8年',
    specialty: '品牌策划',
    skills: ['品牌定位', '视觉创意', '竞品分析', '传播策略'],
    level: '高级',
    status: '在职',
    projectCount: 42,
    successRate: '92%',
    joinDate: '2016-08-20'
  },
  {
    id: 'PLAN004',
    name: '刘芳',
    gender: '女',
    age: 26,
    phone: '13800138004',
    email: 'liufang@example.com',
    education: '本科',
    experience: '3年',
    specialty: '线上活动策划',
    skills: ['社交媒体', 'KOL合作', '活动执行', '效果评估'],
    level: '中级',
    status: '在职',
    projectCount: 20,
    successRate: '85%',
    joinDate: '2021-01-12'
  },
  {
    id: 'PLAN005',
    name: '赵杰',
    gender: '男',
    age: 40,
    phone: '13800138005',
    email: 'zhaojie@example.com',
    education: '硕士',
    experience: '15年',
    specialty: '战略策划',
    skills: ['战略规划', '商业模型', '项目管理', '团队领导'],
    level: '资深',
    status: '离职',
    projectCount: 86,
    successRate: '98%',
    joinDate: '2010-02-28'
  }
]

// 设计师数据
export const mockDesigners = [
  {
    id: 'DESIGN001',
    name: '周婷',
    gender: '女',
    age: 30,
    phone: '13900139001',
    email: 'zhouting@example.com',
    education: '本科',
    experience: '7年',
    specialty: 'UI/UX设计',
    skills: ['Sketch', 'Figma', '原型设计', '用户体验'],
    designStyle: ['简约现代', '扁平化', '响应式设计'],
    level: '高级',
    status: '在职',
    projectCount: 52,
    joinDate: '2017-09-05'
  },
  {
    id: 'DESIGN002',
    name: '吴磊',
    gender: '男',
    age: 27,
    phone: '13900139002',
    email: 'wulei@example.com',
    education: '本科',
    experience: '4年',
    specialty: '平面设计',
    skills: ['Photoshop', 'Illustrator', 'CorelDRAW', '品牌设计'],
    designStyle: ['品牌视觉', '创意插画', '印刷品设计'],
    level: '中级',
    status: '在职',
    projectCount: 38,
    joinDate: '2020-03-18'
  },
  {
    id: 'DESIGN003',
    name: '郑雯',
    gender: '女',
    age: 33,
    phone: '13900139003',
    email: 'zhengwen@example.com',
    education: '硕士',
    experience: '9年',
    specialty: '动效设计',
    skills: ['After Effects', 'Premiere', 'C4D', '交互设计'],
    designStyle: ['动态视觉', '3D建模', '产品展示'],
    level: '高级',
    status: '在职',
    projectCount: 45,
    joinDate: '2015-11-25'
  },
  {
    id: 'DESIGN004',
    name: '钱峰',
    gender: '男',
    age: 29,
    phone: '13900139004',
    email: 'qianfeng@example.com',
    education: '本科',
    experience: '6年',
    specialty: '网页设计',
    skills: ['HTML/CSS', 'JavaScript', 'Bootstrap', '响应式设计'],
    designStyle: ['前端实现', '网页交互', '电商设计'],
    level: '中级',
    status: '在职',
    projectCount: 40,
    joinDate: '2018-05-12'
  },
  {
    id: 'DESIGN005',
    name: '孙艺',
    gender: '女',
    age: 36,
    phone: '13900139005',
    email: 'sunyi@example.com',
    education: '本科',
    experience: '12年',
    specialty: '创意总监',
    skills: ['创意指导', '团队管理', '提案演讲', '趋势分析'],
    designStyle: ['品牌策略', '创意方向', '整合设计'],
    level: '资深',
    status: '在职',
    projectCount: 78,
    joinDate: '2012-07-30'
  }
]

// 工程师数据
export const mockEngineers = [
  {
    id: 'ENG001',
    name: '张开发',
    gender: '男',
    age: 30,
    phone: '13700137001',
    email: 'zhangkaifa@example.com',
    education: '本科',
    experience: '7年',
    specialty: '前端开发',
    techStack: ['React', 'Vue', 'JavaScript', 'TypeScript'],
    level: '高级',
    status: '在职',
    projectCount: 32,
    joinDate: '2017-12-01'
  },
  {
    id: 'ENG002',
    name: '李后端',
    gender: '男',
    age: 35,
    phone: '13700137002',
    email: 'lihoutai@example.com',
    education: '硕士',
    experience: '10年',
    specialty: '后端开发',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    level: '资深',
    status: '在职',
    projectCount: 45,
    joinDate: '2015-08-15'
  },
  {
    id: 'ENG003',
    name: '王全栈',
    gender: '男',
    age: 28,
    phone: '13700137003',
    email: 'wangquanzhan@example.com',
    education: '本科',
    experience: '5年',
    specialty: '全栈开发',
    techStack: ['Node.js', 'React', 'MongoDB', 'Express'],
    level: '中级',
    status: '在职',
    projectCount: 20,
    joinDate: '2019-05-20'
  },
  {
    id: 'ENG004',
    name: '陈测试',
    gender: '女',
    age: 27,
    phone: '13700137004',
    email: 'chenceshi@example.com',
    education: '本科',
    experience: '4年',
    specialty: '测试工程师',
    techStack: ['Selenium', 'JMeter', 'Postman', 'Python'],
    level: '中级',
    status: '在职',
    projectCount: 18,
    joinDate: '2020-03-10'
  },
  {
    id: 'ENG005',
    name: '赵运维',
    gender: '男',
    age: 32,
    phone: '13700137005',
    email: 'zhaoyunwei@example.com',
    education: '大专',
    experience: '8年',
    specialty: '运维工程师',
    techStack: ['Docker', 'Kubernetes', 'Linux', 'AWS'],
    level: '高级',
    status: '离职',
    projectCount: 25,
    joinDate: '2016-11-25'
  }
]

// 摄影师数据
export const mockPhotographers = [
  {
    id: 'PHOTO001',
    name: '刘摄影',
    gender: '男',
    age: 32,
    phone: '13800138001',
    email: 'liusheying@example.com',
    education: '大专',
    experience: '8年',
    photographyStyle: ['人像', '时尚', '广告'],
    equipment: ['Canon R5', 'Nikon Z7', 'DJI Mavic 3'],
    level: '高级',
    status: '在职',
    projectCount: 56,
    joinDate: '2016-03-15'
  },
  {
    id: 'PHOTO002',
    name: '王纪实',
    gender: '男',
    age: 28,
    phone: '13800138002',
    email: 'wangjishi@example.com',
    education: '本科',
    experience: '5年',
    photographyStyle: ['纪实', '风光', '旅行'],
    equipment: ['Sony A7R IV', 'Fujifilm X-T4'],
    level: '中级',
    status: '在职',
    projectCount: 32,
    joinDate: '2019-06-20'
  },
  {
    id: 'PHOTO003',
    name: '陈婚礼',
    gender: '女',
    age: 30,
    phone: '13800138003',
    email: 'chenhunli@example.com',
    education: '本科',
    experience: '6年',
    photographyStyle: ['婚礼', '人像', '婚纱'],
    equipment: ['Canon 5D Mark IV', 'Sony A7 III'],
    level: '高级',
    status: '在职',
    projectCount: 48,
    joinDate: '2018-09-10'
  },
  {
    id: 'PHOTO004',
    name: '张产品',
    gender: '男',
    age: 35,
    phone: '13800138004',
    email: 'zhangchanpin@example.com',
    education: '本科',
    experience: '10年',
    photographyStyle: ['产品', '商业', '广告'],
    equipment: ['Phase One XF', 'Canon EOS R3'],
    level: '资深',
    status: '在职',
    projectCount: 76,
    joinDate: '2014-01-05'
  },
  {
    id: 'PHOTO005',
    name: '李风景',
    gender: '男',
    age: 40,
    phone: '13800138005',
    email: 'lifengjing@example.com',
    education: '大专',
    experience: '15年',
    photographyStyle: ['风光', '自然', '野生动物'],
    equipment: ['Nikon D850', 'DJI Inspire 2'],
    level: '资深',
    status: '离职',
    projectCount: 92,
    joinDate: '2010-07-22'
  }
]

// 人才概览统计数据
export const talentOverviewStats = {
  totalTalent: 20,
  activeTalent: 18,
  totalProjects: 590,
  averageSuccessRate: '92%',
  talentByDepartment: {
    planners: mockPlanners.length,
    designers: mockDesigners.length,
    engineers: mockEngineers.length,
    photographers: mockPhotographers.length
  },
  talentByLevel: {
    junior: 2,
    mid: 6,
    senior: 8,
    expert: 4
  },
  talentByStatus: {
    active: mockPlanners.filter(p => p.status === '在职').length + 
            mockDesigners.filter(d => d.status === '在职').length + 
            mockEngineers.filter(e => e.status === '在职').length + 
            mockPhotographers.filter(p => p.status === '在职').length,
    onLeave: 0,
    resigned: mockPlanners.filter(p => p.status === '离职').length + 
              mockDesigners.filter(d => d.status === '离职').length + 
              mockEngineers.filter(e => e.status === '离职').length + 
              mockPhotographers.filter(p => p.status === '离职').length
  },
  recentJoinTalents: [
    mockPlanners[3],
    mockDesigners[1],
    mockEngineers[2],
    mockEngineers[3],
    mockPhotographers[1]
  ].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5)
}

// 所有人才数据的导出，用于统一管理
export const allTalentData = {
  planners: mockPlanners,
  designers: mockDesigners,
  engineers: mockEngineers,
  photographers: mockPhotographers,
  overview: talentOverviewStats
}

export default allTalentData