import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './AISolutionStyles.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FinalScheme = ({ onPrev, onNext, solutionData, updateSolutionData }) => {
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // 支持多张图片
  const [wallDimensions, setWallDimensions] = useState({ width: 8, height: 3 });

  // 富文本编辑器配置
  const quillModules = {
    toolbar: false,
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

  useEffect(() => {
    setLoading(true);

    console.log('=== FinalScheme 数据检查 ===');
    console.log('FinalScheme - solutionData:', solutionData);
    console.log('FinalScheme - selectedImages:', solutionData?.selectedImages);
    console.log('FinalScheme - selectedImage (旧数据):', solutionData?.selectedImage);

    // 获取方案数据并转换 Markdown
    if (solutionData?.generatedProposal) {
      const convertedProposal = convertMarkdownInProposal(solutionData.generatedProposal);
      setProposal(convertedProposal);
    }
    if (solutionData?.selectedImages && Array.isArray(solutionData.selectedImages)) {
      setSelectedImages(solutionData.selectedImages);
      console.log('✅ 设置了selectedImages数组，长度:', solutionData.selectedImages.length);
    } else if (solutionData?.selectedImage) {
      // 兼容旧数据，单张图片转为数组
      setSelectedImages([solutionData.selectedImage]);
      console.log('✅ 设置了selectedImage (转换为数组):', solutionData.selectedImage);
    } else {
      console.warn('⚠️ 未找到选中的图片数据');
      setSelectedImages([]);
    }
    if (solutionData?.wallDimensions) {
      setWallDimensions(solutionData.wallDimensions);
    }

    setLoading(false);
  }, [solutionData]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)',
        borderRadius: '20px',
        gap: '12px'
      }}>
        <Spin size="large" />
        <span style={{ color: 'white', fontSize: '16px' }}>加载最终方案...</span>
      </div>
    );
  }

  if (!proposal) {
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
          请先生成方案并选择效果图
        </p>
        <Button
          type="primary"
          onClick={onPrev}
          size="large"
          style={{ background: 'white', color: '#1e3a8a', border: 'none' }}
        >
          返回上一步
        </Button>
      </div>
    );
  }

  const schoolName = proposal.school_name || proposal.schoolInfo?.type || '未知学校';

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
              科技墙设计最终方案
            </p>
          </div>

          {/* Sections - 复用DesignCenter的内容 */}
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
                          modules={quillModules}
                          formats={quillFormats}
                          theme="snow"
                          readOnly={true}
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 最终效果图 - 支持多张图片 */}
          {selectedImages && selectedImages.length > 0 && (
            <div style={{
              margin: '40px 0',
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
              borderRadius: '20px',
              border: '3px solid #10b981',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #10b981, #059669)'
              }}></div>

              <h2 style={{
                fontSize: '1.8em',
                fontWeight: 700,
                marginBottom: '30px',
                color: '#059669',
                textAlign: 'center'
              }}>
                🎨 最终效果图 ({selectedImages.length}张)
              </h2>

              {/* 图片网格 - 根据数量自适应布局 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: selectedImages.length === 1
                  ? '1fr'
                  : selectedImages.length === 2
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
                maxWidth: '1400px',
                margin: '0 auto'
              }}>
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.2)';
                    }}
                  >
                    {/* 图片编号标签 */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 600,
                      zIndex: 10,
                      boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
                    }}>
                      效果图 {index + 1}
                    </div>

                    <img
                      src={image.url}
                      alt={`最终效果图 ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }}
                    />
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
              本报告由学智AI平台呈报，内容版权归学智人工智能科技公司和客户{schoolName}所有
            </p>
          </div>

          {/* 操作按钮 */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={onPrev}
              style={{ borderRadius: '8px' }}
            >
              返回修改
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalScheme;
