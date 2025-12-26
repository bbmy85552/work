import React, { useState, useEffect } from 'react';
import { Button, Card, Spin, message, Space } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import './AISolutionStyles.css';

const ImageGenerator = ({ onPrev, onNext, solutionData, updateSolutionData }) => {
  // 初始化时立即读取isGeneratingImages状态，确保第一次渲染就能显示加载动画
  const [images, setImages] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState({}); // 跟踪每张图片的加载状态
  const [wallDimensions, setWallDimensions] = useState(() => solutionData?.wallDimensions || { width: 8, height: 3 });
  const [isGenerating, setIsGenerating] = useState(() => solutionData?.isGeneratingImages === true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // 选中的效果图索引

  // 监听 solutionData 的变化，实时更新图片
  useEffect(() => {
    console.log('ImageGenerator - solutionData更新:', {
      generatedImages: solutionData?.generatedImages,
      wallDimensions: solutionData?.wallDimensions,
      isGeneratingImages: solutionData?.isGeneratingImages,
      selectedImage: solutionData?.selectedImage
    });

    // 总是使用最新的 solutionData，不使用缓存
    if (solutionData?.generatedImages !== undefined) {
      const newImages = solutionData.generatedImages;
      setImages(newImages);

      // 为每张图片初始化加载状态（如果还没有的话）
      setImageLoadingStates(prev => {
        const updated = { ...prev };
        newImages.forEach((img, index) => {
          // 只有当这个索引还没有加载状态，或者之前是null/undefined时才设置为true
          if (prev[index] === undefined || prev[index] === null) {
            updated[index] = true;
          }
        });
        return updated;
      });
    }
    if (solutionData?.wallDimensions) {
      setWallDimensions(solutionData.wallDimensions);
    }
    if (solutionData?.isGeneratingImages !== undefined) {
      setIsGenerating(solutionData.isGeneratingImages);
    }
  }, [solutionData]);

  // 下载图片 - 直接使用图片URL下载，避免CORS跨域问题
  const handleDownloadImage = (imageUrl, index) => {
    try {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `效果图_${index + 1}.jpg`;
      a.target = '_blank'; // 在新标签页打开，避免跨域下载问题
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      message.success('图片下载成功');
    } catch (error) {
      console.error('下载图片失败:', error);
      message.error('下载图片失败，请稍后重试');
    }
  };

  // 重新生成效果图
  const handleRegenerateImages = () => {
    // 返回到上一步重新生成
    onPrev?.();
  };

  // 选择效果图
  const handleSelectImage = (index) => {
    setSelectedImageIndex(index);
    message.success(`已选择第${index + 1}张效果图`);
  };

  // 图片加载完成处理
  const handleImageLoad = (index) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [index]: false
    }));
    console.log(`图片 ${index + 1} 加载完成`);
  };

  // 图片加载失败处理
  const handleImageError = (index) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [index]: false
    }));
    console.error(`图片 ${index + 1} 加载失败`);
    message.error(`第${index + 1}张图片加载失败`);
  };

  // 生成最终方案
  const handleGenerateFinalScheme = () => {
    if (selectedImageIndex === null) {
      message.warning('请先选择一张效果图');
      return;
    }

    // 保存选中的效果图到solutionData
    updateSolutionData?.({
      selectedImage: images[selectedImageIndex],
      selectedImageIndex: selectedImageIndex,
      generatedImages: images,
      wallDimensions: wallDimensions
    });

    // 立即同步到localStorage，确保FinalScheme能读取到
    try {
      const savedData = JSON.parse(localStorage.getItem('currentAISolution') || '{}');
      const updatedData = {
        ...savedData,
        selectedImage: images[selectedImageIndex],
        selectedImageIndex: selectedImageIndex,
        generatedImages: images,
        wallDimensions: wallDimensions
      };
      localStorage.setItem('currentAISolution', JSON.stringify(updatedData));
      console.log('已保存选中的效果图到localStorage');
    } catch (error) {
      console.error('保存到localStorage失败:', error);
    }

    // 跳转到最终方案页面
    onNext?.();
  };

  console.log('ImageGenerator渲染状态:', { isGenerating, imagesLength: images.length });

  // 正在生成中且还没有图片，显示加载动画和2个占位符
  if (isGenerating && images.length === 0) {
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

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }

            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }

            .loading-text {
              animation: pulse 1.5s ease-in-out infinite;
            }
          `}
        </style>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <Card style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(15px)',
            borderRadius: '25px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.9)'
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
                效果图生成
              </h1>
              <p style={{
                fontSize: '1.4em',
                color: '#1e3a8a',
                fontWeight: 600,
                marginBottom: '30px'
              }}>
                正在生成您的专属墙面设计效果图
              </p>
            </div>

            {/* 生成状态提示 */}
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: '15px',
              border: '2px solid #3b82f6',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <Spin size="large" />
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  color: '#1e3a8a',
                  fontWeight: 600
                }}>
                  正在生成效果图... (0/2)
                </h3>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '14px',
                  color: '#2563eb'
                }}>
                  AI正在为您创建精美的墙面设计效果图，请稍候...
                </p>
              </div>
            </div>

            {/* 图片占位符 - 显示2个加载卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              {[1, 2].map((placeholderIndex) => (
                <Card
                  key={placeholderIndex}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '2px dashed rgba(59, 130, 246, 0.5)',
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    paddingTop: '75%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Spin size="large" />
                      <p style={{
                        marginTop: '16px',
                        fontSize: '16px',
                        color: '#1e3a8a',
                        fontWeight: 600
                      }}>
                        正在生成第{placeholderIndex}张效果图...
                      </p>
                      <div style={{
                        marginTop: '8px',
                        fontSize: '14px',
                        color: '#3b82f6'
                      }}>
                        请稍候，AI正在设计中
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '1.3em',
                      color: '#1e3a8a',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>
                      效果图 {placeholderIndex}
                    </h3>
                    <p style={{
                      fontSize: '0.95em',
                      color: '#64748b',
                      margin: 0
                    }}>
                      图片尺寸：生成中...
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* 操作按钮 */}
            <div style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={onPrev}
                style={{ borderRadius: '8px' }}
              >
                返回重新生成
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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

          .image-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }

          .image-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(30, 58, 138, 0.2);
          }

          .image-card img {
            width: 100%;
            height: auto;
            border-radius: '15px';
            object-fit: 'cover';
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Card style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(15px)',
          borderRadius: '25px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(30, 58, 138, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.9)'
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
              最终方案
            </h1>
            <p style={{
              fontSize: '1.4em',
              color: '#1e3a8a',
              fontWeight: 600,
              marginBottom: '30px'
            }}>
              科技墙设计效果图
            </p>
            <div style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              borderRadius: '20px',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '20px'
            }}>
              <span style={{
                fontSize: '1.1em',
                color: '#1e3a8a',
                fontWeight: 600
              }}>
                墙面尺寸：{wallDimensions.width}米 × {wallDimensions.height}米
              </span>
            </div>
          </div>

          {/* 生成状态提示 */}
          {isGenerating && (
            <div style={{
              marginBottom: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: '15px',
              border: '2px solid #3b82f6',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <Spin size="large" />
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  color: '#1e3a8a',
                  fontWeight: 600
                }}>
                  正在生成效果图... ({images.length}/2)
                </h3>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '14px',
                  color: '#2563eb'
                }}>
                  {images.length === 0 ? '正在准备生成...' : `已生成${images.length}张，正在生成第${images.length + 1}张...`}
                </p>
              </div>
            </div>
          )}

          {/* Images Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {images.map((image, index) => {
              const isLoading = imageLoadingStates[index] !== false; // 默认true，加载完成后false

              return (
                <Card
                  key={index}
                  className="image-card"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: selectedImageIndex === index
                      ? '3px solid #10b981'
                      : '2px solid rgba(59, 130, 246, 0.2)',
                    boxShadow: selectedImageIndex === index
                      ? '0 12px 24px rgba(16, 185, 129, 0.3)'
                      : '0 8px 16px rgba(30, 58, 138, 0.1)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                  cover={
                    <div style={{
                      position: 'relative',
                      paddingTop: '75%', // 4:3 aspect ratio
                      overflow: 'hidden',
                      background: '#f8fafc'
                    }}>
                      {selectedImageIndex === index && !isLoading && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          zIndex: 10,
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 600,
                          boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
                        }}>
                          ✓ 已选择
                        </div>
                      )}

                      {/* 加载占位符 - 覆盖在图片上方 */}
                      {isLoading && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1), rgba(59, 130, 246, 0.15))',
                          backdropFilter: 'blur(8px)',
                          gap: '16px',
                          zIndex: 5
                        }}>
                          <Spin size="large" />
                          <div style={{
                            fontSize: '16px',
                            color: '#1e3a8a',
                            fontWeight: 600
                          }}>
                            正在加载第{index + 1}张效果图...
                          </div>
                          {/* 骨架屏动画效果 */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                            animation: 'shimmer 1.5s infinite'
                          }} />
                        </div>
                      )}

                      {/* 图片 - 始终渲染，onLoad事件可以正常触发 */}
                      <img
                        src={image.url}
                        alt={`效果图 ${index + 1}`}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '16px',
                          opacity: isLoading ? 0.3 : 1,
                          transition: 'opacity 0.5s ease'
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      key="select"
                      type={selectedImageIndex === index ? 'primary' : 'default'}
                      onClick={() => handleSelectImage(index)}
                      disabled={isLoading}
                      style={{
                        background: selectedImageIndex === index
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : undefined,
                        border: selectedImageIndex === index
                          ? 'none'
                          : undefined,
                        borderRadius: '8px',
                        flex: 1
                      }}
                    >
                      {selectedImageIndex === index ? '已选择' : '选择此图'}
                    </Button>,
                    <Button
                      key="download"
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadImage(image.url, index)}
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        borderRadius: '8px',
                        flex: 1
                      }}
                    >
                      下载图片
                    </Button>
                  ]}
                >
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '1.3em',
                      color: '#1e3a8a',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>
                      效果图 {index + 1}
                    </h3>
                    <p style={{
                      fontSize: '0.95em',
                      color: '#64748b',
                      margin: 0
                    }}>
                      图片尺寸：{image.size || '2K'}
                    </p>
                  </div>
                </Card>
              );
            })}

            {/* 正在生成的图片占位符 */}
            {isGenerating && images.length < 2 && (
              <Card
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '2px dashed rgba(59, 130, 246, 0.5)',
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)'
                }}
              >
                <div style={{
                  position: 'relative',
                  paddingTop: '75%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <Spin size="large" />
                    <p style={{
                      marginTop: '16px',
                      fontSize: '16px',
                      color: '#1e3a8a',
                      fontWeight: 600
                    }}>
                      正在生成第{images.length + 1}张效果图...
                    </p>
                  </div>
                </div>
              </Card>
            )}
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
                icon={<ArrowLeftOutlined />}
                onClick={handleRegenerateImages}
                style={{ borderRadius: '8px' }}
                disabled={isGenerating}
              >
                返回重新生成
              </Button>
            </Space>
            <Button
              type="primary"
              size="large"
              onClick={handleGenerateFinalScheme}
              disabled={isGenerating || images.length === 0}
              style={{
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              生成最终方案
            </Button>
          </div>

          {/* 底部提示 */}
          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
            borderRadius: '15px',
            border: '2px solid rgba(148, 163, 184, 0.3)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '1.1em',
              color: '#1e3a8a',
              fontWeight: 600,
              margin: '8px 0'
            }}>
              💡 提示：请选择一张效果图用于最终方案
            </p>
            <p style={{
              fontSize: '1em',
              color: '#64748b',
              margin: '8px 0'
            }}>
              您可以下载所有效果图，但只能选择一张用于最终方案
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageGenerator;
