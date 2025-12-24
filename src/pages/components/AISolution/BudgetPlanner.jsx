import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Input, Button, message, Typography, Tooltip, Spin, Alert, Tag } from 'antd';
import {
  SaveOutlined,
  ArrowRightOutlined,
  UndoOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { generateWallDesign, parseStreamedContent } from '../../../services/wallDesign.service';

const { Title, Paragraph, Text } = Typography;

// 设计风格数据
const WALL_DESIGN_STYLES = {
  "现代简约科技风": {
    description: "以简洁线条、金属质感和LED灯带为主，突出科技感与现代美学",
    elements: ["LED显示屏", "金属框架", "极简线条", "智能照明", "触摸交互面板"],
    color_scheme: "空间基调为高级灰（#616161）、哑光白（#F5F5F5）；以科技蓝（#007BFF）作为核心功能色与导视色，贯穿于灯光与界面，营造理性、冷静的氛围",
    materials: "主要采用拉丝不锈钢、高光白色PVC覆膜板、雾面半透明亚克力，结合平板灯箱与嵌入式LED灯带，所有材质表面追求平整、光滑的精密质感"
  },
  "未来科幻风格": {
    description: "采用流线型设计、霓虹色彩和虚拟现实元素，营造未来感氛围",
    elements: ["流线型面板", "霓虹灯效", "VR展示区", "全息投影", "智能传感设备"],
    color_scheme: "背景以深空黑（#121212）或深灰蓝（#2A3B5D）为主，强烈对比荧光蓝（#00F3FF）、电子紫（#B200FF）等动态霓虹光效，营造沉浸式视觉冲击",
    materials: "大量运用镜面不锈钢、透光软膜、定制曲面彩色亚克力，结合RGB灯带与全息膜，塑造充满流动感与光影变化的超现实场景"
  },
  "自然生态风格": {
    description: "融入绿色植物、木材纹理和自然光效，体现环保与生态理念",
    elements: ["绿色植被墙", "木材装饰", "自然采光", "生态材料", "太阳能面板"],
    color_scheme: "主色调取自自然，包括不同明度的生态绿（如#2E8B57, #8FBC8F）、原木色（#DEB887）与米白色（#F5F5DC），局部点缀陶土红（#CC7357）增添温暖活力",
    materials: "核心采用天然实木（如橡木、松木）板材、竹纤维板，搭配硅藻泥墙面与天然麻布软装，地面可选用水磨石或仿石瓷砖，强调材料的真实触感与环保属性"
  },
  "艺术创意风格": {
    description: "融入抽象艺术与几何图形，强调互动与参与，旨在激发学生创意潜能与自由表达",
    elements: ["抽象艺术装置", "可涂鸦互动墙", "几何造型展具", "创意灯光雕塑", "学生作品动态展区"],
    color_scheme: "主色选用白色、浅灰色，搭配明亮色块（如橙黄、湖蓝）进行高饱和度点缀",
    materials: "以艺术涂料、彩色玻璃、织物软装、可书写板材为主，局部使用金属构件"
  },
  "新中式现代风格": {
    description: "提炼传统建筑、文化符号，运用现代设计语言与科技进行转译，体现\"中西融合、古今对话\"的校园人文气质",
    elements: ["简化后的格栅", "花窗", "月洞门等意象", "数字山水画卷", "智能书法台", "榫卯解构装置", "校园精神篆刻墙"],
    color_scheme: "空间基调为浅灰、素白、原木色，局部点缀朱砂红、石青、黛色等传统色彩",
    materials: "主要采用木材、深色金属、微水泥，结合LED灯带与互动透明屏呈现数字内容"
  },
  "传统中式风格": {
    description: "严谨运用传统形制、结构与装饰，营造庄重、典雅的学术氛围，适用于展现深厚历史与文化传承的专属空间",
    elements: ["对称布局", "匾额楹联", "中式博古架", "案几", "古典园林框景", "典籍陈列"],
    color_scheme: "以深栗色、暗红色、墨黑、原木本色为主，辅以石绿、泥金等装饰色",
    materials: "以实木（如榆木、花梨）、青砖、石材、宣纸灯、竹编为主，注重工艺细节（如雕刻、榫卯）"
  }
};

// 风格卡片组件
const StyleCard = ({ styleName, styleInfo, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`style-card ${isSelected ? 'selected' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(styleName)}
      style={{
        border: `2px solid ${isSelected ? '#1890ff' : '#e8e8e8'}`,
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isSelected ? '#e6f7ff' : '#fff',
        position: 'relative',
        overflow: 'visible',
        zIndex: isHovered ? 100 : 1,
        boxShadow: isHovered ? '0 4px 12px rgba(24, 144, 255, 0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <Text strong style={{ fontSize: '16px', color: '#333' }}>{styleName}</Text>
        {isSelected && (
          <span style={{
            color: '#52c41a',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>✓</span>
        )}
      </div>

      <Paragraph style={{
        color: '#666',
        fontSize: '13px',
        marginBottom: '12px',
        margin: 0
      }}>
        {styleInfo.description}
      </Paragraph>

      {/* 悬浮展开的详细信息 */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          left: 'auto',
          right: '0',
          top: '100%',
          marginTop: '8px',
          width: '320px',
          background: 'white',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          zIndex: 1000,
          animation: 'slideDown 0.3s ease'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ color: '#1890ff' }}>关键元素：</Text>
            <div style={{ marginTop: '4px', color: '#666', fontSize: '12px' }}>
              {styleInfo.elements.join('、')}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ color: '#1890ff' }}>色彩色调：</Text>
            <div style={{ marginTop: '4px', color: '#666', fontSize: '12px' }}>
              {styleInfo.color_scheme}
            </div>
          </div>

          <div>
            <Text strong style={{ color: '#1890ff' }}>材料材质：</Text>
            <div style={{ marginTop: '4px', color: '#666', fontSize: '12px' }}>
              {styleInfo.materials}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 搜索结果展示组件
const SearchResults = ({ results }) => {
  if (!results || results.length === 0) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      <Alert
        message={<span><SearchOutlined /> 找到 {results.length} 条相关信息</span>}
        type="info"
        style={{ marginBottom: '12px' }}
      />
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px',
        background: '#fafafa'
      }}>
        {results.map((result, index) => (
          <div
            key={index}
            style={{
              padding: '8px',
              marginBottom: index < results.length - 1 ? '8px' : '0',
              borderBottom: index < results.length - 1 ? '1px solid #f0f0f0' : 'none',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Tag color="blue" style={{ marginTop: '2px'}}>
                {result.index}
              </Tag>
              <div style={{ flex: 1 }}>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1890ff', textDecoration: 'none', fontWeight: 500 }}
                >
                  {result.title}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 方案内容展示组件
const ProposalContent = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      background: '#f6ffed',
      border: '1px solid #b7eb8f',
      borderRadius: '8px'
    }}>
      <Title level={5} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <CheckCircleOutlined /> 方案生成完成
      </Title>

      {data.school_name && (
        <div style={{ marginBottom: '12px' }}>
          <Text strong>学校名称：</Text>
          <Text>{data.school_name}</Text>
        </div>
      )}

      {data.style && (
        <div style={{ marginBottom: '12px' }}>
          <Text strong>设计风格：</Text>
          <Tag color="blue">{data.style}</Tag>
        </div>
      )}

      {data.proposal_content && (
        <div style={{ marginTop: '16px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>方案内容：</Text>
          <div style={{
            padding: '12px',
            background: 'white',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333'
          }}>
            {data.proposal_content}
          </div>
        </div>
      )}

      {data.design_elements && Array.isArray(data.design_elements) && data.design_elements.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>设计元素：</Text>
          <div>
            {data.design_elements.map((element, index) => (
              <Tag key={index} color="green" style={{ marginBottom: '8px' }}>
                {element}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 加载动画组件
const LoadingIndicator = ({ progress, streamingContent }) => {
  return (
    <div style={{
      padding: '20px',
      background: '#f0f2f5',
      borderRadius: '8px',
      marginTop: '16px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />}
        />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#333' }}>
          正在生成方案...
        </div>
        {progress && (
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            {progress}
          </div>
        )}
      </div>

      {/* 实时流式内容显示 */}
      {streamingContent && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'white',
          border: '1px solid #d9d9d9',
          borderRadius: '4px'
        }}>
          <Text strong style={{ color: '#1890ff', display: 'block', marginBottom: '8px' }}>
            实时生成内容：
          </Text>
          <div style={{
            padding: '12px',
            background: '#fafafa',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#333',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {streamingContent}
          </div>
        </div>
      )}
    </div>
  );
};

const BudgetPlanner = ({ solutionData, updateSolutionData, onNext, onBack }) => {
  // 状态管理
  const [schoolName, setSchoolName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  // 流式请求相关状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [contentChunks, setContentChunks] = useState([]);
  const [parsedProposal, setParsedProposal] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [generationProgress, setGenerationProgress] = useState('');
  const [streamingContent, setStreamingContent] = useState(''); // 实时流式内容
  const cancelRequestRef = useRef(null);
  const contentChunksRef = useRef([]); // 使用 ref 避免闭包问题
  const searchResultsRef = useRef([]); // 使用 ref 避免闭包问题

  // 初始化数据
  useEffect(() => {
    if (solutionData) {
      setSchoolName(solutionData.schoolName || '');
      setSelectedStyle(solutionData.selectedStyle || '');
    }
  }, [solutionData]);

  // 组件卸载时取消请求
  useEffect(() => {
    return () => {
      if (cancelRequestRef.current) {
        cancelRequestRef.current();
      }
    };
  }, []);

  // 生成方案
  const handleGenerate = useCallback(async () => {
    if (!schoolName) {
      message.warning('请输入学校完整名称');
      return;
    }
    if (!selectedStyle) {
      message.warning('请选择设计风格');
      return;
    }

    // 重置状态
    setIsGenerating(true);
    setSearchResults([]);
    searchResultsRef.current = []; // 修复：不是 setSearchResultsRef
    setContentChunks([]);
    setStreamingContent('');
    setParsedProposal(null);
    setUsageStats(null);
    setGenerationProgress('正在搜索学校相关信息...');
    contentChunksRef.current = [];

    try {
      // 发起流式请求
      cancelRequestRef.current = generateWallDesign({
        school_name: schoolName,
        style: selectedStyle,
        onMessage: (data) => {
          switch (data.type) {
            case 'search_info':
              // 显示搜索结果
              if (data.search_results) {
                setSearchResults(data.search_results);
                searchResultsRef.current = data.search_results; // 同步更新 ref
                setGenerationProgress(`找到 ${data.search_results.length} 条相关信息，正在生成方案...`);
              }
              break;

            case 'content':
              // 累积内容块
              if (data.content) {
                setContentChunks(prev => {
                  const newChunks = [...prev, data.content];
                  contentChunksRef.current = newChunks; // 同步更新 ref

                  // 更新实时显示的内容
                  const fullContent = newChunks.join('');
                  setStreamingContent(fullContent);

                  return newChunks;
                });
                setGenerationProgress('正在生成方案内容...');
              }
              break;

            case 'usage_stats':
              // 保存使用统计
              if (data.usage_stats) {
                setUsageStats(data.usage_stats);
              }
              break;

            case 'completed':
              // 请求完成
              setGenerationProgress('方案生成完成！');
              break;

            default:
          // 未知消息类型，忽略
          }
        },
        onComplete: (data) => {
          const taskId = data?.task_id || '';
          // 使用 ref 中的最新数据解析
          const proposal = parseStreamedContent(contentChunksRef.current);

          if (proposal) {
            setParsedProposal(proposal);
          } else {
            // 如果解析失败，至少显示原始内容
            console.warn('JSON 解析失败，显示原始内容');
          }

          // 一次性保存所有数据
          const dataToSave = {
            schoolName,
            selectedStyle,
            styleInfo: WALL_DESIGN_STYLES[selectedStyle],
            generatedProposal: proposal,
            searchResults: searchResultsRef.current, // 使用 ref 中的最新值
            usageStats: usageStats,
            rawContent: streamingContent,
            taskId
          };

          updateSolutionData(dataToSave);

          message.success('方案生成成功！');

          // 延迟后跳转到方案预览页
          setTimeout(() => {
            setIsGenerating(false);
            if (onNext) {
              onNext();
            }
          }, 1000);
        },
        onError: (error) => {
          console.error('生成失败:', error);
          message.error(`生成失败: ${error.message || '未知错误'}`);
          setIsGenerating(false);
        },
      });
    } catch (error) {
      console.error('生成方案失败:', error);
      message.error('生成方案失败，请稍后重试');
      setIsGenerating(false);
    }
  }, [schoolName, selectedStyle, contentChunks, searchResults, usageStats, updateSolutionData, onNext]);

  // 保存方案
  const handleSave = useCallback(() => {
    if (!schoolName) {
      message.warning('请输入学校完整名称');
      return false;
    }
    if (!selectedStyle) {
      message.warning('请选择设计风格');
      return false;
    }

    try {
      const techWallData = {
        schoolName,
        selectedStyle,
        styleInfo: WALL_DESIGN_STYLES[selectedStyle]
      };

      updateSolutionData('schoolName', schoolName);
      updateSolutionData('selectedStyle', selectedStyle);
      updateSolutionData('styleInfo', WALL_DESIGN_STYLES[selectedStyle]);
      updateSolutionData('techWallData', techWallData);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('savedTechWallPlan', JSON.stringify(techWallData));
      }

      message.success('方案已保存');
      return true;
    } catch (error) {
      console.error('保存方案失败:', error);
      message.error('保存失败，请稍后重试');
      return false;
    }
  }, [schoolName, selectedStyle, updateSolutionData]);

  // 重置
  const handleReset = () => {
    setSchoolName('');
    setSelectedStyle('');
    setSearchResults([]);
    searchResultsRef.current = []; // 重置 ref
    setContentChunks([]);
    setStreamingContent('');
    setParsedProposal(null);
    setUsageStats(null);

    updateSolutionData('schoolName', '');
    updateSolutionData('selectedStyle', '');
    updateSolutionData('styleInfo', null);
    updateSolutionData('techWallData', null);
  };

  return (
    <div className="budget-planner fade-in">
      <Card title="科技墙方案配置" variant="outlined" className="card-shadow">
        <Title level={5}>请填写学校信息并选择合适的设计风格</Title>
        <Paragraph>您的选择将直接影响后续的方案设计</Paragraph>

        {/* 学校名称输入 */}
        <div className="config-section">
          <h4>
            学校完整名称 <span style={{ color: '#ff4d4f' }}>*</span>
            <Tooltip title="请输入学校的法定全称，例如：北京市第一中学">
              <InfoCircleOutlined style={{ marginLeft: '8px', color: '#1890ff', cursor: 'help' }} />
            </Tooltip>
          </h4>
          <Input
            placeholder="请输入学校完整名称"
            style={{ width: '100%' }}
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            maxLength={50}
            showCount
            disabled={isGenerating}
          />
        </div>

        {/* 设计风格选择 */}
        <div className="config-section">
          <h4>
            选择设计风格 <span style={{ color: '#ff4d4f' }}>*</span>
            <Tooltip title="鼠标悬浮可查看风格详细信息">
              <InfoCircleOutlined style={{ marginLeft: '8px', color: '#1890ff', cursor: 'help' }} />
            </Tooltip>
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '16px'
          }}>
            {Object.entries(WALL_DESIGN_STYLES).map(([styleName, styleInfo]) => (
              <StyleCard
                key={styleName}
                styleName={styleName}
                styleInfo={styleInfo}
                isSelected={selectedStyle === styleName}
                onSelect={setSelectedStyle}
              />
            ))}
          </div>
        </div>

        {/* 已选择的风格信息展示 */}
        {selectedStyle && !isGenerating && (
          <div className="config-section" style={{
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>
              ✓ 已选择：{selectedStyle}
            </h4>
            <div style={{ color: '#666', fontSize: '13px' }}>
              <p style={{ marginBottom: '8px' }}><strong>描述：</strong>{WALL_DESIGN_STYLES[selectedStyle].description}</p>
              <p style={{ marginBottom: '8px' }}><strong>关键元素：</strong>{WALL_DESIGN_STYLES[selectedStyle].elements.join('、')}</p>
            </div>
          </div>
        )}

        {/* 生成中状态 */}
        {isGenerating && (
          <>
            <LoadingIndicator progress={generationProgress} streamingContent={streamingContent} />
            {/* 生成过程中显示搜索结果 */}
            {searchResults.length > 0 && <SearchResults results={searchResults} />}
          </>
        )}

        {/* 生成结果展示 */}
        {!isGenerating && parsedProposal && (
          <ProposalContent data={parsedProposal} />
        )}

        {/* 操作按钮 */}
        <div className="button-group" style={{ marginTop: '24px' }}>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!schoolName || !selectedStyle || isGenerating}
            style={{ marginRight: 'auto' }}
          >
            保存方案
          </Button>
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleGenerate}
            disabled={!schoolName || !selectedStyle || isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? '生成中...' : '生成方案'}
          </Button>
        </div>
      </Card>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .style-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default BudgetPlanner;
