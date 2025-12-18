const aiResearchCenterData = {
  // 大数据技术能力
  bigDataCapabilities: [
    {
      id: 'bd-001',
      title: '海量数据处理引擎',
      description: '支持TB级数据实时处理，毫秒级响应，适用于教育大数据分析',
      technologies: ['Apache Flink', 'Kafka Streams', 'ClickHouse'],
      performance: '处理速度: 12.8万TPS',
      status: '已成熟应用'
    },
    {
      id: 'bd-002',
      title: 'AI模型训练平台',
      description: '分布式深度学习训练平台，支持多GPU并行训练',
      technologies: ['PyTorch', 'Horovod', 'Ray'],
      performance: '训练效率提升: 284.7%',
      status: '研发中'
    },
    {
      id: 'bd-003',
      title: '智能数据湖',
      description: '统一数据存储与分析平台，支持结构化/半结构化数据',
      technologies: ['Delta Lake', 'Presto', 'Iceberg'],
      performance: '查询性能: 9.4倍提升',
      status: '已成熟应用'
    },
    {
      id: 'bd-004',
      title: '实时数据管道',
      description: '数据采集、清洗、传输一体化解决方案',
      technologies: ['Apache Kafka', 'Debezium', 'Airflow'],
      performance: '数据延迟: <100ms',
      status: '已成熟应用'
    }
  ],

  // 产品竞争力分析
  productCompetitiveness: {
    marketAnalysis: [
      {
        productType: 'AI教育机器人',
        marketSize: '预计2025年市场规模达487亿元',
        competitors: ['科大讯飞', '百度', '腾讯教育'],
        advantages: [
          '教育场景深度定制',
          '多模态交互领先',
          '内容生态完整',
          '部署成本更低'
        ],
        marketShare: '14.8%',
        growthRate: '34.2% CAGR'
      },
      {
        productType: 'AI智能穿戴',
        marketSize: '校园安全市场规模186亿元',
        competitors: ['华为', '小米', '苹果'],
        advantages: [
          '教育安全场景专精',
          '家校联动能力强',
          '数据合规性高',
          '集成度领先'
        ],
        marketShare: '11.6%',
        growthRate: '27.3% CAGR'
      },
      {
        productType: 'AI大模型平台',
        marketSize: '教育AI市场规模312亿元',
        competitors: ['百度文心', '阿里通义千问', '腾讯混元'],
        advantages: [
          '教育知识图谱完备',
          '垂直领域优化',
          '隐私保护领先',
          '定制化能力强'
        ],
        marketShare: '17.9%',
        growthRate: '41.6% CAGR'
      }
    ],
    competitiveFeatures: [
      {
        feature: '技术领先性',
        score: 9.23,
        description: '在教育AI领域技术领先，拥有自主研发的核心算法'
      },
      {
        feature: '产品体验',
        score: 9.08,
        description: '用户界面友好，交互体验优秀，获得多项设计奖项'
      },
      {
        feature: '服务质量',
        score: 8.76,
        description: '24/7技术支持，平均响应时间小于30分钟'
      },
      {
        feature: '成本优势',
        score: 8.42,
        description: '性价比领先，TCO比竞品低20-30%'
      },
      {
        feature: '定制能力',
        score: 9.47,
        description: '高度定制化，满足不同学校个性化需求'
      }
    ]
  },

  // 研发合作能力
  collaborationCapabilities: [
    {
      type: '产学研合作',
      partners: [
        '清华大学人工智能研究院',
        '北京师范大学教育技术学院',
        '中科院自动化所',
        '多所211/985高校'
      ],
      projects: [
        '智能教育评估系统联合研发',
        '校园AI安全监控技术合作',
        '教育大数据分析平台共建'
      ],
      achievements: '发表论文52篇，申请专利28项'
    },
    {
      type: '产业合作',
      partners: [
        '华为技术有限公司',
        '腾讯教育',
        '科大讯飞',
        '多家知名教育集团'
      ],
      projects: [
        'AI教育解决方案联合开发',
        '智能硬件生态共建',
        '教育云平台技术集成'
      ],
      achievements: '服务学校超过2037所，覆盖学生超120万'
    },
    {
      type: '国际合作',
      partners: [
        '斯坦福大学AI实验室',
        'MIT媒体实验室',
        '新加坡国立大学',
        '多家国际教育机构'
      ],
      projects: [
        '跨文化AI教育研究',
        '国际教育标准对接',
        '全球AI教育最佳实践交流'
      ],
      achievements: '参与国际AI教育标准制定，获得多项国际奖项'
    }
  ],

  // AI研发能力与技术
  aiCapabilities: {
    coreTechnologies: [
      {
        name: '多模态大模型',
        level: '世界领先',
        description: '支持文本、语音、图像、视频多模态理解与生成',
        applications: ['智能问答', '内容生成', '情感识别', '行为分析']
      },
      {
        name: '边缘计算AI',
        level: '行业领先',
        description: '低功耗、高效率的边缘侧AI推理能力',
        applications: ['实时监控', '智能硬件', '隐私保护', '离线可用']
      },
      {
        name: '知识图谱技术',
        level: '国内一流',
        description: '教育领域专业知识图谱构建与应用',
        applications: ['个性化推荐', '智能搜索', '学习路径规划']
      },
      {
        name: '强化学习',
        level: '业界领先',
        description: '自主学习与决策优化技术',
        applications: ['智能调度', '资源优化', '自适应教学']
      }
    ],
    researchDirections: [
      {
        direction: '认知AI与学习科学',
        focus: '结合认知心理学，开发更符合人类学习规律的AI系统',
        progress: '已完成基础研究，正进入产品化阶段'
      },
      {
        direction: '元宇宙教育',
        focus: '构建沉浸式AI教育环境，支持虚拟现实教学',
        progress: '概念验证完成，原型系统开发中'
      },
      {
        direction: 'AI安全与伦理',
        focus: '确保AI系统的安全性、可控性和伦理合规性',
        progress: '建立了完整的AI伦理审查体系'
      },
      {
        direction: '跨模态AI',
        focus: '突破单模态限制，实现多感官协同的AI能力',
        progress: '核心技术突破，应用场景拓展中'
      }
    ],
    patentsAndPublications: {
      patents: 118,
      publications: 83,
      conferences: ['AAAI', 'ICML', 'NeurIPS', 'ACL'],
      awards: [
        '国家科技进步二等奖',
        '教育部科技成果奖',
        '人工智能领域国际奖项'
      ]
    }
  },

  // 研发团队信息
  teamInfo: {
    totalMembers: 183,
    phdRatio: '34.7%',
    seniorResearchers: 47,
    engineers: 122,
    averageExperience: 7.8,
    keyMembers: [
      {
        name: '张教授',
        title: '首席科学家',
        expertise: '深度学习、自然语言处理',
        background: '清华大学博士，斯坦福大学访问学者'
      },
      {
        name: '李博士',
        title: '技术总监',
        expertise: '计算机视觉、机器人技术',
        background: '中科院博士，谷歌AI驻华研究员'
      },
      {
        name: '王教授',
        title: '教育AI总监',
        expertise: '教育技术、学习科学',
        background: '北京师范大学教授，国际教育技术协会副主席'
      }
    ]
  }
};

export default aiResearchCenterData;
