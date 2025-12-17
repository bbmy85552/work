const productLibraryData = {
  categories: [
    {
      key: 'ai-robot',
      name: '人工智能机器人',
      description: '覆盖迎宾导览、课堂互动、陪伴与巡检等场景，支持多模态交互与内容定制。',
      coverImageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/robot0.png',
    },
    {
      key: 'ai-wearable',
      name: 'AI智能穿戴设备',
      description: '面向教育与健康管理的智能穿戴，提供学习辅助、体征监测与安全守护能力。',
      coverImageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/ai_smart_wearable_devices.png',
    },
    {
      key: 'ai-toy',
      name: 'AI 玩具学习与情感陪伴',
      description: '以内容与陪伴为核心，支持语音对话、故事课程与情绪识别等能力。',
      coverImageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/ai_learning_companion_toys.png',
    },
    {
      key: 'ai-agent-llm',
      name: 'AI超级智能体大模型',
      description: '以大模型与智能体为底座，提供知识库问答、流程自动化与行业解决方案。',
      coverImageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/ai_large_language_model.png',
    },
    {
      key: 'ai-software-dev',
      name: 'AI智能软件开发',
      description: '面向教育与企业的AI软件，包括内容平台、教学应用、管理系统与智能化工具。',
      coverImageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/ai_software_development.png',
    },
    {
        key: 'other',
        name: '其他',
        description: '包括AI教育应用、边缘计算盒子、传感器套件等其它产品形态。',
        coverImageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/ai_edge_computing_devices.png',
      },
  ],
  products: [
    {
      id: 'xr-robot-001',
      categoryKey: 'ai-robot',
      name: 'Xuezhi Campus Bot（校园导览机器人）',
      vendor: '星澜智能',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/robot1.png',
      shortIntro: '面向学校展厅/校园大厅的导览与问答机器人，支持中英文讲解与路线导航。',
      detailIntro:
        '本产品面向教育场景的接待与导览需求，提供语音对话、地图导航、活动播报与信息发布能力。可对接学校知识库，实现校史馆/科创中心等场所的智能讲解。',
      highlights: ['多模态交互：语音/屏幕/触控', '支持知识库问答', '场景脚本可配置', '可扩展人脸识别/门禁联动（可选）'],
      specs: {
        适用场景: '校园大厅、校史馆、科创展厅、开放日',
        交付形态: '硬件设备 + 管理后台',
        部署方式: '本地部署/云部署（可选）',
      },
    },
    {
      id: 'xr-robot-002',
      categoryKey: 'ai-robot',
      name: 'Xuezhi ClassMate（课堂互动机器人）',
      vendor: '启学机器人',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/robot2.png',
      shortIntro: '课堂互动与分组活动助手，支持点名、答题、口语练习与课堂节奏引导。',
      detailIntro:
        '通过本地语音识别与内容库，结合课堂活动流程配置，协助老师开展互动教学与分组任务。支持课堂数据统计与导出，便于教研复盘。',
      highlights: ['课堂流程模板', '支持多种互动题型', '课堂数据报表', '离线可用（部分功能）'],
      specs: {
        适用场景: '语音课堂、互动教学、社团活动',
        交付形态: '硬件设备 + 内容库',
        部署方式: '本地部署',
      },
    },
    {
      id: 'wear-001',
      categoryKey: 'ai-wearable',
      name: 'Xuezhi Guardian Band（校园守护手环）',
      vendor: '守望科技',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/campus_guardian_bracelet_wear_001.png',
      shortIntro: '提供定位/电子围栏/紧急求助能力的校园安全手环，支持家校联动。',
      detailIntro:
        '围绕校园安全与管理需求，提供定位、电子围栏、SOS求助、健康基础数据采集与告警。可对接学校管理平台进行设备与人员管理。',
      highlights: ['定位与围栏告警', 'SOS一键求助', '设备分组管理', '数据合规与权限控制'],
      specs: {
        适用场景: '校园安全、活动管理、研学出行',
        交付形态: '硬件设备 + 平台',
        部署方式: '云部署/私有化（可选）',
      },
    },
    {
      id: 'toy-001',
      categoryKey: 'ai-toy',
      name: 'Xuezhi Buddy（学习与陪伴AI玩具）',
      vendor: '童心AI',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/learning_companion_toy_toy_001.png',
      shortIntro: '面向低龄儿童的学习与情感陪伴玩具，支持故事、对话与习惯养成。',
      detailIntro:
        '支持分龄内容推荐、情绪陪伴对话与学习任务激励。提供家长端管理与内容时长控制，适配家庭与校园托育场景。',
      highlights: ['分龄内容与家长管控', '情绪陪伴对话', '习惯养成任务', '内容可定制（可选）'],
      specs: {
        适用场景: '家庭陪伴、托育机构、幼儿园',
        交付形态: '硬件设备 + 内容服务',
        部署方式: '云服务',
      },
    },
    {
      id: 'llm-001',
      categoryKey: 'ai-agent-llm',
      name: 'Xuezhi Agent Hub（校园智能体平台）',
      vendor: '学智AI',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/campus_intelligent_platform_llm_001.png',
      shortIntro: '为学校提供知识库问答、流程自动化与业务助手的智能体平台。',
      detailIntro:
        '以大模型与RAG知识库为底座，提供多智能体编排、工具调用、权限体系与审计。可快速搭建：教务助手、招生咨询、后勤报修助手、校园通知助手等。',
      highlights: ['知识库RAG问答', '智能体编排与工具调用', '权限/审计/敏感词', '多渠道接入（Web/企微/钉钉可选）'],
      specs: {
        适用场景: '招生咨询、教务问答、后勤报修、办公流程',
        交付形态: '软件系统/平台',
        部署方式: '私有化部署优先（可选云）',
      },
    },
    {
      id: 'other-001',
      categoryKey: 'other',
      name: 'Edge AI Box（边缘计算盒）',
      vendor: '云栈科技',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/edge_computing_box_other_001.png',
      shortIntro: '用于校园多媒体与传感数据的边缘侧推理与汇聚，支持断网续传。',
      detailIntro:
        '适用于需要本地推理、低延迟与数据不出域的场景，可承载基础模型推理、视频分析与数据汇聚，并与平台侧进行统一管理。',
      highlights: ['本地推理与低延迟', '断网续传与缓存', '统一设备管理', '可扩展多种传感器接口'],
      specs: {
        适用场景: '边缘推理、设备汇聚、隐私敏感场景',
        交付形态: '硬件设备',
        部署方式: '本地部署',
      },
    },
    {
      id: 'soft-001',
      categoryKey: 'ai-software-dev',
      name: 'Xuezhi Studio（AI教学内容与应用平台）',
      vendor: '学智AI',
      imageUrl: 'https://student-1320907290.cos.ap-guangzhou.myqcloud.com/ai_teaching_content_platform_soft_001.png',
      shortIntro: '面向学校的AI内容管理、课程编排与应用分发平台，支持插件化扩展与权限管控。',
      detailIntro:
        '提供AI教学内容管理、课程编排、课堂应用分发与数据分析能力，支持对接账号体系与统一权限。可按学校需求定制功能模块（如作业、测评、课堂互动、资源库等）。',
      highlights: ['内容管理与课程编排', '插件化扩展与定制开发', '统一账号与权限', '数据分析与运营看板（可选）'],
      specs: {
        适用场景: '教学内容平台、课堂应用分发、资源管理',
        交付形态: '软件系统/平台',
        部署方式: '私有化/云部署（可选）',
      },
    },
  ],
}

export default productLibraryData


