import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AISolutionCenter.css';
import './components/AISolution/AISolutionStyles.css';

// 导入功能模块
import BudgetPlanner from './components/AISolution/BudgetPlanner';
import DesignCenter from './components/AISolution/DesignCenter';
import ProposalGenerator from './components/AISolution/ProposalGenerator';

const AISolutionCenter = () => {
  // 使用路由相关功能
  const location = useLocation();
  const navigate = useNavigate();
  
  // 当前步骤：1-方案配置 2-方案预览 3-效果图生成
  const [currentStep, setCurrentStep] = useState(1);
  // 全局加载状态
  const [isStepLoading, setIsStepLoading] = useState(false);
  // 步骤切换动画状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 存储整个流程的数据
  const [solutionData, setSolutionData] = useState({
    // 预算方案数据
    schoolType: '',
    spaceArea: '',
    budget: 0,
    paymentMethod: '',
    // 硬件配置数据
    hardwareConfig: {},
    // 设计方案数据
    designConfig: {},
    // 生成的方案
    generatedProposal: null,
    detailedProposal: null
  });
  
  // 页面加载时，从localStorage恢复数据
  useEffect(() => {
    const savedData = localStorage.getItem('currentAISolution');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSolutionData(parsedData);
      } catch (error) {
        console.error('恢复保存的数据失败:', error);
      }
    }
    
    // 检查URL参数是否指定了步骤
    const stepParam = new URLSearchParams(location.search).get('step');
    if (stepParam && !isNaN(stepParam) && stepParam >= 1 && stepParam <= 3) {
      setCurrentStep(parseInt(stepParam));
    }
  }, [location.search]);
  
  // 内存缓存引用
  const solutionDataRef = useRef(solutionData);
  
  // 防抖保存函数
  const debouncedSaveToLocalStorage = useCallback(
    debounce((data) => {
      try {
        localStorage.setItem('currentAISolution', JSON.stringify(data));
      } catch (error) {
        console.error('保存数据到localStorage失败:', error);
      }
    }, 500),
    []
  );
  
  // 数据变化时自动保存到localStorage（防抖优化）
  useEffect(() => {
    solutionDataRef.current = solutionData;
    debouncedSaveToLocalStorage(solutionData);
  }, [solutionData, debouncedSaveToLocalStorage]);
  
  // 防抖函数实现
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 检查是否已完成前面的步骤
  const hasCompletedPrevSteps = (targetStep) => {
    // 优化导航条件，允许从预算方案直接访问所有后续步骤
    return true;
  };

  // 切换到下一步
  const handleNextStep = useCallback(async () => {
    if (currentStep < 3) {
      // 开始过渡动画
      setIsTransitioning(true);
      
      // 模拟短暂延迟以确保动画可见
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      // 设置加载状态
      setIsStepLoading(true);
      // 更新URL参数
      navigate(`/ai-solution?step=${newStep}`, { replace: true });
      
      // 模拟加载完成
      setTimeout(() => {
        setIsStepLoading(false);
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentStep, navigate]);

  // 返回上一步
  const handlePrevStep = useCallback(async () => {
    if (currentStep > 1) {
      // 开始过渡动画
      setIsTransitioning(true);
      
      // 模拟短暂延迟以确保动画可见
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      // 设置加载状态
      setIsStepLoading(true);
      // 更新URL参数
      navigate(`/ai-solution?step=${newStep}`, { replace: true });
      
      // 模拟加载完成
      setTimeout(() => {
        setIsStepLoading(false);
        setIsTransitioning(false);
      }, 500);
    }
  }, [currentStep, navigate]);

  // 直接跳转到指定步骤
  const handleStepJump = useCallback(async (step) => {
    // 检查是否满足跳转条件
    if (step === currentStep) return; // 已经在当前步骤，无需跳转
    
    if (step <= 1 || hasCompletedPrevSteps(step)) {
      // 开始过渡动画
      setIsTransitioning(true);
      
      // 模拟短暂延迟以确保动画可见
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep(step);
      // 设置加载状态
      setIsStepLoading(true);
      // 更新URL参数
      navigate(`/ai-solution?step=${step}`, { replace: true });
      
      // 模拟加载完成
      setTimeout(() => {
        setIsStepLoading(false);
        setIsTransitioning(false);
      }, 500);
    } else {
      // 使用更友好的提示方式
      const Toast = window.antd?.message || { info: alert };
      Toast.info('请先完成前面的步骤', 2);
    }
  }, [currentStep, hasCompletedPrevSteps, navigate]);

  // 更新解决方案数据
  const updateSolutionData = useCallback((key, data) => {
    // 支持两种调用方式：
    // 1. updateSolutionData(key, data) - 更新单个键
    // 2. updateSolutionData(object) - 批量更新多个键
    setSolutionData(prev => {
      // 如果第一个参数是对象，则批量更新
      if (typeof key === 'object' && key !== null && data === undefined) {
        return { ...prev, ...key };
      }

      // 否则更新单个键
      if (JSON.stringify(prev[key]) === JSON.stringify(data)) {
        return prev;
      }

      return {
        ...prev,
        [key]: data
      };
    });
  }, []);
  
  // 获取当前解决方案数据（带内存缓存）
  const getCurrentSolutionData = useCallback(() => {
    return solutionDataRef.current;
  }, []);

  // 重置所有数据
  const handleResetAll = useCallback(() => {
    if (window.confirm('确定要重置所有数据吗？此操作不可恢复。')) {
      const initialData = {
        schoolType: '',
        spaceArea: '',
        budget: 0,
        paymentMethod: '',
        hardwareConfig: {},
        designConfig: {},
        generatedProposal: null,
        detailedProposal: null
      };
      
      setSolutionData(initialData);
      solutionDataRef.current = initialData;
      setCurrentStep(1);
      navigate('/ai-solution?step=1', { replace: true });
      
      // 立即清除localStorage（不使用防抖）
      try {
        localStorage.removeItem('currentAISolution');
      } catch (error) {
        console.error('清除localStorage数据失败:', error);
      }
    }
  }, [navigate]);

  // 获取步骤状态（使用useMemo缓存结果）
  const getStepStatus = useCallback((step) => {
    if (step < currentStep && hasCompletedPrevSteps(step + 1)) {
      return 'completed';
    } else if (step === currentStep) {
      return 'active';
    } else if (step > currentStep && hasCompletedPrevSteps(step)) {
      return 'completed';
    }
    return 'disabled';
  }, [currentStep, hasCompletedPrevSteps]);
  
  // 缓存步骤状态数组
  const stepStatuses = useMemo(() => {
    return [1, 2, 3].map(step => getStepStatus(step));
  }, [getStepStatus]);

  // 使用useMemo缓存当前步骤组件，避免不必要的重渲染
  const currentStepComponent = useMemo(() => {
    // 传递全局加载状态和缓存相关的props给各个组件
    const commonProps = {
      solutionData,
      updateSolutionData,
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      isStepLoading,
      setIsStepLoading,
      getCurrentSolutionData
    };
    
    switch (currentStep) {
      case 1:
        return <BudgetPlanner {...commonProps} />;
      case 2:
        return <DesignCenter {...commonProps} />;
      case 3:
        return <ProposalGenerator {...commonProps} />;
      default:
        return <BudgetPlanner {...commonProps} />;
    }
  }, [currentStep, solutionData, updateSolutionData, handleNextStep, handlePrevStep, isStepLoading, setIsStepLoading, getCurrentSolutionData]);
  
  // 渲染当前步骤的组件
  const renderCurrentStep = useCallback(() => {
    return currentStepComponent;
  }, [currentStepComponent]);

  return (
    <div className="ai-solution-center fade-in">
      {/* 顶部标题区域 */}
      <div className="step-nav">
        <div className="header-content">
          <h2>校园AI解决方案交付中心</h2>
          <p style={{ color: '#8c8c8c', marginBottom: '16px' }}>智能化的AI实验室建设方案生成平台</p>
        </div>
        
        {/* 步骤导航 - 使用优化的状态管理 */}
      <div className="progress-indicator">
        {[
          { step: 1, title: '方案配置' },
          { step: 2, title: '方案预览' },
          { step: 3, title: '效果图生成' }
        ].map(({ step, title }) => (
          <div
            key={step}
            className={`step ${getStepStatus(step)}`}
            onClick={() => handleStepJump(step)}
            style={{
              cursor: getStepStatus(step) === 'disabled' ? 'not-allowed' : 'pointer',
              opacity: getStepStatus(step) === 'disabled' ? 0.6 : 1
            }}
          >
            {title}
          </div>
        ))}
      </div>
        
        {/* 重置按钮 */}
        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <button 
            onClick={handleResetAll} 
            className="back-button"
            title="重置所有数据"
            style={{ padding: '6px 16px', borderRadius: '4px', border: '1px solid #d9d9d9', cursor: 'pointer' }}
          >
            重置所有数据
          </button>
        </div>
      </div>
      
      {/* 主要内容区域 - 添加过渡动画和加载状态 */}
      <div className={`main-content fade-in ${isTransitioning ? 'fade-out' : ''}`}>
        {isStepLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px', fontSize: '16px', color: '#1890ff' }}>正在加载内容，请稍候...</p>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </div>
      
      {/* 底部提示 */}
      <div style={{ textAlign: 'center', marginTop: '24px', color: '#1890ff', fontSize: '14px' }}>
        <p>💡 提示：您可以随时返回修改前面的步骤，系统会自动保存您的进度。</p>
      </div>
    </div>
  );
};

export default AISolutionCenter;
