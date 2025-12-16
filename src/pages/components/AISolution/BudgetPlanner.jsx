import React, { useState, useEffect, useCallback } from 'react';
import { Card, Select, InputNumber, Radio, Button, Table, Tag, Divider, message, Typography, Space } from 'antd';
import { SaveOutlined, ArrowRightOutlined, UndoOutlined, FileSearchOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Group, Button: RadioButton } = Radio;
const { Title, Paragraph } = Typography;

const BudgetPlanner = ({ solutionData, updateSolutionData, onNext, onBack }) => {
  // 状态管理
  const [schoolType, setSchoolType] = useState('');
  const [spaceArea, setSpaceArea] = useState(50);
  const [customArea, setCustomArea] = useState(null);
  const [budgetRange, setBudgetRange] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [computedBudget, setComputedBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 获取付款方式文本
  const getPaymentMethodText = (method) => {
    if (!method) return '-';
    const paymentOptions = {
      full: '一次性全款支付（97折）', 
      '80-20': '80% + 20%分期支付',
      '70-30': '70% + 30%分期支付',
      '50-50': '50% + 50%分期支付'
    };
    return paymentOptions[method] || '-';
  };

  // 初始化数据
  useEffect(() => {
    if (solutionData) {
      setSchoolType(solutionData.schoolType || '');
      setSpaceArea(solutionData.spaceArea || 50);
      setCustomArea(solutionData.customArea || null);
      setBudgetRange(solutionData.budgetRange || '');
      setPaymentMethod(solutionData.paymentMethod || '');
    }
  }, [solutionData]);

  // 防抖函数
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 计算预算的函数
  const calculateBudget = useCallback(() => {
    if (schoolType && budgetRange && paymentMethod) {
      setIsLoading(true);
      // 模拟计算延迟
      setTimeout(() => {
        // 模拟计算逻辑
        let baseBudget = 0;
        switch (budgetRange) {
          case '10w': baseBudget = 100000; break;
          case '20w': baseBudget = 200000; break;
          case '30w': baseBudget = 300000; break;
          case '50w+': baseBudget = 500000; break;
          default: baseBudget = 200000;
        }

        // 空间面积影响因子
        const areaFactor = (customArea || spaceArea) / 50;
        const totalBudget = baseBudget * areaFactor;

        // 付款方式折扣
        let discount = 1;
        switch (paymentMethod) {
          case 'full': discount = 0.97; break; // 3%折扣
          case '80-20':
          case '70-30':
          case '50-50':
          default: discount = 1;
        }

        const finalBudget = totalBudget * discount;

        // 计算详细费用构成
        const budgetDetails = {
          total: finalBudget,
          hardware: finalBudget * 0.6, // 硬件60%
          software: finalBudget * 0.2, // 软件20%
          service: finalBudget * 0.2,  // 服务20%
          discount,
          payment: paymentMethod
        };
        
        setComputedBudget(budgetDetails);

        // 更新方案数据
        const budgetData = {
          schoolType,
          spaceArea: customArea || spaceArea,
          budgetRange,
          paymentMethod,
          details: budgetDetails
        };
        
        updateSolutionData('budget', budgetData);
        setIsLoading(false);
      }, 300);
    }
  }, [schoolType, spaceArea, customArea, budgetRange, paymentMethod, updateSolutionData]);

  // 防抖处理的预算计算
  const debouncedCalculateBudget = useCallback(debounce(calculateBudget, 300), [calculateBudget]);

  // 根据选择计算预算 - 使用防抖
  useEffect(() => {
    debouncedCalculateBudget();
    
    // 清理函数
    return () => {
      // 清除防抖定时器
      if (debouncedCalculateBudget.timeout) {
        clearTimeout(debouncedCalculateBudget.timeout);
      }
    };
  }, [debouncedCalculateBudget]);

  // 保存方案
  const handleSave = useCallback(() => {
    if (!schoolType) {
      message.warning('请选择学校类型');
      return false;
    }
    if (!budgetRange) {
      message.warning('请选择预算范围');
      return false;
    }
    if (!paymentMethod) {
      message.warning('请选择付款方式');
      return false;
    }
    
    try {
      // 确保computedBudget已计算完成
      const budgetData = {
        schoolType,
        spaceArea: customArea || spaceArea,
        budgetRange,
        paymentMethod,
        computedBudget
      };
      
      // 正确使用updateSolutionData函数设置所有必要字段
      updateSolutionData('budget', computedBudget?.total || 0);
      updateSolutionData('schoolType', schoolType);
      updateSolutionData('spaceArea', customArea || spaceArea);
      updateSolutionData('budgetRange', budgetRange);
      updateSolutionData('paymentMethod', paymentMethod);
      updateSolutionData('budgetDetails', budgetData);
      
      // 优化localStorage写入，避免频繁写入
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('savedBudgetPlan', JSON.stringify(budgetData));
      }
      
      message.success('方案已保存');
      return true; // 返回true表示保存成功
    } catch (error) {
      console.error('保存方案失败:', error);
      message.error('保存失败，请稍后重试');
      return false;
    }
  }, [schoolType, spaceArea, customArea, budgetRange, paymentMethod, computedBudget, updateSolutionData]);

  // 重置
  const handleReset = () => {
    setSchoolType('');
    setSpaceArea(50);
    setCustomArea(null);
    setBudgetRange('');
    setPaymentMethod('');
    setComputedBudget(null);
    
    // 重置全局数据
    updateSolutionData('budget', {
      schoolType: '',
      spaceArea: 50,
      budgetRange: '',
      paymentMethod: '',
      details: null
    });
  };

  // 查看案例
  const handleViewCases = () => {
    if (!schoolType) {
      message.warning('请先选择学校类型');
      return;
    }
    
    const schoolTypeMap = {
      primary: '小学',
      junior: '初中',
      senior: '高中',
      vocational: '职校',
      university: '大学'
    };
    
    message.info(`正在查询${schoolTypeMap[schoolType]}相关案例...`);
    // 这里可以实现查看案例的逻辑，比如打开模态框或跳转到案例页面
  };

  // 预算分配表数据
  const budgetTableData = computedBudget ? [
    { key: '1', name: '硬件费用', amount: computedBudget.hardware, percentage: 60 },
    { key: '2', name: '软件费用', amount: computedBudget.software, percentage: 20 },
    { key: '3', name: '服务费用', amount: computedBudget.service, percentage: 20 },
    { key: '4', name: '总计', amount: computedBudget.total, percentage: 100, isTotal: true }
  ] : [];

  // 表格列配置
  const budgetTableColumns = [
    {
      title: '费用类型',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span style={{ fontWeight: record.isTotal ? 'bold' : 'normal' }}>{text}</span>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <span style={{ fontWeight: record.isTotal ? 'bold' : 'normal', color: record.isTotal ? '#1890ff' : '#333' }}>
          ¥{text.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => <Tag color="blue">{text}%</Tag>
    }
  ];

  // 推荐硬件配置（模拟数据）
  const recommendedHardware = schoolType && budgetRange ? [
    {
      name: 'AI工作站',
      quantity: Math.ceil((customArea || spaceArea) / 25),
      description: '高性能GPU工作站'
    },
    {
      name: '服务器',
      quantity: 1,
      description: '数据存储和处理服务器'
    },
    {
      name: '网络设备',
      quantity: 1,
      description: '高性能交换机和路由器'
    }
  ] : [];

  return (
    <div className="budget-planner fade-in">
      <div className="two-column-layout">
        {/* 左侧配置面板 */}
        <div className="left-panel">
          <Card title="预算方案配置" variant="outlined" className="card-shadow">
            <Title level={5}>请根据学校实际情况，选择合适的配置选项</Title>
            <Paragraph>您的选择将直接影响后续的硬件配置和方案设计</Paragraph>
            {/* 学校类型选择 */}
            <div className="config-section">
              <h4>学校类型 <span style={{color: '#ff4d4f'}}>*</span></h4>
              <Select
                placeholder="请选择学校类型"
                style={{ width: '100%' }}
                value={schoolType}
                onChange={setSchoolType}
              >
                <Option value="primary">小学</Option>
                <Option value="junior">初中</Option>
                <Option value="senior">高中</Option>
                <Option value="vocational">职校</Option>
                <Option value="university">大学</Option>
              </Select>
            </div>

            {/* 空间面积选择 */}
            <div className="config-section">
              <h4>空间面积 (平方米)</h4>
              <Radio.Group 
                value={spaceArea.toString() === 'custom' ? 'custom' : spaceArea.toString()}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setSpaceArea(0);
                  } else {
                    setSpaceArea(parseInt(e.target.value));
                    setCustomArea(null);
                  }
                }}
              >
                <RadioButton value="30">30平方</RadioButton>
                <RadioButton value="50">50平方</RadioButton>
                <RadioButton value="100">100平方</RadioButton>
                <RadioButton value="custom">其他</RadioButton>
              </Radio.Group>
              {spaceArea === 0 && (
                <InputNumber
                  style={{ width: '100%', marginTop: '10px' }}
                  min={10}
                  placeholder="请输入具体面积"
                  onChange={setCustomArea}
                />
              )}
              <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                可容纳工作站数量: {Math.ceil((customArea || spaceArea) / 25)}台
              </div>
            </div>

            {/* 方案预算选择 */}
            <div className="config-section">
              <h4>方案预算 <span style={{color: '#ff4d4f'}}>*</span></h4>
              <Select
                placeholder="请选择预算范围"
                style={{ width: '100%' }}
                value={budgetRange}
                onChange={setBudgetRange}
              >
                <Option value="10w">10万左右</Option>
                <Option value="20w">20万左右</Option>
                <Option value="30w">30万左右</Option>
                <Option value="50w+">50万以上</Option>
              </Select>
            </div>

            {/* 付款方式选择 */}
            <div className="config-section">
              <h4>付款方式 <span style={{color: '#ff4d4f'}}>*</span></h4>
              <Radio.Group 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%' }}
              >
                <Radio value="full">一次性全款支付（享受3%折扣）</Radio>
                <Radio value="80-20">80% + 20%分期支付 (首付80%，验收后支付20%)</Radio>
                <Radio value="70-30">70% + 30%分期支付 (首付70%，验收后支付30%)</Radio>
                <Radio value="50-50">50% + 50%分期支付 (首付50%，验收后支付50%)</Radio>
              </Radio.Group>
              <Space style={{marginTop: '8px', fontSize: '12px', color: '#666'}}>
                <InfoCircleOutlined />
                分期支付可在项目验收合格后再支付剩余款项
              </Space>
            </div>

            {/* 操作按钮 */}
            <div className="button-group">
              <Button 
                icon={<SaveOutlined />} 
                onClick={handleSave}
                disabled={!schoolType || !budgetRange || !paymentMethod}
                style={{ marginRight: '8px' }}
              >
                保存方案
              </Button>
              <Button 
                icon={<UndoOutlined />} 
                onClick={handleReset}
                style={{ marginRight: '8px' }}
              >
                重置
              </Button>
              <Button 
                icon={<FileSearchOutlined />} 
                onClick={handleViewCases}
                disabled={!schoolType}
                style={{ marginRight: 'auto' }}
              >
                查看案例
              </Button>
              {onBack && (
                <Button 
                  onClick={onBack}
                  style={{ marginRight: '8px' }}
                >
                  上一步
                </Button>
              )}
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />} 
                onClick={() => {
                  // 保存方案并在成功后导航到下一步
                  if (handleSave()) {
                    setTimeout(() => {
                      onNext();
                    }, 500); // 给用户一些时间看到保存成功的提示
                  }
                }}
                disabled={!schoolType || !budgetRange || !paymentMethod}
                loading={isLoading}
              >
                下一步
              </Button>
            </div>
          </Card>
        </div>

        {/* 右侧预览面板 */}
        <div className="right-panel">
          <Card title="预算方案预览" variant="outlined" className="card-shadow">
            {isLoading ? (
              <div className="loading-container">
                <div style={{ textAlign: 'center' }}>
                  <div className="progress-bar" style={{ width: '200px', margin: '0 auto 16px' }}>
                    <div className="progress-fill" style={{ width: '70%' }}></div>
                  </div>
                  <p>正在计算预算方案...</p>
                </div>
              </div>
            ) : computedBudget ? (
              <>
                {/* 总预算信息 */}
                <div className="preview-card">
                  <h5>当前配置</h5>
                  <p><strong>学校类型:</strong> {schoolType ? 
                    { primary: '小学', junior: '初中', senior: '高中', vocational: '职校', university: '大学' }[schoolType] : '-'}
                  </p>
                  <p><strong>空间面积:</strong> {customArea || spaceArea}平方米</p>
                  <p><strong>预算范围:</strong> {budgetRange ? 
                    { '10w': '10万左右', '20w': '20万左右', '30w': '30万左右', '50w+': '50万以上' }[budgetRange] : '-'}
                  </p>
                  <p><strong>付款方式:</strong> {getPaymentMethodText(paymentMethod)}</p>
                </div>

                {/* 预算分配表 */}
              <div className="preview-card">
                <h5>预算分配表</h5>
                {isLoading ? (
                  <p className="loading">正在计算预算分配...</p>
                ) : (
                  <Table
                    size="small"
                    dataSource={budgetTableData}
                    columns={budgetTableColumns}
                    pagination={false}
                    rowKey="key"
                  />
                )}
              </div>

              {/* 推荐硬件配置 */}
              <div className="preview-card">
                <h5>推荐硬件配置</h5>
                {isLoading ? (
                  <p className="loading">正在生成推荐配置...</p>
                ) : (
                  recommendedHardware.map((item, index) => (
                    <div key={index} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: index < recommendedHardware.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div><strong>{item.name}</strong> × {item.quantity}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
                    </div>
                  ))
                )}
              </div>

              {/* 交付信息 */}
              <div className="preview-card">
                <h5>交付信息</h5>
                <p><strong>交付时间:</strong> 确认订单后30-45个工作日</p>
                <p><strong>服务内容:</strong> 安装调试、培训、1年免费维护</p>
              </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <InfoCircleOutlined style={{ fontSize: '32px', marginBottom: '16px' }} />
                <p>请完成左侧配置以查看预算方案预览</p>
                <p style={{ fontSize: '12px', marginTop: '8px', color: '#bfbfbf' }}>
                  完成所有必填项后，系统将自动计算并生成预算方案
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
