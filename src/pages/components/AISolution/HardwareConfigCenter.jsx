import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { message, Typography, Card, Space, Button, Select, Badge } from 'antd';
const { Option } = Select;
import {
  hardwareCategories,
  getAllHardwareProducts,
  getProductsByCategory
} from '../../../mock/aisolutionData';

const { Title, Paragraph } = Typography;

const HardwareConfigCenter = ({ onBack, onNext, solutionData, updateSolutionData }) => {
  const [selectedCategory, setSelectedCategory] = useState('cpu');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [compatibilityResult, setCompatibilityResult] = useState({ status: 'unknown', issues: [] });
  const [performanceScore, setPerformanceScore] = useState(0);
  const [sortBy, setSortBy] = useState('price');
  const [filterBrand, setFilterBrand] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCompatibilityWarning, setShowCompatibilityWarning] = useState(false);
  
  // 防抖函数
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // 初始化数据
  useEffect(() => {
    if (solutionData?.hardwareConfig?.selectedProducts?.length > 0) {
      setSelectedProducts(solutionData.hardwareConfig.selectedProducts);
    } else if (solutionData?.budget > 0) {
      // 尝试根据预算自动推荐配置
      handleViewRecommended();
    }
  }, [solutionData]);

  useEffect(() => {
    try {
      setIsLoading(true);
      // 加载产品列表
      const products = getProductsByCategory(selectedCategory);
      setProductList(products);
      setError(null);
    } catch (err) {
      console.error('加载产品数据失败:', err);
      setError('加载产品数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // 检查兼容性 - 使用useCallback优化
  const checkCompatibility = useCallback(() => {
    if (selectedProducts.length === 0) {
      setCompatibilityResult({ status: 'unknown', issues: [] });
      return;
    }

    const issues = [];
    const cpus = selectedProducts.filter(p => p.id.startsWith('cpu-'));
    const gpus = selectedProducts.filter(p => p.id.startsWith('gpu-'));
    const motherboards = selectedProducts.filter(p => p.id.startsWith('motherboard-'));
    const memories = selectedProducts.filter(p => p.id.startsWith('memory-'));

    // CPU与主板兼容性检查
    if (cpus.length > 0 && motherboards.length > 0) {
      const compatible = cpus[0].compatibility && 
        cpus[0].compatibility.includes(motherboards[0].id);
      if (!compatible) {
        issues.push('CPU与主板不兼容');
      }
    }

    // GPU功耗检查
    if (gpus.length > 0) {
      const powerRequired = gpus.reduce((sum, gpu) => sum + (gpu.powerRequirement || 300), 0);
      if (powerRequired > 850) {
        issues.push('GPU总功耗过高，建议选择更高功率电源');
      }
    }
    
    // 预算检查
    const totalPrice = selectedProducts.reduce((sum, product) => sum + (product.price || 0), 0);
    if (solutionData?.budget && totalPrice > solutionData.budget * 1.2) {
      issues.push(`总价格超出预算20%以上，请考虑调整配置`);
    }

    // 兼容性状态
    let status = 'compatible';
    if (issues.length > 0) {
      status = issues.length === 1 ? 'partial' : 'incompatible';
    }

    setCompatibilityResult({ status, issues });
  }, [selectedProducts, solutionData?.budget]);
  
  // 计算性能评分 - 使用useCallback优化
  const calculatePerformanceScore = useCallback(() => {
    if (selectedProducts.length === 0) {
      setPerformanceScore(0);
      return;
    }

    let totalScore = 0;
    let weight = 0;

    selectedProducts.forEach(product => {
      if (product.performance) {
        totalScore += product.performance * 0.5; // 产品性能权重50%
        weight += 0.5;
      }
    });

    // 兼容性加分
    if (compatibilityResult.status === 'compatible') {
      totalScore += 25;
      weight += 0.25;
    } else if (compatibilityResult.status === 'partial') {
      totalScore += 10;
      weight += 0.25;
    }

    // 完整性加分
    const categories = ['cpu', 'gpu', 'memory', 'storage'];
    const coveredCategories = categories.filter(cat => 
      selectedProducts.some(p => p.id.startsWith(cat + '-'))
    );
    const completenessScore = (coveredCategories.length / categories.length) * 25;
    totalScore += completenessScore;
    weight += 0.25;

    const finalScore = weight > 0 ? Math.round(totalScore / weight) : 0;
    setPerformanceScore(finalScore);
  }, [selectedProducts, compatibilityResult.status]);
  

  
  // 使用防抖优化性能检查
  const debouncedUpdateChecks = useMemo(
    () => debounce(() => {
      checkCompatibility();
      calculatePerformanceScore();
    }, 300),
    [debounce, checkCompatibility, calculatePerformanceScore]
  );
  
  useEffect(() => {
    // 计算兼容性和性能评分（使用防抖）
    debouncedUpdateChecks();
  }, [selectedProducts, debouncedUpdateChecks]);
  
  // 更新解决方案数据
  useEffect(() => {
    if (selectedProducts.length > 0 && performanceScore > 0) {
      updateSolutionData({
        hardwareConfig: {
          selectedProducts,
          totalPrice: calculateTotalPrice,
          performanceScore,
          compatibilityStatus: compatibilityResult.status
        }
      });
    }
  }, [selectedProducts, calculateTotalPrice, performanceScore, compatibilityResult.status, updateSolutionData]);
  
  // 检查是否可以继续到下一步
  const canProceed = useMemo(() => {
    return selectedProducts.length > 0;
  }, [selectedProducts]);

  // 选择产品 - 使用useCallback优化
  const handleSelectProduct = useCallback((product) => {
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    if (existingIndex > -1) {
      // 移除产品
      const newSelected = [...selectedProducts];
      newSelected.splice(existingIndex, 1);
      setSelectedProducts(newSelected);
    } else {
      // 添加产品，考虑类别限制（如CPU只能选一个）
      let newSelected = [...selectedProducts];
      if (selectedCategory === 'cpu' || selectedCategory === 'gpu') {
        // 移除同类别旧产品
        newSelected = newSelected.filter(p => !p.id.startsWith(selectedCategory + '-'));
      }
      newSelected.push(product);
      setSelectedProducts(newSelected);
    }
    // 重置兼容性警告状态
    setShowCompatibilityWarning(false);
  }, [selectedProducts, selectedCategory]);

  // 排序和筛选产品 - 使用useMemo优化
  const sortedAndFilteredProducts = useMemo(() => {
    if (!productList || productList.length === 0) return [];
    
    // 先筛选
    let filtered = productList.filter(product => 
      filterBrand === 'all' || product.brand === filterBrand
    );
    
    // 再排序
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'performance') {
        return (b.performance || 0) - (a.performance || 0);
      } else if (sortBy === 'stock') {
        return b.stock - a.stock;
      }
      return 0;
    });
  }, [productList, sortBy, filterBrand]);

  // 获取所有品牌 - 使用useMemo优化
  const getBrands = useMemo(() => {
    const brands = [...new Set(productList.map(p => p.brand))];
    return ['all', ...brands];
  }, [productList]);

  // 计算总价 - 使用useMemo优化
  const calculateTotalPrice = useMemo(() => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  }, [selectedProducts]);

  // 保存配置 - 优化用户体验
  const handleSaveConfig = useCallback(() => {
    if (selectedProducts.length === 0) {
      message.warning('请至少选择一个产品');
      return;
    }
    
    setIsLoading(true);
    
    // 延迟执行以显示加载状态
    setTimeout(() => {
      // 保存到本地存储
      try {
        localStorage.setItem('savedHardwareConfig', JSON.stringify({
          selectedProducts,
          totalPrice: calculateTotalPrice,
          performanceScore,
          compatibilityStatus: compatibilityResult.status
        }));
        
        updateSolutionData({
          hardwareConfig: {
            selectedProducts,
            totalPrice: calculateTotalPrice,
            performanceScore,
            compatibilityStatus: compatibilityResult.status
          }
        });
        
        message.success('配置已保存');
      } catch (err) {
        console.error('保存配置失败:', err);
        message.error('保存配置失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [selectedProducts, calculateTotalPrice, performanceScore, compatibilityResult.status, updateSolutionData]);

  // 重置配置
  const handleResetConfig = () => {
    if (window.confirm('确定要重置当前配置吗？')) {
      setSelectedProducts([]);
      message.success('配置已重置');
    }
  };

  // 获取推荐配置 - 优化逻辑
  const handleViewRecommended = useCallback(() => {
    try {
      setIsLoading(true);
      const budget = solutionData?.budget || 200000;
      
      // 定义推荐产品函数以减少重复代码
      const getRecommendedProductsByBudget = (budgetAmount) => {
        const allProducts = getAllHardwareProducts();
        const recommended = [];
        
        // 根据预算分配选择推荐产品
        const cpuBudget = Math.floor(budgetAmount * 0.3);
        const gpuBudget = Math.floor(budgetAmount * 0.4);
        const memoryBudget = Math.floor(budgetAmount * 0.15);
        const storageBudget = Math.floor(budgetAmount * 0.15);
        
        // 选择各分类中最接近预算且不超过预算的产品
        const selectBestForBudget = (category, maxPrice) => {
          const products = (allProducts[category] || [])
            .filter(p => p.price <= maxPrice)
            .sort((a, b) => b.performance - a.performance);
          return products[0] || null;
        };
        
        recommended.push(
          selectBestForBudget('cpu', cpuBudget),
          selectBestForBudget('gpu', gpuBudget),
          selectBestForBudget('memory', memoryBudget),
          selectBestForBudget('storage', storageBudget)
        );
        
        return recommended.filter(p => p !== null);
      };
      
      const recommendedProducts = getRecommendedProductsByBudget(budget);
      
      if (recommendedProducts && recommendedProducts.length > 0) {
        setSelectedProducts(recommendedProducts);
        message.success(`已为您推荐预算${budget}元的最佳配置`);
      } else {
        // 备用推荐配置
        const allProducts = getAllHardwareProducts();
        const recommended = [
          allProducts.cpu[1], // AMD Ryzen 9 7950X
          allProducts.gpu[1], // NVIDIA RTX 4080
          allProducts.memory[0], // Corsair DDR5 64GB
          allProducts.storage[0] // Samsung 990 PRO 2TB
        ];
        setSelectedProducts(recommended);
        message.info('已应用默认推荐配置');
      }
    } catch (err) {
      console.error('获取推荐配置失败:', err);
      message.error('获取推荐配置失败');
    } finally {
      setIsLoading(false);
    }
  }, [solutionData?.budget]);

  // 处理下一步 - 优化用户体验
  const handleNextStep = useCallback(() => {
    if (selectedProducts.length === 0) {
      message.warning('请至少选择一些硬件产品');
      return;
    }
    
    if (compatibilityResult.status === 'incompatible') {
      // 使用更友好的确认对话框
      if (!showCompatibilityWarning && 
          !window.confirm('当前配置存在兼容性问题，可能影响系统性能和稳定性。\n您确定要继续吗？')) {
        setShowCompatibilityWarning(true);
        return;
      }
    }
    
    setIsLoading(true);
    
    // 保存并延迟跳转以显示加载状态
    setTimeout(() => {
      try {
        updateSolutionData({
          hardwareConfig: {
            selectedProducts,
            totalPrice: calculateTotalPrice,
            performanceScore,
            compatibilityStatus: compatibilityResult.status
          }
        });
        onNext();
      } catch (err) {
        console.error('保存配置失败:', err);
        message.error('保存配置失败，请稍后重试');
        setIsLoading(false);
      }
    }, 500);
  }, [selectedProducts, calculateTotalPrice, performanceScore, compatibilityResult.status, showCompatibilityWarning, updateSolutionData, onNext]);

  // 渲染兼容性状态
  const renderCompatibilityStatus = () => {
    const statusMap = {
      compatible: { text: '完全兼容', color: '#52c41a' },
      partial: { text: '部分兼容', color: '#faad14' },
      incompatible: { text: '不兼容', color: '#ff4d4f' },
      unknown: { text: '等待检查', color: '#d9d9d9' }
    };
    const status = statusMap[compatibilityResult.status];
    
    return (
      <div className="compatibility-status">
        <h4>兼容性检查</h4>
        <div className="status-badge" style={{ color: status.color }}>
          {status.text}
        </div>
        {compatibilityResult.issues.length > 0 && (
          <ul className="compatibility-issues">
            {compatibilityResult.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };



  return (
      <div className="hardware-config-center fade-in">
        {/* 步骤导航 */}
        <Card className="card-shadow" style={{ marginBottom: 16 }}>
          <div className="step-nav">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Button onClick={onBack}>
                ← 返回
              </Button>
              <h2>AI软硬件配置中心</h2>
              <Button type="primary" onClick={onNext} disabled={isLoading || selectedProducts.length === 0}>
                下一步 →
              </Button>
            </div>
            <div className="progress-indicator">
              <div className="step active">预算方案</div>
              <div className="step active current">硬件配置</div>
              <div className="step">设计方案</div>
              <div className="step">方案生成</div>
              <div className="step">方案管理</div>
            </div>
            
            {/* 预算信息展示 */}
            <div className="budget-info">
              <Title level={5}>根据您的预算方案，选择适合的硬件产品配置</Title>
              <Paragraph>您的预算范围：¥{solutionData?.budget?.toLocaleString() || '未设置'}</Paragraph>
              {error && (
                <div className="error-message" style={{ color: '#ff4d4f', margin: '10px 0' }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </Card>
        <div className="config-content">
        {/* 左侧分类导航 */}
        <div className="category-sidebar">
          <h3>产品分类</h3>
          <ul className="category-list">
            {hardwareCategories.map(category => (
              <li
                key={category.id}
                className={selectedCategory === category.id ? 'active' : ''}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 中间产品展示区 */}
        <div className="product-display">
          <div className="product-header">
            <h3>{hardwareCategories.find(c => c.id === selectedCategory)?.name}</h3>
            <div className="product-controls">
              <Select 
                value={sortBy} 
                onChange={(value) => !isLoading && setSortBy(value)}
                style={{width: 120}}
                disabled={isLoading}
              >
                <Option value="price">按价格排序</Option>
                <Option value="performance">按性能排序</Option>
                <Option value="stock">按库存排序</Option>
              </Select>
              <Select 
                value={filterBrand} 
                onChange={(value) => !isLoading && setFilterBrand(value)}
                style={{width: 120, marginLeft: 10}}
                disabled={isLoading}
              >
                {getBrands().map(brand => (
                  <Option key={brand} value={brand}>
                    {brand === 'all' ? '全部品牌' : brand}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="product-grid">
            {isLoading ? (
              <div className="loading-message">正在加载产品数据...</div>
            ) : sortedAndFilteredProducts.length > 0 ? (
              sortedAndFilteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  className={`product-card transition-all ${selectedProducts.some(p => p.id === product.id) ? 'selected' : ''} card-shadow`}
                  hoverable
                  size="small"
                >
                  <div className="product-image">
                    {/* 这里可以放产品图片占位符 */}
                    <div className="image-placeholder">{product.brand[0]}</div>
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <div className="product-brand">品牌：{product.brand}</div>
                    <div className="product-specs">规格：{product.specs}</div>
                    <div className="product-price">¥{product.price}</div>
                    <div className="product-stock">库存：{product.stock}</div>
                    {product.performance && (
                      <Badge 
                        count={`${product.performance}/100`}
                        color={product.performance >= 80 ? 'green' : product.performance >= 60 ? 'blue' : 'orange'}
                        style={{marginTop: 5}}
                      />
                    )}
                    <Button 
                      type={selectedProducts.some(p => p.id === product.id) ? 'default' : 'primary'}
                      onClick={() => !isLoading && handleSelectProduct(product)}
                      disabled={isLoading}
                      loading={isLoading}
                      style={{marginTop: 10, width: '100%'}}
                      className="transition-all"
                    >
                      {selectedProducts.some(p => p.id === product.id) ? '取消选择' : '选择'}
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="no-data">没有找到匹配的产品，请尝试修改筛选条件</div>
            )}
          </div>

        {/* 右侧配置面板 */}
        <div className="config-panel">
          <Card className="panel-section card-shadow">
            <h3>当前配置</h3>
            <div className="selected-products-list">
              {selectedProducts.map(product => (
                <div key={product.id} className="selected-product-item">
                  <span>{product.name}</span>
                  <span className="product-price">¥{product.price}</span>
                  <Button 
                    size="small"
                    danger
                    onClick={() => handleSelectProduct(product)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              {selectedProducts.length === 0 && (
                <div className="empty-config">尚未选择任何产品</div>
              )}
            </div>
            <div className="total-price">
              总计：¥{calculateTotalPrice()}
            </div>
          </Card>

          {renderCompatibilityStatus()}

          <Card className="performance-section card-shadow">
            <h3>配置评分</h3>
            <div className="performance-score">
              <Badge 
                count={`${performanceScore}/100`}
                color={performanceScore >= 80 ? 'green' : performanceScore >= 60 ? 'blue' : 'orange'}
                style={{ fontSize: 18, padding: '20px 10px' }}
              />
              <div className="performance-bar">
                <div 
                  className="performance-fill"
                  style={{ width: `${performanceScore}%` }}
                ></div>
              </div>
              {performanceScore < 60 && (
                <div className="score-warning">建议增加高性能硬件以提升整体性能</div>
              )}
              <div className="performance-tips">
                {performanceScore >= 80 && '优秀的配置，适合专业AI应用'}
                {performanceScore >= 60 && performanceScore < 80 && '良好的配置，可以满足大多数AI应用需求'}
                {performanceScore >= 40 && performanceScore < 60 && '基础配置，适合入门级AI应用'}
                {performanceScore < 40 && performanceScore > 0 && '配置较低，建议升级关键组件'}
                {performanceScore === 0 && '请选择产品后查看性能评分'}
              </div>
            </div>
          </Card>

          <div className="action-buttons">
            <Space style={{width: '100%', justifyContent: 'space-between', flexWrap: 'wrap'}}>
              <Button 
                onClick={handleResetConfig} 
                disabled={isLoading}
                danger
              >
                重置配置
              </Button>
              <Button 
                onClick={handleViewRecommended} 
                disabled={isLoading || !solutionData?.budget}
                className="transition-all"
              >
                查看推荐配置
              </Button>
              <Button 
                onClick={handleSaveConfig} 
                type="primary"
                disabled={isLoading || selectedProducts.length === 0}
              >
                保存配置
              </Button>
              <Button 
                onClick={onBack} 
                disabled={isLoading}
                className="transition-all"
              >
                上一步
              </Button>
              <Button 
                onClick={handleNextStep} 
                type="primary"
                disabled={isLoading || !canProceed}
                loading={isLoading}
                className="transition-all"
              >
                下一步
              </Button>
              </Space>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };

export default HardwareConfigCenter;