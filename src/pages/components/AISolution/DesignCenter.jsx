import React, { useState, useEffect } from 'react';
import { Button, Spin, Input, message, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { updateWallDesignTask } from '../../../services/wallDesign.service';

const DesignCenter = ({ onPrev, onNext, solutionData, updateSolutionData }) => {
  const [proposal, setProposal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { TextArea } = Input;

  useEffect(() => {
    setLoading(true);

    if (solutionData) {
      if (solutionData.generatedProposal) {
        setProposal(solutionData.generatedProposal);
      }
      if (solutionData.searchResults) {
        setSearchResults(solutionData.searchResults);
      }
    }

    setLoading(false);
  }, [solutionData]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <Spin size="large" tip="加载方案预览..." />
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
          请先在第一步配置方案并生成
        </p>
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
                      <TextArea
                        value={item.content}
                        autoSize={{ minRows: 3, maxRows: 12 }}
                        onChange={(e) => handleContentChange(sectionIndex, itemIndex, e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          borderRadius: '10px',
                          border: '1px solid #dbeafe',
                          color: '#1f2d5c',
                        }}
                      />
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
              本报告由学智AI平台呈报，内容版权归学智人工智能科技公司和客户{schoolName}所有
            </p>
          </div>

          {/* 操作按钮 */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Space>
              <Button
                size="large"
                onClick={onPrev}
                style={{ borderRadius: '8px' }}
              >
                返回修改
              </Button>
              <Button
                type="primary"
                ghost
                size="large"
                onClick={handleSave}
                loading={isSaving}
                disabled={!proposal}
                style={{ borderRadius: '8px' }}
              >
                保存方案
              </Button>
            </Space>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={onNext}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              下一步：生成效果图
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCenter;
