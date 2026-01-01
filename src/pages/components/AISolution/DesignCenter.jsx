import React, { useState, useEffect } from 'react';
import { Button, message, Space, InputNumber, Card } from 'antd';
import { ArrowRightOutlined, UploadOutlined } from '@ant-design/icons';
import { HashLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { updateWallDesignTask } from '../../../services/wallDesign.service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DesignCenter = ({ onPrev, onNext, solutionData, updateSolutionData }) => {
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // 墙的尺寸
  const [wallWidth, setWallWidth] = useState(8);
  const [wallHeight, setWallHeight] = useState(3);
  const [imageCount, setImageCount] = useState(4); // 生成图片数量
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // 上传的文件
  const [generationMode, setGenerationMode] = useState('text'); // 'text' 或 'upload'

  // 检查是否从缓存恢复的方案 - 需要在useEffect之前声明
  const [isFromCache, setIsFromCache] = useState(false);

  // 富文本编辑器配置
  const quillModules = {
    toolbar: false,  // 隐藏工具栏
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'blockquote', 'code-block'
  ];

  // Markdown 转 HTML 的函数
  const markdownToHtml = (text) => {
    if (!text || typeof text !== 'string') return text;

    let html = text;

    // 加粗 **文字** 带彩色括号
    html = html.replace(/\*\*(.+?)\*\*/g, '<span style="color: #f59e0b; font-weight: 700;">「</span><strong>$1</strong><span style="color: #f59e0b; font-weight: 700;">」</span>');

    // 斜体 *文字*
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 行内代码 `代码`
    html = html.replace(/`(.+?)`/g, '<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #e11d48;">$1</code>');

    // 引用 > 文字（整行）
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

    // 高亮背景 ==文字==
    html = html.replace(/==(.+?)==/g, '<mark style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 2px 6px; border-radius: 4px;">$1</mark>');

    return html;
  };

  // HTML 转 纯文本的函数 - 用于生成图片提示词
  const stripHtmlTags = (html) => {
    if (!html || typeof html !== 'string') return html;

    // 创建临时DOM元素来提取纯文本
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // 转换 sections 中的 Markdown 为 HTML
  const convertMarkdownInProposal = (proposalData) => {
    if (!proposalData || !proposalData.sections) return proposalData;

    return {
      ...proposalData,
      sections: proposalData.sections.map(section => ({
        ...section,
        items: section.items?.map(item => ({
          ...item,
          content: markdownToHtml(item.content)
        })) || []
      }))
    };
  };

  // 清除缓存的方案 - 需要在useEffect之前声明，因为JSX会使用它
  const handleClearCache = () => {
    if (window.confirm('确定要清除缓存的方案吗？清除后需要重新生成方案。')) {
      try {
        localStorage.removeItem('currentAISolution');
        setProposal(null);
        setSearchResults([]);
        updateSolutionData?.({
          generatedProposal: null,
          searchResults: []
        });
        message.success('缓存已清除');
      } catch (error) {
        console.error('清除缓存失败:', error);
        message.error('清除缓存失败');
      }
    }
  };

  useEffect(() => {
    setLoading(true);

    // 首先尝试从props获取
    if (solutionData?.generatedProposal) {
      const convertedProposal = convertMarkdownInProposal(solutionData.generatedProposal);
      setProposal(convertedProposal);
      setIsFromCache(false);
      console.log('从solutionData加载方案:', convertedProposal);
    } else {
      // 如果props没有，尝试从localStorage读取
      try {
        const savedData = localStorage.getItem('currentAISolution');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.generatedProposal) {
            const convertedProposal = convertMarkdownInProposal(parsedData.generatedProposal);
            setProposal(convertedProposal);
            setIsFromCache(true);
            console.log('从localStorage恢复方案:', convertedProposal);

            // 同时更新solutionData，保持同步
            updateSolutionData?.(parsedData);
          }
          if (parsedData.searchResults) {
            setSearchResults(parsedData.searchResults);
          }
        }
      } catch (error) {
        console.error('从localStorage读取方案失败:', error);
      }
    }

    if (solutionData?.searchResults) {
      setSearchResults(solutionData.searchResults);
    }

    setLoading(false);
  }, [solutionData, updateSolutionData]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <HashLoader color="#1890ff" size={60} />
        <span style={{ marginLeft: '12px', color: '#1e3a8a', fontSize: '16px' }}>加载方案预览...</span>
      </div>
    );
  }

  if (!proposal) {
    // 检查是否有缓存
    const hasCache = !!localStorage.getItem('currentAISolution');

    return (
      <div style={{
        padding: '60px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)',
        backgroundSize: '400% 400%',
        borderRadius: '20px'
      }}>
        <h3 style={{ color: 'white', fontSize: '28px', marginBottom: '16px' }}>
          暂无方案数据
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '24px' }}>
          请先在第一步配置方案并生成
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {onPrev && (
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={onPrev}
              size="large"
              style={{ background: 'white', color: '#1e3a8a', border: 'none' }}
            >
              返回配置方案
            </Button>
          )}
          {hasCache && (
            <Button
              danger
              size="large"
              onClick={handleClearCache}
              style={{ borderRadius: '8px' }}
            >
              清除缓存重新生成
            </Button>
          )}
        </div>
      </div>
    );
  }

  const schoolName = proposal.school_name || proposal.schoolInfo?.type || '未知学校';

  const handleContentChange = (sectionIndex, itemIndex, value) => {
    setProposal((prev) => {
      const next = { ...prev };
      next.sections = [...(prev.sections || [])];
      next.sections[sectionIndex] = {
        ...next.sections[sectionIndex],
        items: [...(next.sections[sectionIndex]?.items || [])],
      };
      next.sections[sectionIndex].items[itemIndex] = {
        ...next.sections[sectionIndex].items[itemIndex],
        content: value,
      };
      return next;
    });
  };

  const handleSave = async () => {
    if (!solutionData?.taskId) {
      message.error('缺少任务ID，请重新生成方案后再保存');
      return;
    }

    const normalizedProposal = {
      school_name: proposal.school_name || solutionData.schoolName || schoolName || '',
      style: solutionData.selectedStyle || proposal.style || '',
      sections: proposal.sections || []
    };

    setIsSaving(true);
    try {
      await updateWallDesignTask({
        taskId: solutionData.taskId,
        jsonResult: normalizedProposal,
        userParams: {
          school_name: solutionData.schoolName || schoolName || '',
          style: solutionData.selectedStyle || solutionData?.designConfig?.style || '',
        },
      });
      updateSolutionData?.({ generatedProposal: normalizedProposal });
      message.success('方案已保存到数据库');
    } catch (err) {
      console.error(err);
      message.error(err.message || '保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 生成效果图
  const handleGenerateImages = async () => {
    if (!proposal || !proposal.sections) {
      message.error('请先生成方案');
      return;
    }

    // 获取 "🏫 校园空间" 和 "💡 传统中式风格空间设计的理念解读" 的内容
    const campusSpaceSection = proposal.sections.find(s => s.title.includes('校园空间'));
    const designConceptSection = proposal.sections.find(s => s.title.includes('理念解读'));

    if (!campusSpaceSection || !designConceptSection) {
      message.error('方案数据不完整，请重新生成方案');
      return;
    }

    // 构建prompt - 使用stripHtmlTags提取纯文本，去除HTML标签
    const campusContent = campusSpaceSection.items?.map(item => `${item.subtitle}：${stripHtmlTags(item.content)}`).join('\n') || '';
    const designContent = designConceptSection.items?.map(item => `${item.subtitle}：${stripHtmlTags(item.content)}`).join('\n') || '';

    const prompt = `校园空间：${campusContent}\n\n传统中式风格空间设计的理念解读\n${designContent}\n\n根据以上的信息，对学校的一面墙进行设计，墙面宽度${wallWidth}米，高度${wallHeight}米。要求：
1. 横向16:9的超宽幅画面，展现墙面的全景视角
2. 现实风格的真实照片级渲染，正面视角展示科技墙
3. 画面中包含学生与科技墙互动的场景：有2-3名学生在墙面操作触摸屏、观看数字内容或使用互动设备
4. 学生动作自然，展现专注学习的状态
5. 光线柔和明亮，体现智慧教育空间的现代感
6. 不要做成走廊视角，专注于墙面本身的设计和互动体验
生成${imageCount}张不同角度和互动场景的效果图`;

    console.log('开始生成效果图，prompt长度:', prompt.length);
    console.log('最终prompt（纯文本）:', prompt);
    setIsGeneratingImages(true);

    // 清除旧的图片缓存，并立即同步设置isGeneratingImages状态
    try {
      const savedData = JSON.parse(localStorage.getItem('currentAISolution') || '{}');
      const cleanedData = {
        ...savedData,
        generatedImages: [],
        selectedImage: null,
        selectedImageIndex: null,
        isGeneratingImages: true, // 立即设置生成状态
        wallDimensions: { width: wallWidth, height: wallHeight }
      };
      localStorage.setItem('currentAISolution', JSON.stringify(cleanedData));
      console.log('已清除旧的图片缓存并设置生成状态');
    } catch (error) {
      console.error('清除缓存失败:', error);
    }

    // 更新state
    updateSolutionData?.({
      generatedImages: [],
      wallDimensions: { width: wallWidth, height: wallHeight },
      isGeneratingImages: true,
      selectedImage: null,
      selectedImageIndex: null,
      imageCount: imageCount // 保存图片数量
    });
    console.log('已初始化数据，准备跳转');

    // 立即跳转到步骤3（效果图生成页面）
    navigate('/ai-solution?step=3', { replace: true });
    console.log('已触发跳转到step=3');

    // 初始化图片数组
    const images = [];

    try {
      const { generateEffectImages } = await import('../../../services/imageGeneration.service');

      generateEffectImages({
        prompt,
        max_images: imageCount,
        size: '2K',
        onMessage: (data) => {
          console.log('收到消息:', data.type, data);
          if (data.type === 'image_generated') {
            images.push({
              url: data.data.url,
              size: data.data.size
            });
            console.log('添加图片:', images.length, images);
            // 实时更新图片列表
            updateSolutionData?.({
              generatedImages: [...images],
              wallDimensions: { width: wallWidth, height: wallHeight }
            });
            message.success(`第${data.data.image_index + 1}张效果图生成成功！`);
          }
        },
        onComplete: (result) => {
          console.log('生成完成:', result);
          setIsGeneratingImages(false);
          updateSolutionData?.({ isGeneratingImages: false });
          message.success('所有效果图生成完成！');
        },
        onError: (error) => {
          console.error('生成效果图失败:', error);
          setIsGeneratingImages(false);
          updateSolutionData?.({ isGeneratingImages: false });
          message.error(error.message || '生成效果图失败，请稍后重试');
        },
      });
    } catch (error) {
      console.error('生成效果图失败:', error);
      setIsGeneratingImages(false);
      updateSolutionData?.({ isGeneratingImages: false });
      message.error(error.message || '生成效果图失败，请稍后重试');
    }
  };

  // 处理文件选择
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      message.error('请选择 JPG、PNG 或 WebP 格式的图片');
      return;
    }

    setUploadedFiles(files);
    setGenerationMode('upload'); // 自动切换到上传模式
    message.success(`已选择 ${files.length} 张图片`);
  };

  // 生成效果图（带上传）
  const handleGenerateImagesWithUpload = async () => {
    if (!proposal || !proposal.sections) {
      message.error('请先生成方案');
      return;
    }

    if (uploadedFiles.length === 0) {
      message.error('请先选择要上传的参考图片');
      return;
    }

    // 获取 "🏫 校园空间" 和 "💡 传统中式风格空间设计的理念解读" 的内容
    const campusSpaceSection = proposal.sections.find(s => s.title.includes('校园空间'));
    const designConceptSection = proposal.sections.find(s => s.title.includes('理念解读'));

    if (!campusSpaceSection || !designConceptSection) {
      message.error('方案数据不完整，请重新生成方案');
      return;
    }

    // 构建prompt - 不包含墙面长宽信息
    const campusContent = campusSpaceSection.items?.map(item => `${item.subtitle}：${stripHtmlTags(item.content)}`).join('\n') || '';
    const designContent = designConceptSection.items?.map(item => `${item.subtitle}：${stripHtmlTags(item.content)}`).join('\n') || '';

    const prompt = `校园空间：${campusContent}\n\n传统中式风格空间设计的理念解读\n${designContent}\n\n根据以上的信息，对学校的一面墙进行设计。要求：
1. 横向16:9的超宽幅画面，展现墙面的全景视角
2. 现实风格的真实照片级渲染，正面视角展示科技墙
3. 画面中包含学生与科技墙互动的场景：有2-3名学生在墙面操作触摸屏、观看数字内容或使用互动设备
4. 学生动作自然，展现专注学习的状态
5. 光线柔和明亮，体现智慧教育空间的现代感
6. 不要做成走廊视角，专注于墙面本身的设计和互动体验
生成${imageCount}张不同角度和互动场景的效果图`;

    console.log('开始生成效果图（带上传），prompt长度:', prompt.length);
    console.log('最终prompt（纯文本）:', prompt);
    console.log('上传的文件数量:', uploadedFiles.length);
    setIsGeneratingImages(true);

    // 清除旧的图片缓存，并立即同步设置isGeneratingImages状态
    try {
      const savedData = JSON.parse(localStorage.getItem('currentAISolution') || '{}');
      const cleanedData = {
        ...savedData,
        generatedImages: [],
        selectedImage: null,
        selectedImageIndex: null,
        isGeneratingImages: true, // 立即设置生成状态
        wallDimensions: { width: wallWidth, height: wallHeight }
      };
      localStorage.setItem('currentAISolution', JSON.stringify(cleanedData));
      console.log('已清除旧的图片缓存并设置生成状态');
    } catch (error) {
      console.error('清除缓存失败:', error);
    }

    // 更新state
    updateSolutionData?.({
      generatedImages: [],
      wallDimensions: { width: wallWidth, height: wallHeight },
      isGeneratingImages: true,
      selectedImage: null,
      selectedImageIndex: null,
      imageCount: imageCount // 保存图片数量
    });
    console.log('已初始化数据，准备跳转');

    // 立即跳转到步骤3（效果图生成页面）
    navigate('/ai-solution?step=3', { replace: true });
    console.log('已触发跳转到step=3');

    // 初始化图片数组
    const images = [];

    try {
      const { generateEffectImagesWithFiles } = await import('../../../services/imageGeneration.service');

      generateEffectImagesWithFiles({
        prompt,
        images: uploadedFiles,
        max_images: imageCount,
        size: '2K',
        onMessage: (data) => {
          console.log('收到消息:', data.type, data);
          if (data.type === 'image_generated') {
            images.push({
              url: data.data.url,
              size: data.data.size
            });
            console.log('添加图片:', images.length, images);
            // 实时更新图片列表
            updateSolutionData?.({
              generatedImages: [...images],
              wallDimensions: { width: wallWidth, height: wallHeight }
            });
            message.success(`第${data.data.image_index + 1}张效果图生成成功！`);
          }
        },
        onComplete: (result) => {
          console.log('生成完成:', result);
          setIsGeneratingImages(false);
          updateSolutionData?.({ isGeneratingImages: false });
          message.success('所有效果图生成完成！');
        },
        onError: (error) => {
          console.error('生成效果图失败:', error);
          setIsGeneratingImages(false);
          updateSolutionData?.({ isGeneratingImages: false });
          message.error(error.message || '生成效果图失败，请稍后重试');
        },
      });
    } catch (error) {
      console.error('生成效果图失败:', error);
      setIsGeneratingImages(false);
      updateSolutionData?.({ isGeneratingImages: false });
      message.error(error.message || '生成效果图失败，请稍后重试');
    }
  };

  return (
    <div style={{
      fontFamily: "'Nunito', 'Microsoft YaHei', 'SimHei', sans-serif",
      lineHeight: '1.8',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      color: '#374151',
      minHeight: '100vh',
      padding: '30px'
    }}>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* 自定义 Quill 编辑器样式 */
          .ql-container {
            font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
            font-size: 16px;
            line-height: 1.8;
            border: none !important;
          }

          .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #e8e8e8 !important;
            background: #fafafa;
          }

          .ql-editor {
            min-height: 120px;
            padding: 16px;
            color: #1f2d5c;
          }

          .ql-editor.ql-blank::before {
            color: #999;
            font-style: normal;
          }

          /* 高亮样式 */
          .ql-editor mark {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 2px 6px;
            border-radius: 4px;
          }

          /* 特殊框样式 - 使用 blockquote */
          .ql-editor blockquote {
            border-left: 4px solid #1e3a8a;
            padding-left: 16px;
            margin: 12px 0;
            color: #1e3a8a;
            background: linear-gradient(90deg, rgba(30, 58, 138, 0.05), transparent);
            font-weight: 600;
          }

          /* 加粗渐变文字 */
          .ql-editor strong {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
          }

          /* 背景色样式 */
          .ql-editor .ql-bg-blue {
            background-color: #dbeafe;
            padding: 2px 6px;
            border-radius: 4px;
          }

          .ql-editor .ql-bg-yellow {
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
          }

          .ql-editor .ql-bg-green {
            background-color: #d1fae5;
            padding: 2px 6px;
            border-radius: 4px;
          }

          /* 标题样式 */
          .ql-editor h2 {
            font-size: 1.5em;
            color: #1e3a8a;
            font-weight: 700;
          }

          .ql-editor h3 {
            font-size: 1.3em;
            color: #2563eb;
            font-weight: 600;
          }
        `}
      </style>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        {/* 缓存提示条 */}
        {isFromCache && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #f59e0b',
            borderRadius: '15px',
            padding: '16px 24px',
            margin: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>💾</span>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#92400e',
                  marginBottom: '4px'
                }}>
                  已加载缓存的方案
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#b45309'
                }}>
                  这是上次生成的方案，您可以继续使用或清除缓存重新生成
                </div>
              </div>
            </div>
            <Button
              danger
              size="large"
              onClick={handleClearCache}
              style={{ borderRadius: '8px' }}
            >
              清除缓存
            </Button>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(15px)',
          borderRadius: '25px',
          padding: '40px',
          margin: '20px 0',
          boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '3.2em',
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '10px',
              fontWeight: 800,
              letterSpacing: '2px'
            }}>
              {schoolName}
            </h1>
            <p style={{
              fontSize: '1.4em',
              color: '#1e3a8a',
              fontWeight: 600,
              marginBottom: '30px'
            }}>
              科技墙设计方案
            </p>
          </div>

          {/* Sections */}
          {proposal.sections && proposal.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{
              margin: '30px 0',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
              borderRadius: '20px',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)'
              }}></div>

              <h2 style={{
                fontSize: '1.8em',
                fontWeight: 700,
                marginBottom: '25px',
                color: '#1e3a8a',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {sectionIndex === 0 && '🌟 '}
                {sectionIndex === 1 && '📚 '}
                {sectionIndex === 2 && '🏫 '}
                {sectionIndex === 3 && '💡 '}
                {section.title}
              </h2>

              <div style={{ fontSize: '1.1em', lineHeight: '1.9', color: '#374151' }}>
                {section.items && section.items.map((item, itemIndex) => {
                  const isFirstSection = sectionIndex === 2 && itemIndex === 0;

                  return (
                    <div key={itemIndex} style={{
                      background: isFirstSection
                        ? 'linear-gradient(135deg, #eff6ff, #dbeafe)'
                        : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                      padding: '20px',
                      borderRadius: '15px',
                      margin: '20px 0',
                      borderLeft: isFirstSection ? '5px solid #1e3a8a' : '5px solid #1e3a8a',
                      boxShadow: isFirstSection
                        ? '0 5px 15px rgba(30, 58, 138, 0.15)'
                        : '0 5px 15px rgba(30, 58, 138, 0.1)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: '#1e3a8a',
                        marginBottom: '8px',
                        fontSize: '1.1em'
                      }}>
                        {item.subtitle}：
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: '10px',
                        border: '1px solid #dbeafe',
                        overflow: 'hidden',
                      }}>
                        <ReactQuill
                          value={item.content || ''}
                          onChange={(value) => handleContentChange(sectionIndex, itemIndex, value)}
                          modules={quillModules}
                          formats={quillFormats}
                          theme="snow"
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                          }}
                          placeholder="请输入内容..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 资料来源 */}
          {searchResults.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              padding: '25px',
              borderRadius: '15px',
              marginTop: '30px',
              border: '2px solid rgba(148, 163, 184, 0.3)'
            }}>
              <h3 style={{
                fontSize: '1.5em',
                color: '#1e3a8a',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                📖 资料来源
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '10px'
              }}>
                {searchResults.map((result, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.9em',
                    borderLeft: '3px solid #94a3b8',
                    transition: 'background 0.3s ease'
                  }}>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#4169E1', textDecoration: 'none' }}
                    >
                      [{result.index}] {result.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            border: '2px solid rgba(59, 130, 246, 0.2)'
          }}>
            <p style={{
              fontSize: '1.2em',
              color: '#1e3a8a',
              fontWeight: 600,
              margin: '5px 0'
            }}>
              🚀 建设融合人文底蕴与科技创新的现代化学校
            </p>
            <p style={{
              fontSize: '1.2em',
              color: '#1e3a8a',
              fontWeight: 600,
              margin: '5px 0'
            }}>
              践行科技创新育人理念，打造面向未来的智慧教育典范
            </p>
            <p style={{
              fontSize: '1em',
              color: '#64748b',
              fontWeight: 'normal',
              margin: '15px 0 5px 0',
              textAlign: 'center',
              borderTop: '1px solid rgba(148, 163, 184, 0.3)',
              paddingTop: '15px',
              fontStyle: 'normal'
            }}>
              本方案由学智AI平台呈报，内容版权归学智人工智能公司和客户{schoolName}所有
            </p>
          </div>

          {/* 操作按钮和墙尺寸输入框合并区域 */}
          <Card
            style={{
              marginTop: '32px',
              background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '15px'
            }}
          >
            {/* 顶部操作栏 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '2px solid rgba(148, 163, 184, 0.3)'
            }}>
              <Space>
                <Button
                  size="large"
                  onClick={onPrev}
                  style={{ borderRadius: '8px' }}
                  disabled={isGeneratingImages}
                >
                  返回修改
                </Button>
                <Button
                  type="primary"
                  ghost
                  size="large"
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={!proposal || isGeneratingImages}
                  style={{ borderRadius: '8px' }}
                >
                  保存方案
                </Button>
              </Space>
            </div>

            {/* 生成模式选择区域 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '15px',
              padding: '24px',
              border: '2px solid rgba(59, 130, 246, 0.15)'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  color: '#1e3a8a',
                  fontWeight: 700,
                  marginBottom: '8px'
                }}>
                  🎨 选择生成方式
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  选择一种方式生成效果图
                </p>
              </div>

              {/* 模式切换按钮 */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                justifyContent: 'center'
              }}>
                <Button
                  size="large"
                  type={generationMode === 'text' ? 'primary' : 'default'}
                  onClick={() => {
                    setGenerationMode('text');
                    setUploadedFiles([]);
                  }}
                  disabled={isGeneratingImages}
                  style={{
                    borderRadius: '12px',
                    minWidth: '200px',
                    height: '60px',
                    background: generationMode === 'text'
                      ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                      : undefined,
                    border: generationMode === 'text'
                      ? 'none'
                      : '2px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      文本生成
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.85 }}>
                      设置墙面参数生成
                    </div>
                  </div>
                </Button>

                <Button
                  size="large"
                  type={generationMode === 'upload' ? 'primary' : 'default'}
                  onClick={() => setGenerationMode('upload')}
                  disabled={isGeneratingImages}
                  style={{
                    borderRadius: '12px',
                    minWidth: '200px',
                    height: '60px',
                    background: generationMode === 'upload'
                      ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                      : undefined,
                    border: generationMode === 'upload'
                      ? 'none'
                      : '2px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      上传图片生成
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.85 }}>
                      基于参考图生成
                    </div>
                  </div>
                </Button>
              </div>

              {/* 文本生成模式：显示墙面参数 */}
              {generationMode === 'text' && (
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px solid #3b82f6'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1e3a8a'
                      }}>
                        墙宽度：
                      </span>
                      <InputNumber
                        value={wallWidth}
                        onChange={(value) => setWallWidth(value || 8)}
                        min={1}
                        max={50}
                        step={0.1}
                        style={{ width: '100px' }}
                        disabled={isGeneratingImages}
                      />
                      <span style={{ fontSize: '14px', color: '#64748b' }}>米</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1e3a8a'
                      }}>
                        墙高度：
                      </span>
                      <InputNumber
                        value={wallHeight}
                        onChange={(value) => setWallHeight(value || 3)}
                        min={1}
                        max={20}
                        step={0.1}
                        style={{ width: '100px' }}
                        disabled={isGeneratingImages}
                      />
                      <span style={{ fontSize: '14px', color: '#64748b' }}>米</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1e3a8a'
                      }}>
                        图片数量：
                      </span>
                      <InputNumber
                        value={imageCount}
                        onChange={(value) => setImageCount(value || 2)}
                        min={1}
                        max={6}
                        step={1}
                        style={{ width: '100px' }}
                        disabled={isGeneratingImages}
                      />
                      <span style={{ fontSize: '14px', color: '#64748b' }}>张</span>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      onClick={handleGenerateImages}
                      loading={isGeneratingImages}
                      disabled={!proposal}
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                        border: 'none',
                        borderRadius: '8px',
                        minWidth: '160px',
                        height: '48px'
                      }}
                    >
                      {isGeneratingImages ? '生成中...' : '开始生成'}
                    </Button>
                  </div>
                </div>
              )}

              {/* 上传图片模式：显示文件选择 */}
              {generationMode === 'upload' && (
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px solid #3b82f6'
                }}>
                  <input
                    type="file"
                    id="image-upload-input"
                    style={{ display: 'none' }}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    disabled={isGeneratingImages}
                  />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                    flexWrap: 'wrap'
                  }}>
                    {uploadedFiles.length === 0 && (
                      <>
                        <div style={{
                          fontSize: '15px',
                          color: '#1e3a8a',
                          fontWeight: 600
                        }}>
                          📁 请上传参考图片（支持 JPG、PNG、WebP 格式）
                        </div>

                        <Button
                          size="large"
                          icon={<UploadOutlined />}
                          onClick={() => document.getElementById('image-upload-input').click()}
                          disabled={isGeneratingImages}
                          style={{
                            borderRadius: '8px',
                            minWidth: '160px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                            border: 'none',
                            color: 'white'
                          }}
                        >
                          选择图片
                        </Button>
                      </>
                    )}

                    {uploadedFiles.length > 0 && (
                      <>
                        <div style={{
                          fontSize: '15px',
                          color: '#1e3a8a',
                          fontWeight: 600,
                          background: 'rgba(255, 255, 255, 0.7)',
                          padding: '12px 20px',
                          borderRadius: '8px'
                        }}>
                          ✅ 已选择 {uploadedFiles.length} 张参考图
                          <span style={{
                            marginLeft: '12px',
                            fontSize: '13px',
                            color: '#2563eb',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }} onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles([]);
                            message.info('已清除选择');
                          }}>
                            重新选择
                          </span>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1e3a8a'
                          }}>
                            生成数量：
                          </span>
                          <InputNumber
                            value={imageCount}
                            onChange={(value) => setImageCount(value || 2)}
                            min={1}
                            max={6}
                            step={1}
                            style={{ width: '100px' }}
                            disabled={isGeneratingImages}
                          />
                          <span style={{ fontSize: '14px', color: '#64748b' }}>张</span>
                        </div>

                        <Button
                          type="primary"
                          size="large"
                          onClick={handleGenerateImagesWithUpload}
                          loading={isGeneratingImages}
                          disabled={!proposal}
                          style={{
                            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                            border: 'none',
                            borderRadius: '8px',
                            minWidth: '160px',
                            height: '48px'
                          }}
                        >
                          {isGeneratingImages ? '生成中...' : '开始生成'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DesignCenter;
