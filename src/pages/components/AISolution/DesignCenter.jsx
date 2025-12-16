import React, { useState, useEffect } from 'react';
import { message, Typography, Card, Button, Select, Space, Spin, Progress, Badge } from 'antd';
const { Option } = Select;
import {
  applicationScenarios,
  proposalTemplates
} from '../../../mock/aisolutionData';

const { Title, Text, Paragraph } = Typography;

const DesignCenter = ({ onBack, onNext, solutionData, updateSolutionData }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [designStyle, setDesignStyle] = useState('modern');
  const [lightingOption, setLightingOption] = useState('natural');
  const [materialOption, setMaterialOption] = useState('wood');
  const [colorTheme, setColorTheme] = useState('blue');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState(null);

  // 初始化默认场景和从主页面获取数据
  useEffect(() => {
    setIsLoading(true);
    try {
      // 如果solutionData中有设计配置，则使用它
      if (solutionData && solutionData.designConfig) {
        const { scenario, template, style, lighting, material, colorTheme: theme } = solutionData.designConfig;
        if (scenario) setSelectedScenario(scenario);
        if (template) setSelectedTemplate(template);
        if (style) setDesignStyle(style);
        if (lighting) setLightingOption(lighting);
        if (material) setMaterialOption(material);
        if (theme) setColorTheme(theme);
      } else if (applicationScenarios.length > 0) {
        // 否则使用默认值
        setSelectedScenario(applicationScenarios[0]);
        if (applicationScenarios[0].templates.length > 0) {
          setSelectedTemplate(applicationScenarios[0].templates[0]);
        }
      }
      
      // 恢复生成的内容
      if (solutionData && solutionData.generatedProposal) {
        setGeneratedProposal(solutionData.generatedProposal);
      }
      if (solutionData && solutionData.generatedImages) {
        setGeneratedImages(solutionData.generatedImages);
      }
    } catch (err) {
      setError('初始化设计中心失败，请重试');
      message.error('初始化失败，请刷新页面重试');
    } finally {
      setIsLoading(false);
    }
  }, [solutionData]);

  // 场景选择处理
  const handleScenarioSelect = (scenario) => {
    try {
      setSelectedScenario(scenario);
      setSelectedTemplate(scenario.templates[0]);
      // 重置生成的内容
      setGeneratedProposal(null);
      setGeneratedImages([]);
      // 清除错误
      setError(null);
    } catch (err) {
      setError('选择场景失败');
      message.error('选择场景失败，请重试');
    }
  };

  // 模板选择处理
  const handleTemplateSelect = (template) => {
    try {
      setSelectedTemplate(template);
      // 重置生成的内容
      setGeneratedProposal(null);
      setGeneratedImages([]);
      // 清除错误
      setError(null);
    } catch (err) {
      setError('选择模板失败');
      message.error('选择模板失败，请重试');
    }
  };

  // 生成方案
  const handleGenerateProposal = () => {
    if (!selectedScenario || !selectedTemplate) {
      message.warning('请先选择应用场景和平面模板');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    // 模拟生成进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setGenerationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        
        // 生成模拟方案数据
        const proposal = generateMockProposal();
        setGeneratedProposal(proposal);
        
        // 更新解决方案数据
        try {
          updateSolutionData({
            designConfig: {
              scenario: selectedScenario,
              template: selectedTemplate,
              style: designStyle,
              lighting: lightingOption,
              material: materialOption,
              colorTheme: colorTheme
            },
            generatedProposal: proposal
          });
          message.success('方案生成成功！');
        } catch (err) {
          setError('更新方案数据失败');
          message.error('保存方案数据失败，请重试');
        }
      }
    }, 300);
  };

  // 生成效果图
  const handleGenerateImages = () => {
    if (!selectedScenario || !selectedTemplate) {
      message.warning('请先选择应用场景和平面模板');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    // 模拟生成进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setGenerationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        
        // 生成模拟效果图
        const images = generateMockImages();
        setGeneratedImages(images);
        
        // 更新解决方案数据
        try {
          updateSolutionData({
            generatedImages: images
          });
          message.success('效果图生成成功！');
        } catch (err) {
          setError('更新效果图数据失败');
          message.error('保存效果图数据失败，请重试');
        }
      }
    }, 300);
  };

  // 模拟生成方案
  const generateMockProposal = () => {
    const schoolType = solutionData?.schoolType || 'unknown';
    const spaceArea = solutionData?.spaceArea || 80;
    const budget = solutionData?.budget || 300000;
    
    return {
      title: `${schoolType} ${selectedScenario.name} AI实验室建设方案`,
      pages: [
        {
          title: '项目概述和需求分析',
          content: `
            项目名称：${schoolType} ${selectedScenario.name} AI实验室\n
            项目背景：为满足学校AI教育需求，建设现代化AI实验室\n
            建设目标：打造集教学、实践、创新于一体的AI学习环境\n
            项目范围：${spaceArea}平方米空间规划与实施\n
            项目亮点：基于${selectedTemplate.name}的专业设计，满足${selectedScenario.description}需求`
        },
        {
          title: '硬件配置详细清单',
          content: '工作站配置、服务器配置、网络设备、显示设备、交互设备等详细清单'
        },
        {
          title: '空间布局设计图',
          content: `${selectedTemplate.name}详细布局说明与尺寸标注`
        },
        {
          title: '网络架构和系统部署',
          content: '网络拓扑图、服务器部署方案、安全架构设计'
        },
        {
          title: '软件环境和教学平台',
          content: '操作系统、AI开发工具、教学管理平台、课程资源库'
        },
        {
          title: '项目实施计划',
          content: '施工进度表、人员安排、质量控制措施、验收标准'
        },
        {
          title: '培训和服务内容',
          content: '教师培训计划、技术支持方案、维护服务承诺'
        },
        {
          title: '预算明细和付款方式',
          content: `总预算：${budget}元\n硬件费用：${Math.round(budget * 0.6)}元\n软件费用：${Math.round(budget * 0.2)}元\n服务费用：${Math.round(budget * 0.2)}元`
        }
      ],
      generatedAt: new Date().toLocaleString()
    };
  };

  // 模拟生成效果图
  const generateMockImages = () => {
    return [
      {
        type: 'birdview',
        title: '整体鸟瞰图',
        description: `${selectedTemplate.name}的全景俯视图`,
        previewUrl: `/preview/birdview-${selectedScenario.id}-${selectedTemplate.id}`
      },
      {
        type: 'frontview',
        title: '正面效果图',
        description: `实验室入口方向的正面效果`,
        previewUrl: `/preview/frontview-${selectedScenario.id}-${selectedTemplate.id}`
      },
      {
        type: 'sideview',
        title: '侧面效果图',
        description: `实验室侧面布局效果`,
        previewUrl: `/preview/sideview-${selectedScenario.id}-${selectedTemplate.id}`
      },
      {
        type: 'detail',
        title: '细节特写图',
        description: `工作站区域细节展示`,
        previewUrl: `/preview/detail-${selectedScenario.id}-${selectedTemplate.id}`
      }
    ];
  };

  // 保存设计
  const handleSaveDesign = () => {
    try {
      updateSolutionData({
        designConfig: {
          scenario: selectedScenario,
          template: selectedTemplate,
          style: designStyle,
          lighting: lightingOption,
          material: materialOption,
          colorTheme: colorTheme
        }
      });
      // 同时保存到本地存储
      const currentData = {
        ...solutionData,
        designConfig: {
          scenario: selectedScenario,
          template: selectedTemplate,
          style: designStyle,
          lighting: lightingOption,
          material: materialOption,
          colorTheme: colorTheme
        }
      };
      localStorage.setItem('aiSolutionData', JSON.stringify(currentData));
      message.success('设计已保存！');
    } catch (err) {
      setError('保存设计失败');
      message.error('保存设计失败，请重试');
    }
  };

  // 导出PPT
  const handleExportPPT = () => {
    if (!generatedProposal) {
      message.warning('请先生成方案');
      return;
    }
    try {
      setIsLoading(true);
      // 模拟导出功能
      setTimeout(() => {
        message.success('方案已成功导出为PPT格式！');
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('导出PPT失败');
      message.error('导出失败，请重试');
      setIsLoading(false);
    }
  };

  // 处理下一步
  const handleNextStep = () => {
    if (!generatedProposal || generatedImages.length === 0) {
      message.warning('请先生成方案和效果图');
      return;
    }
    try {
      // 确保所有数据都已保存
      handleSaveDesign();
      onNext();
    } catch (err) {
      setError('进入下一步失败');
      message.error('操作失败，请重试');
    }
  };

  // 渲染场景选择
  const renderScenarioSelection = () => (
    <div className="scenario-selection">
      <Title level={4}>应用场景选择</Title>
      <div className="scenario-grid">
        {applicationScenarios.map(scenario => (
          <Card
            key={scenario.id}
            className={`scenario-card ${selectedScenario?.id === scenario.id ? 'selected' : ''} card-shadow`}
            hoverable
            onClick={() => handleScenarioSelect(scenario)}
          >
            <div className="scenario-image">
              {/* 场景图片占位符 */}
              <div className="scenario-placeholder">🏫</div>
            </div>
            <div className="scenario-info">
              <Title level={5}>{scenario.name}</Title>
              <Paragraph>{scenario.description}</Paragraph>
              <Text type="secondary">适用面积：{scenario.suitableArea}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // 渲染模板选择
  const renderTemplateSelection = () => {
    if (!selectedScenario) return null;

    return (
      <div className="template-selection">
        <Title level={4}>平面模板选择</Title>
        <div className="template-grid">
          {selectedScenario.templates.map(template => (
            <Card
              key={template.id}
              className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''} card-shadow`}
              hoverable
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-preview">
                {/* 模板预览图占位符 */}
                <div className="template-placeholder">📐</div>
              </div>
              <div className="template-info">
                <Title level={5}>{template.name}</Title>
                <Paragraph>{template.description}</Paragraph>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 渲染设计参数调整
  const renderDesignParams = () => (
    <div className="design-params">
      <Title level={4}>设计参数调整</Title>
      <div className="param-group" style={{ marginBottom: 16 }}>
        <Text strong>设计风格：</Text>
        <Select 
          value={designStyle} 
          onChange={(value) => setDesignStyle(value)}
          style={{ width: 150, marginLeft: 8 }}
        >
          <Option value="modern">现代风格</Option>
          <Option value="tech">科技风格</Option>
          <Option value="classic">经典风格</Option>
        </Select>
      </div>
      <div className="param-group" style={{ marginBottom: 16 }}>
        <Text strong>光照效果：</Text>
        <Select 
          value={lightingOption} 
          onChange={(value) => setLightingOption(value)}
          style={{ width: 150, marginLeft: 8 }}
        >
          <Option value="natural">自然光</Option>
          <Option value="artificial">人工光</Option>
          <Option value="hybrid">混合光</Option>
        </Select>
      </div>
      <div className="param-group" style={{ marginBottom: 16 }}>
        <Text strong>材质选择：</Text>
        <Select 
          value={materialOption} 
          onChange={(value) => setMaterialOption(value)}
          style={{ width: 150, marginLeft: 8 }}
        >
          <Option value="wood">木质</Option>
          <Option value="metal">金属</Option>
          <Option value="glass">玻璃</Option>
          <Option value="composite">复合材料</Option>
        </Select>
      </div>
      <div className="param-group">
        <Text strong>色彩搭配：</Text>
        <Select 
          value={colorTheme} 
          onChange={(value) => setColorTheme(value)}
          style={{ width: 150, marginLeft: 8 }}
        >
          <Option value="blue">科技蓝</Option>
          <Option value="green">环保绿</Option>
          <Option value="purple">创新紫</Option>
          <Option value="neutral">中性色</Option>
        </Select>
      </div>
    </div>
  );

  // 渲染预览区域
  const renderPreview = () => (
    <div className="preview-section">
      <Title level={4}>实时预览</Title>
      <div className="preview-container">
        {selectedScenario && selectedTemplate ? (
          <div>
            <div className="preview-info">
              <Title level={5}>当前预览：{selectedScenario.name} - {selectedTemplate.name}</Title>
              <Text>设计风格：{getStyleName(designStyle)}</Text>
              <br />
              <Text>光照效果：{getLightingName(lightingOption)}</Text>
            </div>
            <div className="preview-render">
              {/* 渲染预览占位符 */}
              <div className="render-placeholder">🖼️</div>
            </div>
          </div>
        ) : (
          <div className="no-preview">请选择场景和模板以查看预览</div>
        )}
      </div>
    </div>
  );

  // 渲染生成的方案预览
  const renderGeneratedProposal = () => {
    if (!generatedProposal) return null;

    return (
      <div className="proposal-preview">
        <Title level={4}>生成的方案预览</Title>
        <div className="proposal-header">
          <Title level={5}>{generatedProposal.title}</Title>
          <Text type="secondary">生成时间：{generatedProposal.generatedAt}</Text>
        </div>
        <div className="proposal-pages">
          {generatedProposal.pages.map((page, index) => (
            <div key={index} className="proposal-page-preview">
              <div className="page-number">第{index + 1}页</div>
              <div className="page-title">{page.title}</div>
              <div className="page-content">{page.content.substring(0, 100)}...</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染生成的效果图
  const renderGeneratedImages = () => {
    if (generatedImages.length === 0) return null;

    return (
      <div className="images-preview">
        <Title level={4}>生成的效果图</Title>
        <div className="images-grid">
          {generatedImages.map((image, index) => (
            <Card key={index} className="image-card card-shadow hoverable">
              <div className="image-preview">
                {/* 图片预览占位符 */}
                <div className="image-placeholder">🖼️</div>
              </div>
              <div className="image-info">
                <Title level={5}>{image.title}</Title>
                <Paragraph>{image.description}</Paragraph>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // 辅助函数：获取风格名称
  const getStyleName = (style) => {
    const styleMap = { modern: '现代风格', tech: '科技风格', classic: '经典风格' };
    return styleMap[style] || style;
  };

  // 辅助函数：获取光照名称
  const getLightingName = (lighting) => {
    const lightingMap = { natural: '自然光', artificial: '人工光', hybrid: '混合光' };
    return lightingMap[lighting] || lighting;
  };

  return (
      <div className="design-center fade-in">
      {/* 顶部导航 */}
      <div className="step-nav">
        <Title level={2}>AI设计中心模板库</Title>
        <div className="progress-indicator">
          <div className="step active">预算方案</div>
          <div className="step active">硬件配置</div>
          <div className="step active current">设计方案</div>
          <div className="step">方案生成</div>
          <div className="step">方案管理</div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <Text type="danger">{error}</Text>
        </div>
      )}

      {isGenerating && (
        <div className="generation-overlay">
          <Card className="generation-progress card-shadow">
            <Title level={4}>正在生成，请稍候...</Title>
            <Progress percent={generationProgress} status="active" />
            <Text>{generationProgress}%</Text>
          </Card>
        </div>
      )}

      <div className="design-content">
        {/* 左侧控制面板 */}
        <div className="control-panel">
          <Card className="card-shadow">
            {renderScenarioSelection()}
          </Card>
          {renderTemplateSelection() && (
            <Card className="card-shadow" style={{ marginTop: 16 }}>
              {renderTemplateSelection()}
            </Card>
          )}
          <Card className="card-shadow" style={{ marginTop: 16 }}>
            {renderDesignParams()}
          </Card>
        </div>

        {/* 右侧预览和操作区 */}
        <div className="main-content">
          <Card className="card-shadow">
            {renderPreview()}
          </Card>
          {renderGeneratedProposal() && (
            <Card className="card-shadow" style={{ marginTop: 16 }}>
              {renderGeneratedProposal()}
            </Card>
          )}
          {renderGeneratedImages() && (
            <Card className="card-shadow" style={{ marginTop: 16 }}>
              {renderGeneratedImages()}
            </Card>
          )}

          <div className="action-buttons" style={{ marginTop: 16 }}>
            <Space wrap size="middle">
              <Button 
                type="primary"
                onClick={handleGenerateProposal} 
                disabled={isGenerating || isLoading}
              >
                {isGenerating && generationProgress > 0 ? '生成中...' : '生成方案'}
              </Button>
              <Button 
                type="primary"
                onClick={handleGenerateImages} 
                disabled={isGenerating || isLoading}
              >
                {isGenerating && generationProgress > 0 ? '生成中...' : '生成效果图'}
              </Button>
              <Button 
                onClick={handleSaveDesign} 
                disabled={isLoading}
              >
                保存设计
              </Button>
              <Button 
                onClick={handleExportPPT} 
                disabled={isLoading || !generatedProposal}
              >
                {isLoading ? '导出中...' : '导出PPT'}
              </Button>
              <Button 
                onClick={onBack} 
                disabled={isGenerating || isLoading}
              >
                上一步
              </Button>
              <Button 
                type="primary"
                onClick={handleNextStep} 
                disabled={isGenerating || isLoading || !generatedProposal || generatedImages.length === 0}
              >
                下一步
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCenter;
