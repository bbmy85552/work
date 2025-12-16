import React, { useState, useEffect } from 'react';
import {
  exportFormats,
  schoolTypes,
  mockCases
} from '../../../mock/aisolutionData';
import { Card, Button, Select, Space, Progress, Input } from 'antd';
const { TextArea } = Input;

const ProposalGenerator = ({ onBack, onNext, solutionData, updateSolutionData }) => {
  const [proposal, setProposal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedExportFormat, setSelectedExportFormat] = useState('ppt');
  const [isExporting, setIsExporting] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState({});

  useEffect(() => {
    // 如果之前已经生成过方案，直接使用
    if (solutionData?.generatedProposal) {
      setProposal(solutionData.generatedProposal);
      setCustomTitle(solutionData.generatedProposal.title || '');
    }
  }, [solutionData]);

  // 生成方案
  const handleGenerateProposal = () => {
    if (!solutionData?.schoolType || !solutionData?.spaceArea || !solutionData?.budget) {
      alert('请确保已完成预算方案确定步骤');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // 模拟生成进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 8; // 8*13=104，确保能达到100%
      setGenerationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        
        // 生成详细方案
        const detailedProposal = generateDetailedProposal();
        setProposal(detailedProposal);
        setCustomTitle(detailedProposal.title);
        
        // 更新解决方案数据
        updateSolutionData({
          detailedProposal: detailedProposal
        });
      }
    }, 250);
  };

  // 生成详细方案
  const generateDetailedProposal = () => {
    const schoolInfo = schoolTypes.find(st => st.value === solutionData.schoolType);
    const schoolName = schoolInfo ? schoolInfo.label : '未知学校类型';
    const spaceArea = solutionData.spaceArea;
    const budget = solutionData.budget;
    const hardwareConfig = solutionData.hardwareConfig || {};
    const designConfig = solutionData.designConfig || {};
    const selectedScenario = designConfig.scenario;
    const selectedTemplate = designConfig.template;
    
    // 计算各项预算分配
    const hardwareCost = Math.round(budget * 0.6);
    const softwareCost = Math.round(budget * 0.2);
    const serviceCost = Math.round(budget * 0.2);
    
    // 获取相关案例
    const relevantCases = mockCases[solutionData.schoolType] || [];
    
    return {
      title: `${schoolName} AI实验室建设方案`,
      schoolInfo: {
        type: schoolName,
        area: spaceArea,
        budget: budget
      },
      generatedAt: new Date().toLocaleString(),
      pages: [
        {
          pageNumber: 1,
          title: '项目概述',
          sections: [
            {
              subtitle: '项目名称和学校信息',
              content: `项目名称：${schoolName} AI实验室建设方案\n建设单位：[学校名称]\n建设地点：[学校地址]\n项目负责人：[负责人姓名]`
            },
            {
              subtitle: '项目背景和建设目标',
              content: `项目背景：\n为响应国家人工智能发展战略，提升学校信息化教学水平，培养学生AI素养和创新能力，特建设专业AI实验室。\n\n建设目标：\n1. 打造符合${schoolName}教学需求的专业AI实验环境\n2. 提供先进的AI教学和实践平台\n3. 支持${spaceArea}平方米空间内的教学活动\n4. 服务于全校师生的AI学习和创新需求`
            },
            {
              subtitle: '项目范围和服务内容',
              content: `项目范围：\n- 硬件设备采购与安装\n- 软件系统部署与配置\n- 网络环境搭建\n- 空间设计与装修\n- 教师培训与技术支持\n\n服务内容：\n- 提供为期3年的设备保修\n- 提供2次教师培训\n- 提供7*24小时技术支持\n- 提供软件升级服务`
            },
            {
              subtitle: '项目亮点和创新点',
              content: `项目亮点：\n1. 采用业界领先的AI硬件设备\n2. 基于${selectedScenario?.name || '标准场景'}的专业设计\n3. 支持多种AI教学场景和应用\n4. 具备良好的扩展性和升级空间\n\n创新点：\n1. 融合${schoolName}特色的AI课程体系\n2. 智能化的教学管理平台\n3. 实践导向的AI项目式学习模式`
            }
          ]
        },
        {
          pageNumber: 2,
          title: '需求分析',
          sections: [
            {
              subtitle: '学校类型和教学需求',
              content: `学校类型：${schoolName}\n教学需求：\n1. ${schoolInfo ? schoolInfo.description : '提供AI基础知识教学'}\n2. 支持日常AI课程教学活动\n3. 满足学生AI项目实践需求\n4. 支持教师AI教学能力提升`
            },
            {
              subtitle: '空间条件和环境要求',
              content: `空间面积：${spaceArea}平方米\n空间布局：采用${selectedTemplate?.name || '标准'}布局\n环境要求：\n- 温度：18-26℃\n- 湿度：40%-60%\n- 供电：稳定三相电，接地良好\n- 网络：千兆光纤接入，无线覆盖`
            },
            {
              subtitle: '预算范围和投资计划',
              content: `总预算：${budget}元\n投资计划：\n- 硬件设备：${hardwareCost}元（60%）\n- 软件系统：${softwareCost}元（20%）\n- 服务费用：${serviceCost}元（20%）\n\n付款方式：${solutionData.paymentMethod || '待定'}`
            },
            {
              subtitle: '预期效果和评估标准',
              content: `预期效果：\n1. 建成符合行业标准的AI实验室\n2. 提升学校AI教学水平\n3. 培养学生AI实践能力\n4. 产出高质量AI教学成果\n\n评估标准：\n1. 硬件设备运行稳定率达到99%\n2. 软件系统满足教学需求\n3. 教师满意度达到90%以上\n4. 学生AI技能明显提升`
            }
          ]
        },
        {
          pageNumber: 3,
          title: '硬件配置方案',
          sections: [
            {
              subtitle: '工作站配置详细清单',
              content: `工作站配置：\n${hardwareConfig.selectedProducts?.filter(p => p.id.startsWith('cpu-')).map(p => `- CPU: ${p.name}（${p.specs}）`).join('\n')}\n${hardwareConfig.selectedProducts?.filter(p => p.id.startsWith('gpu-')).map(p => `- GPU: ${p.name}（${p.specs}）`).join('\n')}\n${hardwareConfig.selectedProducts?.filter(p => p.id.startsWith('memory-')).map(p => `- 内存: ${p.name}（${p.specs}）`).join('\n')}\n${hardwareConfig.selectedProducts?.filter(p => p.id.startsWith('storage-')).map(p => `- 存储: ${p.name}（${p.specs}）`).join('\n')}\n- 显示器：27英寸4K专业显示器\n- 键盘鼠标：专业电竞键鼠套装\n- 数量：${Math.ceil(spaceArea / 25)}台`
            },
            {
              subtitle: '服务器和网络设备配置',
              content: `服务器配置：\n- 型号：企业级AI服务器\n- CPU：Intel Xeon Gold系列\n- 内存：128GB ECC内存\n- 存储：4TB SSD + 12TB HDD\n- GPU：NVIDIA A4000专业卡\n\n网络设备：\n- 核心交换机：千兆网管交换机\n- 无线AP：企业级WiFi 6无线接入点\n- 防火墙：下一代防火墙\n- 路由器：高性能企业路由器`
            },
            {
              subtitle: '硬件性能参数和优势',
              content: `性能参数：\n- AI训练性能：${hardwareConfig.performanceScore || 85}分\n- 并发处理能力：支持${Math.ceil(spaceArea / 25)}名学生同时使用\n- 数据处理速度：满足实时AI应用需求\n\n产品优势：\n- 采用最新一代硬件平台\n- 经过严格的兼容性测试\n- 具备良好的散热和稳定性\n- 支持长期稳定运行`
            },
            {
              subtitle: '硬件兼容性和扩展性',
              content: `兼容性：\n- 所有硬件设备经过兼容性测试\n- 兼容主流AI开发框架和软件\n- 支持Windows和Linux操作系统\n\n扩展性：\n- 预留未来升级空间\n- 支持硬件设备扩展\n- 网络架构支持后续扩容\n- 电源和散热系统具备冗余设计`
            }
          ]
        },
        {
          pageNumber: 4,
          title: '空间设计方案',
          sections: [
            {
              subtitle: '平面布局设计图',
              content: `布局类型：${selectedTemplate?.name || '标准教室'}布局\n空间尺寸：${spaceArea}平方米\n主要区域：\n- 教学区：教师演示和讲解区域\n- 实验区：学生实践操作区域\n- 展示区：成果展示和交流区域\n- 设备间：服务器和网络设备放置区域`
            },
            {
              subtitle: '3D效果展示图',
              content: `设计风格：${getStyleName(designConfig.style)}\n光照设计：${getLightingName(designConfig.lighting)}\n材质选择：${getMaterialName(designConfig.material)}\n色彩搭配：${getColorName(designConfig.colorTheme)}\n\n主要效果图：\n1. 整体鸟瞰图\n2. 正面效果图\n3. 侧面效果图\n4. 细节特写图`
            },
            {
              subtitle: '空间利用和功能分区',
              content: `空间利用率：${Math.round(spaceArea * 0.85)}平方米（85%）\n功能分区：\n- 教学区：占比30%，用于教师教学活动\n- 实验区：占比50%，布置学生工作站\n- 展示区：占比10%，展示学生作品\n- 设备间：占比10%，放置服务器等设备`
            },
            {
              subtitle: '环境要求和装修建议',
              content: `环境要求：\n- 地面：防静电地板，高度30cm\n- 墙面：环保乳胶漆，隔音处理\n- 天花板：铝扣板吊顶，集成照明\n- 门窗：双层玻璃，密封隔音\n\n装修建议：\n- 采用现代化科技感设计\n- 注重色彩搭配和视觉效果\n- 确保良好的通风和采光\n- 符合消防和安全标准`
            }
          ]
        },
        {
          pageNumber: 5,
          title: '软件和系统方案',
          sections: [
            {
              subtitle: '操作系统和基础软件',
              content: `操作系统：\n- 工作站：Windows 11专业版\n- 服务器：Windows Server 2022\n\n基础软件：\n- 办公软件：Microsoft Office 365\n- 安全软件：企业级杀毒软件\n- 远程协助：TeamViewer企业版\n- 系统备份：专业备份软件`
            },
            {
              subtitle: 'AI教学平台和工具软件',
              content: `AI教学平台：\n- 自研AI教学管理系统\n- 课程资源库\n- 学生作品管理平台\n\nAI工具软件：\n- 机器学习：TensorFlow, PyTorch\n- 深度学习框架：CUDA, cuDNN\n- AI应用开发：Jupyter Notebook\n- 数据可视化：Matplotlib, Seaborn\n- 编程环境：VS Code, PyCharm`
            },
            {
              subtitle: '网络架构和安全方案',
              content: `网络架构：\n- 拓扑结构：星型网络架构\n- 核心设备：企业级三层交换机\n- 接入层：智能PoE交换机\n- 无线覆盖：WiFi 6无缝覆盖\n\n安全方案：\n- 防火墙防护：边界安全防护\n- 入侵检测：实时安全监控\n- 数据加密：敏感数据加密存储\n- 访问控制：基于角色的权限管理`
            },
            {
              subtitle: '数据存储和备份方案',
              content: `存储方案：\n- 本地存储：服务器大容量存储\n- 网络存储：NAS网络存储设备\n- 存储容量：4TB SSD + 12TB HDD\n\n备份方案：\n- 备份策略：3-2-1备份原则\n- 本地备份：每日增量备份，每周全量备份\n- 异地备份：重要数据云端备份\n- 恢复机制：快速数据恢复方案`
            }
          ]
        },
        {
          pageNumber: 6,
          title: '项目实施计划',
          sections: [
            {
              subtitle: '项目时间进度表',
              content: `总工期：45个工作日\n详细进度：\n- 第1-5天：需求确认和方案细化\n- 第6-15天：采购设备和材料\n- 第16-30天：场地装修和网络布线\n- 第31-40天：设备安装和系统部署\n- 第41-43天：系统测试和调优\n- 第44-45天：验收和培训`
            },
            {
              subtitle: '实施步骤和关键节点',
              content: `实施步骤：\n1. 项目启动和准备\n2. 设备采购和到货验收\n3. 场地准备和装修\n4. 网络基础设施建设\n5. 硬件设备安装调试\n6. 软件系统部署配置\n7. 系统集成测试\n8. 用户培训和试运行\n9. 项目验收和交付\n\n关键节点：\n- 设备到货：第15天\n- 装修完成：第30天\n- 系统部署完成：第40天\n- 项目验收：第45天`
            },
            {
              subtitle: '人员安排和责任分工',
              content: `项目团队：\n- 项目经理：负责整体协调和管理\n- 技术负责人：负责技术方案和实施\n- 网络工程师：负责网络建设和配置\n- 硬件工程师：负责硬件安装和调试\n- 软件工程师：负责软件部署和配置\n- 培训讲师：负责用户培训\n\n责任分工：\n- 甲方：提供场地和基础设施，配合验收\n- 乙方：负责设备供应、安装调试和培训`
            },
            {
              subtitle: '质量控制和验收标准',
              content: `质量控制：\n- 建立质量管理制度\n- 实施全过程质量监控\n- 定期进行质量检查和评估\n- 及时处理质量问题\n\n验收标准：\n- 所有设备正常运行\n- 软件系统功能完整\n- 网络连接稳定可靠\n- 培训工作顺利完成\n- 文档资料齐全`
            }
          ]
        },
        {
          pageNumber: 7,
          title: '培训和服务方案',
          sections: [
            {
              subtitle: '教师培训内容和计划',
              content: `培训内容：\n- AI基础知识培训\n- 硬件设备操作培训\n- 软件系统使用培训\n- AI教学应用培训\n- 常见问题处理培训\n\n培训计划：\n- 第一阶段：系统上线前培训（2天）\n- 第二阶段：系统使用后培训（1天）\n- 培训形式：理论讲解 + 实操演练\n- 培训资料：提供培训手册和视频教程`
            },
            {
              subtitle: '技术支持和维护服务',
              content: `技术支持：\n- 支持方式：电话、远程、现场\n- 响应时间：工作时间2小时内响应\n- 解决时间：一般问题4小时内解决\n- 紧急问题24小时内到达现场\n\n维护服务：\n- 定期维护：每月一次例行维护\n- 系统巡检：每季度一次全面检查\n- 性能优化：每半年一次系统优化\n- 故障处理：7*24小时故障响应`
            },
            {
              subtitle: '升级和扩展服务',
              content: `升级服务：\n- 软件升级：提供一年免费升级\n- 系统更新：定期安全补丁更新\n- 功能扩展：根据需求提供功能扩展\n\n扩展服务：\n- 硬件扩展：支持设备数量和性能扩展\n- 软件扩展：支持新增软件和功能模块\n- 网络扩展：支持网络规模扩展\n- 培训扩展：提供后续培训服务`
            },
            {
              subtitle: '服务保障和响应机制',
              content: `服务保障：\n- 建立服务SLA协议\n- 提供服务质量承诺\n- 定期进行服务满意度调查\n- 持续改进服务质量\n\n响应机制：\n- 服务热线：400-xxx-xxxx\n- 服务邮箱：service@example.com\n- 在线支持：企业微信在线客服\n- 紧急联系：项目经理手机138xxxxxxxx`
            }
          ]
        },
        {
          pageNumber: 8,
          title: '预算和付款方案',
          sections: [
            {
              subtitle: '详细预算明细表',
              content: `总预算：${budget}元\n\n硬件费用：${hardwareCost}元（60%）\n- 工作站：${Math.round(hardwareCost * 0.6)}元\n- 服务器：${Math.round(hardwareCost * 0.25)}元\n- 网络设备：${Math.round(hardwareCost * 0.1)}元\n- 配件和耗材：${Math.round(hardwareCost * 0.05)}元\n\n软件费用：${softwareCost}元（20%）\n- 操作系统：${Math.round(softwareCost * 0.3)}元\n- AI软件：${Math.round(softwareCost * 0.4)}元\n- 教学平台：${Math.round(softwareCost * 0.2)}元\n- 其他软件：${Math.round(softwareCost * 0.1)}元\n\n服务费用：${serviceCost}元（20%）\n- 安装调试：${Math.round(serviceCost * 0.3)}元\n- 培训费用：${Math.round(serviceCost * 0.2)}元\n- 维护服务：${Math.round(serviceCost * 0.4)}元\n- 其他服务：${Math.round(serviceCost * 0.1)}元`
            },
            {
              subtitle: '付款方式和时间节点',
              content: `付款方式：${solutionData.paymentMethod || '一次性全款支付（享受3%折扣）'}\n\n付款计划：\n${solutionData.paymentMethod === 'full' ? `- 合同签订后7个工作日内支付全款：${Math.round(budget * 0.97)}元\n- 享受3%折扣：${Math.round(budget * 0.03)}元` : solutionData.paymentMethod === '80-20' ? `- 合同签订后7个工作日内支付80%：${Math.round(budget * 0.8)}元\n- 项目验收后7个工作日内支付20%：${Math.round(budget * 0.2)}元` : solutionData.paymentMethod === '70-30' ? `- 合同签订后7个工作日内支付70%：${Math.round(budget * 0.7)}元\n- 项目验收后7个工作日内支付30%：${Math.round(budget * 0.3)}元` : `- 合同签订后7个工作日内支付50%：${Math.round(budget * 0.5)}元\n- 项目验收后7个工作日内支付50%：${Math.round(budget * 0.5)}元`}\n\n发票开具：\n- 按付款比例开具增值税专用发票`
            },
            {
              subtitle: '售后服务和保修政策',
              content: `保修政策：\n- 硬件设备：3年整机保修\n- 软件系统：1年免费升级，终身维护\n- 配件耗材：易损件3个月保修\n- 人为损坏：有偿维修服务\n\n售后服务：\n- 7*24小时技术支持热线\n- 定期巡检和维护服务\n- 软件版本升级服务\n- 故障应急响应服务`
            },
            {
              subtitle: '投资回报分析',
              content: `投资回报：\n- 使用年限：硬件设备5-8年\n- 年均使用成本：${Math.round(budget / 6)}元/年\n- 覆盖学生数：约${Math.ceil(spaceArea / 25) * 30}名学生/学期\n\n经济效益：\n- 减少外出培训费用\n- 提高教学效率和质量\n- 降低设备维护和管理成本\n\n社会效益：\n- 提升学校信息化水平\n- 培养学生AI素养和创新能力\n- 促进教育数字化转型\n- 树立学校品牌形象`
            }
          ]
        }
      ],
      referenceCases: relevantCases.slice(0, 2),
      version: 1
    };
  };

  // 导出方案
  const handleExportProposal = () => {
    if (!proposal) {
      alert('请先生成方案');
      return;
    }

    setIsExporting(true);
    
    // 模拟导出过程
    setTimeout(() => {
      setIsExporting(false);
      const formatName = exportFormats.find(f => f.value === selectedExportFormat)?.label;
      alert(`方案已成功导出为${formatName}格式！`);
    }, 2000);
  };

  // 更新自定义标题
  const handleTitleChange = (e) => {
    setCustomTitle(e.target.value);
  };

  // 更新自定义内容
  const handleContentChange = (pageIndex, sectionIndex, content) => {
    const newContent = { ...customContent };
    const key = `${pageIndex}-${sectionIndex}`;
    newContent[key] = content;
    setCustomContent(newContent);
  };

  // 获取自定义内容
  const getCustomContent = (pageIndex, sectionIndex) => {
    const key = `${pageIndex}-${sectionIndex}`;
    return customContent[key] || '';
  };

  // 辅助函数
  const getStyleName = (style) => {
    const styleMap = { modern: '现代风格', tech: '科技风格', classic: '经典风格' };
    return styleMap[style] || '现代风格';
  };

  const getLightingName = (lighting) => {
    const lightingMap = { natural: '自然光', artificial: '人工光', hybrid: '混合光' };
    return lightingMap[lighting] || '自然光';
  };

  const getMaterialName = (material) => {
    const materialMap = { wood: '木质', metal: '金属', glass: '玻璃', composite: '复合材料' };
    return materialMap[material] || '木质';
  };

  const getColorName = (color) => {
    const colorMap = { blue: '科技蓝', green: '环保绿', purple: '创新紫', neutral: '中性色' };
    return colorMap[color] || '科技蓝';
  };

  // 渲染方案页面预览
  const renderProposalPreview = () => {
    if (!proposal) return null;

    return (
      <div className="proposal-preview-section">
        <Card className="card-shadow" style={{ marginBottom: 16 }}>
          <div className="proposal-header">
            <Input 
              className="proposal-title-input"
              value={customTitle}
              onChange={handleTitleChange}
              placeholder="请输入方案标题"
              style={{ marginBottom: 8, fontSize: '18px', fontWeight: 'bold' }}
            />
            <p className="proposal-meta">
              生成时间：{proposal.generatedAt} | 版本：V{proposal.version}
            </p>
          </div>
        </Card>
        <div className="proposal-pages-container">
          {proposal.pages.map((page, pageIndex) => (
            <Card key={pageIndex} className="proposal-page card-shadow" style={{ marginBottom: 16 }}>
              <h3 className="page-title">第{page.pageNumber}页：{page.title}</h3>
              {page.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="page-section">
                  <h4 className="section-title">{section.subtitle}</h4>
                  <TextArea
                    className="section-content"
                    value={getCustomContent(pageIndex, sectionIndex) || section.content}
                    onChange={(e) => handleContentChange(pageIndex, sectionIndex, e.target.value)}
                    rows={10}
                    placeholder="请输入内容..."
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 渲染参考案例
  const renderReferenceCases = () => {
    if (!proposal || !proposal.referenceCases || proposal.referenceCases.length === 0) return null;

    return (
      <div className="reference-cases-section">
        <Card className="card-shadow">
          <h3>参考案例</h3>
          <div className="cases-grid">
            {proposal.referenceCases.map((caseItem, index) => (
              <Card key={index} className="case-card card-shadow" hoverable style={{ marginBottom: 8 }}>
                <h4>{caseItem.name}</h4>
                <p>面积：{caseItem.area}平方米</p>
                <p>预算：{caseItem.budget}元</p>
                <p>{caseItem.description}</p>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="proposal-generator fade-in">
      {/* 顶部导航 */}
      <div className="step-nav">
        <h2>项目提炼方案生成</h2>
        <div className="progress-indicator">
          <div className="step active">预算方案</div>
          <div className="step active">硬件配置</div>
          <div className="step active">设计方案</div>
          <div className="step active current">方案生成</div>
          <div className="step">方案管理</div>
        </div>
      </div>

      {/* 生成进度遮罩 */}
      {(isGenerating || isExporting) && (
        <div className="overlay">
          <Card className="progress-container card-shadow">
            <h3>{isGenerating ? '正在生成方案，请稍候...' : '正在导出方案，请稍候...'}</h3>
            <Progress percent={isGenerating ? generationProgress : 100} status="active" />
            <p>{isGenerating ? generationProgress : 100}%</p>
          </Card>
        </div>
      )}

      <div className="generator-content">
        {/* 左侧操作面板 */}
        <div className="operation-panel">
          <h3>方案操作</h3>
          <Card className="card-shadow" style={{ marginBottom: 16 }}>
          <div className="panel-section">
            <h4>方案生成</h4>
            <Button 
              type="primary"
              onClick={handleGenerateProposal}
              disabled={isGenerating}
              style={{ marginBottom: 8, width: '100%' }}
            >
              生成详细方案
            </Button>
            <p className="hint">基于您的预算方案、硬件配置和设计方案生成专业文档。</p>
          </div>

          <div className="panel-section">
            <h4>方案导出</h4>
            <Select 
              value={selectedExportFormat}
              onChange={(value) => setSelectedExportFormat(value)}
              style={{ marginBottom: 8, width: '100%' }}
              disabled={isExporting}
            >
              {exportFormats.map(format => (
                <Select.Option key={format.value} value={format.value}>
                  {format.label} ({format.description})
                </Select.Option>
              ))}
            </Select>
            <Button 
              onClick={handleExportProposal}
              disabled={isExporting || !proposal}
              style={{ width: '100%' }}
            >
              导出方案
            </Button>
          </div>

          <div className="panel-section">
            <h4>方案信息</h4>
            {proposal && (
              <div>
                <div className="info-item">
                  <span className="label">学校类型：</span>
                  <span>{proposal.schoolInfo.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">空间面积：</span>
                  <span>{proposal.schoolInfo.area}平方米</span>
                </div>
                <div className="info-item">
                  <span className="label">总预算：</span>
                  <span>{proposal.schoolInfo.budget}元</span>
                </div>
                <div className="info-item">
                  <span className="label">页面数量：</span>
                  <span>{proposal.pages.length}页</span>
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons" style={{ marginTop: 16 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button onClick={onBack}>
                上一步
              </Button>
              <Button onClick={onNext}
                type="primary"
                disabled={!proposal}
              >
                下一步
              </Button>
            </Space>
          </div>
          </Card>
        </div>

        {/* 右侧方案预览区 */}
        <div className="preview-area">
          {!proposal ? (
            <Card className="no-proposal card-shadow" style={{ textAlign: 'center', padding: '40px 0' }}>
              <h3>暂无生成的方案</h3>
              <p>请点击左侧"生成详细方案"按钮生成专业的项目方案文档。</p>
            </Card>
          ) : (
            <div>
              {renderProposalPreview()}
              {renderReferenceCases()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
