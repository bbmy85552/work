// 落地案例库模拟数据
const caseData = {
  cases: [
    {
      id: 'case-001',
      projectName: '北京第一中学智慧校园建设',
      schoolName: '北京第一中学',
      schoolType: '重点中学',
      region: '北京',
      completionDate: '2024-06-15',
      projectManager: '张三',
      description: '为北京第一中学打造的全方位智慧校园解决方案，包括智能教学系统、校园安防管理、校园一卡通等多个模块。项目涵盖了全校3000多名师生，实现了教学、管理、生活的全面智能化。通过本次建设，学校的教学效率提升了35%，管理成本降低了20%。',
      achievements: '1. 构建了基于5G网络的校园物联网平台\n2. 实施了AI辅助教学系统，覆盖12个学科\n3. 建设了校园安全智能预警系统，事故发生率降低80%\n4. 实现了校园管理的数字化，办公效率提升50%\n5. 获得了教育部智慧校园示范校称号',
      categories: ['智慧校园', 'AI教学', '校园安防', '数字化管理'],
      coverImage: '/campus-buildings/001.png',
      galleryImages: [
        '/campus-buildings/001.png'
      ]
    },
    {
      id: 'case-002',
      projectName: '上海实验小学数字化教学平台',
      schoolName: '上海实验小学',
      schoolType: '示范小学',
      region: '上海',
      completionDate: '2024-05-20',
      projectManager: '李四',
      description: '针对上海实验小学的特点，定制开发了适合小学生的数字化教学平台。平台融合了游戏化教学、互动课堂、家校共育等功能，极大提升了学生的学习兴趣和参与度。该项目覆盖了学校2000余名学生和150名教师，获得了良好的教学效果反馈。',
      achievements: '1. 开发了300余节互动课件，覆盖主要学科\n2. 建设了家校共育平台，家长参与度提升90%\n3. 学生学习积极性提升60%，课堂互动率提高45%\n4. 教师备课时间减少30%，教学质量提升25%\n5. 成为上海市教育信息化标杆项目',
      categories: ['数字化教学', '游戏化学习', '家校共育'],
      coverImage: '/campus-buildings/002.png',
      galleryImages: [
        '/campus-buildings/002.png'
      ]
    },
    {
      id: 'case-003',
      projectName: '广州第三中学AI实验室建设',
      schoolName: '广州第三中学',
      schoolType: '普通中学',
      region: '广东',
      completionDate: '2024-04-10',
      projectManager: '王五',
      description: '为广州第三中学建设的AI创新实验室，配备了先进的AI教学设备和软件平台。实验室支持AI基础教学、编程实践、机器人竞赛培训等多种功能，为学生提供了前沿科技的学习环境。通过这个平台，学生在各类AI和机器人竞赛中取得了优异成绩。',
      achievements: '1. 建设了可容纳50人的AI创新实验室\n2. 开发了AI基础课程体系，覆盖编程、机器学习、计算机视觉等\n3. 学生在省级机器人竞赛中获得3个一等奖\n4. 培养了10名AI特长生，被重点高校提前录取\n5. 成为广东省科普教育基地',
      categories: ['AI教育', '科技创新', '实验室建设'],
      coverImage: '/campus-buildings/003.png',
      galleryImages: [
        '/campus-buildings/003.png'
      ]
    },
    {
      id: 'case-004',
      projectName: '深圳外国语学校智能翻译系统',
      schoolName: '深圳外国语学校',
      schoolType: '重点中学',
      region: '广东',
      completionDate: '2024-03-25',
      projectManager: '赵六',
      description: '为深圳外国语学校开发的多语言智能翻译系统，支持20多种语言的实时翻译。系统应用于国际交流、外语教学、校园参观等场景，极大提升了学校的国际化水平和教学效率。该系统还集成了语音识别、自然语言处理等先进技术。',
      achievements: '1. 实现了20+种语言的实时翻译\n2. 准确率达到95%以上，响应时间少于0.5秒\n3. 支持文本、语音、图片多种输入方式\n4. 与教学系统集成，提升外语教学效果\n5. 促进了学校与10多个国家的教育交流',
      categories: ['智能翻译', '国际教育', 'AI应用'],
      coverImage: '/campus-buildings/004.jpg',
      galleryImages: [
        '/campus-buildings/004.jpg'
      ]
    },
    {
      id: 'case-005',
      projectName: '杭州育才中学智慧图书馆建设',
      schoolName: '杭州育才中学',
      schoolType: '示范中学',
      region: '浙江',
      completionDate: '2024-02-18',
      projectManager: '钱七',
      description: '为杭州育才中学打造的智慧图书馆解决方案，实现了图书管理的全流程智能化。包括智能借阅系统、图书推荐算法、阅读数据分析等功能。该项目使图书馆的管理效率大幅提升，同时 BASIS了学生的阅读兴趣，借阅量增长了40%。',
      achievements: '1. 实现了RFID自助借还书系统\n2. 开发了基于学生兴趣的智能图书推荐系统\n3. 建设了数字资源库，包含5万余册电子图书\n4. 图书馆管理效率提升60%，人力成本降低30%\n5. 学生阅读量提升40%，阅读习惯养成率提高55%',
      categories: ['智慧图书馆', '阅读推广', '数据分析'],
      coverImage: '/campus-buildings/005.jpg',
      galleryImages: [
        '/campus-buildings/005.jpg'
      ]
    },
    {
      id: 'case-006',
      projectName: '成都七中校园健康监测系统',
      schoolName: '成都七中',
      schoolType: '重点中学',
      region: '四川',
      completionDate: '2024-01-30',
      projectManager: '孙八',
      description: '为成都七中建设的校园健康监测系统，整合了智能晨检、环境监测、体质健康数据分析等功能。系统通过物联网设备实时监测学生健康状况和校园环境质量，为学校提供数据支持和预警服务。该项目有效提升了学校的健康管理水平。',
      achievements: '1. 实现了非接触式智能晨检，覆盖全校师生\n2. 在校园内安装了20个环境监测点，实时监测空气质量\n3. 建立了学生健康数据库，提供个性化健康建议\n4. 疾病预警准确率达到90%，传染病发生率降低60%\n5. 获得四川省学校健康管理创新奖',
      categories: ['健康监测', '物联网', '数据分析'],
      coverImage: '/campus-buildings/006.jpg',
      galleryImages: [
        '/campus-buildings/006.jpg'
      ]
    },
    {
      id: 'case-007',
      projectName: '天津南开中学VR教学实验室',
      schoolName: '天津南开中学',
      schoolType: '重点中学',
      region: '天津',
      completionDate: '2024-07-10',
      projectManager: '周九',
      description: '为天津南开中学建设的VR教学实验室，覆盖物理、化学、生物等多学科虚拟实验教学。通过沉浸式体验，让学生能够安全地进行各种实验操作，极大提升了教学效果和学生参与度。',
      achievements: '1. 建设了50座VR教学实验室\n2. 开发了120+门VR实验课程\n3. 实验教学安全性提升100%\n4. 学生实验参与率提高85%\n5. 成为天津市VR教育示范基地',
      categories: ['VR教学', '实验教学', '沉浸式学习'],
      coverImage: '/campus-buildings/007.jpg',
      galleryImages: [
        '/campus-buildings/007.jpg'
      ]
    },
    {
      id: 'case-008',
      projectName: '重庆巴蜀小学智慧课堂建设',
      schoolName: '重庆巴蜀小学',
      schoolType: '示范小学',
      region: '重庆',
      completionDate: '2024-07-05',
      projectManager: '吴十',
      description: '为重庆巴蜀小学打造的智慧课堂解决方案，通过交互式教学设备和教学平台，实现了课堂教学的智能化、个性化。项目覆盖了学校所有班级，提升了教学质量和学生学习效果。',
      achievements: '1. 建设了45间智慧教室\n2. 实现了常态化录播和课堂分析\n3. 开发了基于大数据的教学评估系统\n4. 教师备课效率提升50%\n5. 学生学习积极性提升70%',
      categories: ['智慧课堂', '教学评估', '数据分析'],
      coverImage: '/campus-buildings/008.jpg',
      galleryImages: [
        '/campus-buildings/008.jpg'
      ]
    },
    {
      id: 'case-009',
      projectName: '武汉华中师范大学附属中学智能排课系统',
      schoolName: '华中师范大学附属中学',
      schoolType: '重点中学',
      region: '湖北',
      completionDate: '2024-06-30',
      projectManager: '郑十一',
      description: '为华中师范大学附属中学开发的智能排课系统，基于AI算法优化课程安排，解决了传统排课中的冲突问题，提高了教学资源利用率。该系统考虑了教师偏好、教室资源、学生需求等多维度因素。',
      achievements: '1. 开发了AI智能排课引擎\n2. 排课时间从3天缩短至30分钟\n3. 课程冲突率降低100%\n4. 教学资源利用率提升30%\n5. 教师满意度达到95%',
      categories: ['智能排课', '教育信息化', '资源优化'],
      coverImage: '/campus-buildings/009.jpg',
      galleryImages: [
        '/campus-buildings/009.jpg'
      ]
    },
    {
      id: 'case-010',
      projectName: '西安交大附中校园信息门户建设',
      schoolName: '西安交大附中',
      schoolType: '重点中学',
      region: '陕西',
      completionDate: '2024-06-25',
      projectManager: '王十二',
      description: '为西安交大附中打造的校园信息门户，集成了教学管理、学生服务、校园生活等多种功能，实现了校园信息的一站式服务。门户采用响应式设计，支持多终端访问，为师生提供便捷的信息获取渠道。',
      achievements: '1. 建设了统一的校园信息门户\n2. 集成了15个业务系统\n3. 实现了单点登录功能\n4. 信息查询效率提升80%\n5. 用户满意度达到92%',
      categories: ['信息门户', '系统集成', '响应式设计'],
      coverImage: '/campus-buildings/010.jpg',
      galleryImages: [
        '/campus-buildings/010.jpg'
      ]
    },
    {
      id: 'case-011',
      projectName: '南京外国语学校智慧考试系统',
      schoolName: '南京外国语学校',
      schoolType: '重点中学',
      region: '江苏',
      completionDate: '2024-06-20',
      projectManager: '李十三',
      description: '为南京外国语学校开发的智慧考试系统，支持在线考试、智能组卷、自动评阅等功能。系统采用先进的防作弊技术，确保考试的公平公正。该项目覆盖了学校各类考试，提高了考试效率和管理水平。',
      achievements: '1. 开发了智能化考试平台\n2. 实现了多维度自动评卷\n3. 考试组织时间缩短60%\n4. 减少人工评卷工作量80%\n5. 考试安全性显著提升',
      categories: ['智慧考试', '自动评卷', '教育信息化'],
      coverImage: '/campus-buildings/011.jpg',
      galleryImages: [
        '/campus-buildings/011.jpg'
      ]
    },
    {
      id: 'case-012',
      projectName: '青岛实验小学创客空间建设',
      schoolName: '青岛实验小学',
      schoolType: '示范小学',
      region: '山东',
      completionDate: '2024-06-18',
      projectManager: '张十四',
      description: '为青岛实验小学建设的创客空间，配备了3D打印机、激光切割机、机器人等先进设备，为学生提供了创意实践的平台。空间支持STEM教育、编程教育、创新设计等多种活动，培养学生的创新能力和实践能力。',
      achievements: '1. 建设了600平方米创客空间\n2. 配备了50+台先进设备\n3. 开发了30门创客课程\n4. 学生参与率达到100%\n5. 获得全国创客教育示范校称号',
      categories: ['创客空间', 'STEM教育', '创新实践'],
      coverImage: '/campus-buildings/012.jpg',
      galleryImages: [
        '/campus-buildings/012.jpg'
      ]
    },
    {
      id: 'case-013',
      projectName: '长沙一中校园安防系统升级',
      schoolName: '长沙第一中学',
      schoolType: '重点中学',
      region: '湖南',
      completionDate: '2024-06-10',
      projectManager: '刘十五',
      description: '为长沙第一中学进行的校园安防系统升级，采用了人脸识别、行为分析、智能预警等先进技术，构建了全方位、多层次的校园安全防护体系。系统实现了对校园安全的实时监控和智能管理。',
      achievements: '1. 升级了100+个高清摄像头\n2. 部署了人脸识别系统\n3. 实现了行为异常智能预警\n4. 安全事件响应时间缩短80%\n5. 校园安全指数提升95%',
      categories: ['校园安防', '智能监控', '安全管理'],
      coverImage: '/campus-buildings/013.jpg',
      galleryImages: [
        '/campus-buildings/013.jpg'
      ]
    },
    {
      id: 'case-014',
      projectName: '厦门双十中学体质健康管理系统',
      schoolName: '厦门双十中学',
      schoolType: '重点中学',
      region: '福建',
      completionDate: '2024-06-05',
      projectManager: '陈十六',
      description: '为厦门双十中学开发的体质健康管理系统，整合了学生体质数据采集、分析、评估等功能。系统通过智能设备自动采集学生体质数据，生成个性化的健康报告和运动建议，促进学生体质健康水平提升。',
      achievements: '1. 实现了体质数据自动采集\n2. 开发了健康数据分析平台\n3. 建立了学生健康档案\n4. 学生体质达标率提升25%\n5. 体育教学针对性提高60%',
      categories: ['健康管理', '数据分析', '体育教育'],
      coverImage: '/campus-buildings/014.jpg',
      galleryImages: [
        '/campus-buildings/014.jpg'
      ]
    },
    {
      id: 'case-015',
      projectName: '郑州外国语学校智能财务管理系统',
      schoolName: '郑州外国语学校',
      schoolType: '重点中学',
      region: '河南',
      completionDate: '2024-05-30',
      projectManager: '杨十七',
      description: '为郑州外国语学校开发的智能财务管理系统，实现了预算管理、报销管理、资产管理等功能。系统采用了智能审批流程和数据分析功能，提高了学校财务管理的效率和透明度。',
      achievements: '1. 实现了财务流程自动化\n2. 开发了智能预算分析功能\n3. 建立了资产全生命周期管理\n4. 财务管理效率提升70%\n5. 资金使用透明度提高90%',
      categories: ['财务管理', '系统集成', '流程优化'],
      coverImage: '/campus-buildings/015.jpg',
      galleryImages: [
        '/campus-buildings/015.jpg'
      ]
    },
    {
      id: 'case-016',
      projectName: '合肥一中校园物联网平台',
      schoolName: '合肥第一中学',
      schoolType: '重点中学',
      region: '安徽',
      completionDate: '2024-05-25',
      projectManager: '黄十八',
      description: '为合肥第一中学建设的校园物联网平台，通过物联网技术实现了对校园设施、环境、设备等的智能监控和管理。平台涵盖了智能照明、智能空调、智能水电等多个系统，实现了校园的节能减排和智能化管理。',
      achievements: '1. 部署了1000+个物联网节点\n2. 实现了能耗智能监控\n3. 建设了智能设备管理平台\n4. 校园能耗降低30%\n5. 设备维护效率提升60%',
      categories: ['物联网', '节能减排', '智能管理'],
      coverImage: '/campus-buildings/016.jpg',
      galleryImages: [
        '/campus-buildings/016.jpg'
      ]
    },
    {
      id: 'case-017',
      projectName: '南昌二中数字化校园建设',
      schoolName: '南昌第二中学',
      schoolType: '重点中学',
      region: '江西',
      completionDate: '2024-05-20',
      projectManager: '周十九',
      description: '为南昌第二中学进行的数字化校园建设，包括校园网络升级、数据中心建设、应用系统集成等多个方面。项目实现了校园信息系统的互联互通和数据共享，提升了学校的信息化水平。',
      achievements: '1. 升级了万兆校园网络\n2. 建设了虚拟化数据中心\n3. 集成了10个业务系统\n4. 信息系统响应速度提升50%\n5. 数据共享效率提高80%',
      categories: ['数字化校园', '网络建设', '系统集成'],
      coverImage: '/campus-buildings/017.jpg',
      galleryImages: [
        '/campus-buildings/017.jpg'
      ]
    },
    {
      id: 'case-018',
      projectName: '昆明师范大学附属中学AI学情分析系统',
      schoolName: '昆明师范大学附属中学',
      schoolType: '重点中学',
      region: '云南',
      completionDate: '2024-05-15',
      projectManager: '吴二十',
      description: '为昆明师范大学附属中学开发的AI学情分析系统，通过收集和分析学生的学习数据，实现了个性化学习诊断和精准教学。系统能够识别学生的知识掌握情况和学习瓶颈，为教师提供教学决策支持。',
      achievements: '1. 开发了AI学情分析模型\n2. 实现了个性化学习诊断\n3. 建立了知识图谱\n4. 学生成绩提升15%\n5. 教师教学针对性提高70%',
      categories: ['AI教育', '学情分析', '个性化学习'],
      coverImage: '/campus-buildings/018.jpg',
      galleryImages: [
        '/campus-buildings/018.jpg'
      ]
    },
    {
      id: 'case-019',
      projectName: '贵阳一中智慧后勤管理系统',
      schoolName: '贵阳第一中学',
      schoolType: '重点中学',
      region: '贵州',
      completionDate: '2024-05-10',
      projectManager: '郑二十一',
      description: '为贵阳第一中学开发的智慧后勤管理系统，覆盖了食堂管理、宿舍管理、维修服务等多个方面。系统通过智能化手段提升了后勤服务质量和效率，为师生提供了更好的校园生活体验。',
      achievements: '1. 实现了智慧食堂管理\n2. 开发了智能宿舍管理系统\n3. 建立了维修服务工单系统\n4. 后勤服务满意度提升40%\n5. 管理效率提高60%',
      categories: ['智慧后勤', '服务管理', '系统集成'],
      coverImage: '/campus-buildings/019.jpg',
      galleryImages: [
        '/campus-buildings/019.jpg'
      ]
    },
    {
      id: 'case-020',
      projectName: '南宁三中校园文化数字化建设',
      schoolName: '南宁第三中学',
      schoolType: '重点中学',
      region: '广西',
      completionDate: '2024-05-05',
      projectManager: '王二十二',
      description: '为南宁第三中学进行的校园文化数字化建设，通过数字媒体、虚拟现实等技术，将学校的历史文化、校园精神等进行数字化呈现。项目包括数字校史馆、文化墙、VR校园导览等多个模块。',
      achievements: '1. 建设了数字校史馆\n2. 开发了VR校园导览系统\n3. 制作了校园文化数字资源库\n4. 校园文化传播效果提升80%\n5. 新生文化认同感增强70%',
      categories: ['文化建设', '数字媒体', 'VR应用'],
      coverImage: '/campus-buildings/020.jpg',
      galleryImages: [
        '/campus-buildings/020.jpg'
      ]
    },
    {
      id: 'case-021',
      projectName: '石家庄二中智能实验教学平台',
      schoolName: '石家庄第二中学',
      schoolType: '重点中学',
      region: '河北',
      completionDate: '2024-04-30',
      projectManager: '李二十三',
      description: '为石家庄第二中学开发的智能实验教学平台，整合了实验教学资源、实验预约、实验指导、实验报告等功能。平台支持虚拟实验和实际实验相结合的教学模式，提升了实验教学效果。',
      achievements: '1. 开发了实验教学资源库\n2. 实现了智能实验预约系统\n3. 建设了虚拟实验平台\n4. 实验教学效率提升60%\n5. 学生实验技能提高40%',
      categories: ['实验教学', '虚拟实验', '教学平台'],
      coverImage: '/campus-buildings/021.jpg',
      galleryImages: [
        '/campus-buildings/021.jpg'
      ]
    },
    {
      id: 'case-022',
      projectName: '太原五中家校共育平台',
      schoolName: '太原第五中学',
      schoolType: '重点中学',
      region: '山西',
      completionDate: '2024-04-25',
      projectManager: '张二十四',
      description: '为太原第五中学开发的家校共育平台，加强了学校与家长之间的沟通与协作。平台支持学生信息共享、作业布置、成绩查询、家长参与学校活动等功能，构建了家校共育的良好环境。',
      achievements: '1. 实现了家校信息实时共享\n2. 开发了智能作业管理功能\n3. 建设了家长参与学校活动平台\n4. 家校沟通效率提升90%\n5. 家长满意度达到95%',
      categories: ['家校共育', '信息共享', '教育服务'],
      coverImage: '/campus-buildings/022.jpg',
      galleryImages: [
        '/campus-buildings/022.jpg'
      ]
    },
    {
      id: 'case-023',
      projectName: '兰州一中校园一卡通系统',
      schoolName: '兰州第一中学',
      schoolType: '重点中学',
      region: '甘肃',
      completionDate: '2024-04-20',
      projectManager: '刘二十五',
      description: '为兰州第一中学建设的校园一卡通系统，实现了校园内身份识别、消费支付、图书借阅、门禁管理等多种功能的一卡通用。系统采用了非接触式IC卡技术，为师生提供了便捷的校园生活服务。',
      achievements: '1. 实现了校园一卡通全覆盖\n2. 集成了10个应用系统\n3. 开发了在线充值和消费查询功能\n4. 校园服务效率提升80%\n5. 现金使用减少90%',
      categories: ['校园一卡通', '身份认证', '支付服务'],
      coverImage: '/campus-buildings/023.png',
      galleryImages: [
        '/campus-buildings/023.png'
      ]
    },
    {
      id: 'case-024',
      projectName: '银川一中智能体育场馆管理系统',
      schoolName: '银川第一中学',
      schoolType: '重点中学',
      region: '宁夏',
      completionDate: '2024-04-15',
      projectManager: '陈二十六',
      description: '为银川第一中学开发的智能体育场馆管理系统，实现了体育场馆的预约、使用、管理等功能。系统支持在线预约、智能照明控制、能耗监测等功能，提高了体育场馆的使用效率和管理水平。',
      achievements: '1. 实现了体育场馆智能预约\n2. 开发了场馆使用数据分析功能\n3. 建设了智能照明控制系统\n4. 场馆使用效率提升60%\n5. 能耗降低30%',
      categories: ['场馆管理', '智能控制', '数据分析'],
      coverImage: '/campus-buildings/024.jpg',
      galleryImages: [
        '/campus-buildings/024.jpg'
      ]
    },
    {
      id: 'case-025',
      projectName: '西宁二中数字校园广播系统',
      schoolName: '西宁第二中学',
      schoolType: '重点中学',
      region: '青海',
      completionDate: '2024-04-08',
      projectManager: '杨二十七',
      description: '为西宁第二中学建设的数字校园广播系统，采用了IP网络技术，实现了分区控制、定时播放、紧急广播等功能。系统支持多音源、多区域的灵活控制，为学校的日常教学和管理提供了便利。',
      achievements: '1. 实现了数字化广播全覆盖\n2. 开发了分区控制和定时播放功能\n3. 建设了紧急广播系统\n4. 广播覆盖质量提升100%\n5. 管理效率提高80%',
      categories: ['校园广播', '数字化建设', '智能控制'],
      coverImage: '/campus-buildings/025.jpg',
      galleryImages: [
        '/campus-buildings/025.jpg'
      ]
    },
    {
      id: 'case-026',
      projectName: '乌鲁木齐一中智慧教室建设',
      schoolName: '乌鲁木齐第一中学',
      schoolType: '重点中学',
      region: '新疆',
      completionDate: '2024-04-05',
      projectManager: '黄二十八',
      description: '为乌鲁木齐第一中学建设的智慧教室，配备了交互式教学一体机、智能录播系统、环境智能控制系统等先进设备。教室支持翻转课堂、混合式教学等多种教学模式，提升了教学效果和学习体验。',
      achievements: '1. 建设了30间智慧教室\n2. 实现了智能环境控制\n3. 开发了课堂教学分析系统\n4. 教学互动效果提升70%\n5. 教学资源共享效率提高90%',
      categories: ['智慧教室', '教学设备', '环境控制'],
      coverImage: '/campus-buildings/026.jpg',
      galleryImages: [
        '/campus-buildings/026.jpg'
      ]
    },
    {
      id: 'case-027',
      projectName: '拉萨中学多媒体教学系统',
      schoolName: '拉萨中学',
      schoolType: '重点中学',
      region: '西藏',
      completionDate: '2024-04-01',
      projectManager: '周二十九',
      description: '为拉萨中学建设的多媒体教学系统，覆盖了全校所有班级，提供了视频点播、课件展示、交互式教学等功能。系统考虑了当地网络环境和教学需求，提供了离线教学资源支持，确保了教学活动的顺利开展。',
      achievements: '1. 实现了多媒体教学全覆盖\n2. 建设了本地教学资源库\n3. 开发了离线学习支持功能\n4. 教学效果提升60%\n5. 教师信息化教学能力提高80%',
      categories: ['多媒体教学', '资源建设', '教育信息化'],
      coverImage: '/campus-buildings/027.jpg',
      galleryImages: [
        '/campus-buildings/027.jpg'
      ]
    },
    {
      id: 'case-028',
      projectName: '海口oneday校园信息发布系统',
      schoolName: '海口一天中学',
      schoolType: '重点中学',
      region: '海南',
      completionDate: '2024-03-28',
      projectManager: '吴三十',
      description: '为海口一天中学开发的校园信息发布系统，整合了LED显示屏、数字标牌、移动应用等多种发布渠道。系统支持统一管理、实时发布、多媒体展示等功能，提高了校园信息传播的效率和效果。',
      achievements: '1. 实现了多渠道信息发布\n2. 开发了统一的内容管理平台\n3. 建设了信息发布审核流程\n4. 信息传播效率提升90%\n5. 信息展示效果提高80%',
      categories: ['信息发布', '数字媒体', '内容管理'],
      coverImage: '/campus-buildings/028.jpg',
      galleryImages: [
        '/campus-buildings/028.jpg'
      ]
    },
    {
      id: 'case-029',
      projectName: '香港中文大学（深圳）附属学校智能校园建设',
      schoolName: '香港中文大学（深圳）附属学校',
      schoolType: '国际学校',
      region: '广东',
      completionDate: '2024-03-25',
      projectManager: '郑三十一',
      description: '为香港中文大学（深圳）附属学校建设的智能校园项目，融合了国际先进教育理念和人工智能技术，构建了面向未来的智慧教育生态。项目包括智能教学系统、国际课程资源平台、跨文化交流系统等多个模块。',
      achievements: '1. 构建了智能化教育生态系统\n2. 开发了国际课程资源平台\n3. 实现了跨文化交流功能\n4. 教学质量达到国际先进水平\n5. 获得国际教育创新奖',
      categories: ['国际教育', '智能校园', '跨文化交流'],
      coverImage: '/campus-buildings/032.jpg',
      galleryImages: [
        '/campus-buildings/032.jpg'
      ]
    },
    {
      id: 'case-030',
      projectName: '澳门濠江中学STEM教育基地建设',
      schoolName: '澳门濠江中学',
      schoolType: '普通中学',
      region: '澳门',
      completionDate: '2024-03-20',
      projectManager: '王三十二',
      description: '为澳门濠江中学建设的STEM教育基地，配备了先进的科学实验设备、编程机器人、3D打印设备等。基地提供了系统化的STEM课程和实践活动，培养学生的科学探究能力、创新思维和实践能力。',
      achievements: '1. 建设了1000平方米STEM教育基地\n2. 配备了200+套先进设备\n3. 开发了50门STEM课程\n4. 学生参与率达到100%\n5. 在国际STEM竞赛中获得多个奖项',
      categories: ['STEM教育', '创新实践', '实验教学'],
      coverImage: '/campus-buildings/030.jpg',
      galleryImages: [
        '/campus-buildings/030.jpg'
      ]
    }
  ]
};

export default caseData;