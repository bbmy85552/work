import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Select, Empty } from 'antd';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import dataCenterData from '../../mock/dataCenterData.js';
import customerData from '../../mock/customerData.js';
import deliveryData from '../../mock/deliveryData.js';

const { Title, Text } = Typography;
const { Option } = Select;

// 颜色主题配置
const COLORS = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#13c2c2',
  purple: '#722ed1',
  pink: '#eb2f96',
  chartColors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2', '#722ed1', '#eb2f96']
};

const DataVisualizationDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState('全部');
  const [selectedCustomerType, setSelectedCustomerType] = useState('全部');
  const [filteredSchools, setFilteredSchools] = useState(customerData.allCustomers);
  const [customerTypeDistribution, setCustomerTypeDistribution] = useState([]);
  const [regionDistribution, setRegionDistribution] = useState([]);
  const [schoolTypeDistribution, setSchoolTypeDistribution] = useState([]);
  const [businessRevenueData, setBusinessRevenueData] = useState([]);
  const [deliveryStatusData, setDeliveryStatusData] = useState([]);
  const [schoolPerformanceData, setSchoolPerformanceData] = useState([]);

  // 筛选学校数据
  useEffect(() => {
    try {
      let schools = [...(schoolData?.allSchools || [])];
      
      if (selectedRegion && selectedRegion !== '全部') {
        schools = schools.filter(school => school?.region === selectedRegion);
      }
      
      if (selectedCustomerType && selectedCustomerType !== '全部') {
        schools = schools.filter(school => school?.customerType === selectedCustomerType);
      }
      
      setFilteredSchools(schools);
    } catch (error) {
      console.error('学校数据筛选失败:', error);
      setFilteredSchools([]);
    }
  }, [selectedRegion, selectedCustomerType]);

  // 计算各种分布数据
  useEffect(() => {
    try {
      // 客户类型分布（添加空值检查）
      const customerTypeMap = {};
      filteredSchools.forEach(school => {
        const type = school?.customerType || '未知类型';
        customerTypeMap[type] = (customerTypeMap[type] || 0) + 1;
      });
      const customerTypeData = Object.keys(customerTypeMap).map(key => ({
        name: key,
        value: customerTypeMap[key]
      }));
      setCustomerTypeDistribution(customerTypeData);

      // 地区分布（添加空值检查）
      const regionMap = {};
      filteredSchools.forEach(school => {
        const region = school?.region || '未知地区';
        regionMap[region] = (regionMap[region] || 0) + 1;
      });
      const regionData = Object.keys(regionMap).map(key => ({
        name: key,
        value: regionMap[key]
      }));
      setRegionDistribution(regionData);

      // 学校类型分布（添加空值检查）
      const schoolTypeMap = {};
      filteredSchools.forEach(school => {
        const type = school?.schoolType || '未知类型';
        schoolTypeMap[type] = (schoolTypeMap[type] || 0) + 1;
      });
      const schoolTypeData = Object.keys(schoolTypeMap).map(key => ({
        name: key,
        value: schoolTypeMap[key]
      }));
      setSchoolTypeDistribution(schoolTypeData);

      // 业务收入数据（基于合作学校，添加错误处理）
      try {
        const cooperationSchools = (schoolData?.cooperationSchools || []).filter(school => 
          filteredSchools.some(s => s?.id === school?.id)
        );
        
        const projectRevenueMap = {};
        cooperationSchools.forEach(school => {
          if (school?.cooperationProjects && Array.isArray(school.cooperationProjects)) {
            school.cooperationProjects.forEach(project => {
              projectRevenueMap[project] = (projectRevenueMap[project] || 0) + (school.cooperationAmount || 0);
            });
          }
        });
        
        const revenueData = Object.keys(projectRevenueMap).map(key => ({
          name: key,
          revenue: projectRevenueMap[key]
        }));
        setBusinessRevenueData(revenueData);
      } catch (error) {
        console.error('计算业务收入数据失败:', error);
        setBusinessRevenueData([]);
      }

      // 交付状态数据（添加错误处理和空值检查）
      try {
        const schoolIds = filteredSchools.map(s => s?.id).filter(Boolean);
        const deliveries = (deliveryData?.deliveries || []).filter(delivery => 
          delivery && schoolIds.some(id => delivery.orderId?.includes(id))
        );
        
        const deliveryStatusMap = {};
        deliveries.forEach(delivery => {
          const status = delivery?.deliveryStatus || '未知状态';
          deliveryStatusMap[status] = (deliveryStatusMap[status] || 0) + 1;
        });
        
        const statusData = Object.keys(deliveryStatusMap).map(key => ({
          name: key,
          value: deliveryStatusMap[key]
        }));
        setDeliveryStatusData(statusData);
      } catch (error) {
        console.error('计算交付状态数据失败:', error);
        setDeliveryStatusData([]);
      }

      // 学校表现数据（增强数据验证和性能优化）
      try {
        const performanceData = (dataCenterData?.schoolRanking || [])
          .filter(school => 
            school && filteredSchools.some(s => 
              s?.schoolName && school?.name && 
              (s.schoolName.includes(school.name) || school.name.includes(s.schoolName))
            )
          )
          .slice(0, 6);
        setSchoolPerformanceData(performanceData);
      } catch (error) {
        console.error('计算学校表现数据失败:', error);
        setSchoolPerformanceData([]);
      }
    } catch (error) {
      console.error('数据分布计算失败:', error);
      // 重置所有状态
      setCustomerTypeDistribution([]);
      setRegionDistribution([]);
      setSchoolTypeDistribution([]);
      setBusinessRevenueData([]);
      setDeliveryStatusData([]);
      setSchoolPerformanceData([]);
    }
  }, [filteredSchools]);

  // 获取所有地区选项（增强空值检查）
  const getRegionOptions = () => {
    try {
      if (!customerData || !customerData.allCustomers || !Array.isArray(customerData.allCustomers)) {
        console.warn('客户数据结构异常');
        return [{ label: '全部', value: '全部' }];
      }
      const regions = [...new Set(customerData.allCustomers
        .filter(customer => customer && customer.region)
        .map(customer => customer.region))];
      return [{ label: '全部', value: '全部' }, ...regions.map(region => ({ label: region, value: region }))];
    } catch (error) {
      console.error('获取地区选项失败:', error);
      return [{ label: '全部', value: '全部' }];
    }
  };

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '10px',
          borderRadius: '4px',
          color: '#fff'
        }}>
          <p style={{ margin: 0 }}>{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{
              margin: '5px 0 0 0',
              color: entry.color || COLORS.chartColors[index % COLORS.chartColors.length]
            }}>
              {`${entry.name || entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 格式化数字显示
  const formatNumber = (num) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 格式化金额显示
  const formatCurrency = (value) => {
    if (value >= 10000) {
      return `¥${(value / 10000).toFixed(1)}万`;
    }
    return `¥${value}`;
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <Title level={4} style={{ marginBottom: '24px', color: '#333' }}>数据中心分析大屏</Title>
      
      {/* 筛选器区域 */}
      <Card style={{ marginBottom: '24px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Text style={{ marginRight: '8px' }}>地区筛选：</Text>
            <Select
              value={selectedRegion}
              onChange={setSelectedRegion}
              style={{ width: '120px' }}
              allowClear
            >
              {getRegionOptions().map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Text style={{ marginRight: '8px' }}>客户类型：</Text>
            <Select
              value={selectedCustomerType}
              onChange={setSelectedCustomerType}
              style={{ width: '120px' }}
              allowClear
            >
              <Option value="全部">全部</Option>
              <Option value="重点学校">重点学校</Option>
              <Option value="示范学校">示范学校</Option>
              <Option value="普通学校">普通学校</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'right' }}>
            <Text type="secondary">筛选结果：共 {filteredSchools.length} 所学校</Text>
          </Col>
        </Row>
      </Card>

      {/* 第一行图表 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* 客户类型分布 */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title="客户类型分布" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '300px', display: 'flex', flexDirection: 'column' }}
          >
            {customerTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatNumber} content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '60px' }} />
            )}
          </Card>
        </Col>

        {/* 地区分布 */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title="地区分布" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '300px', display: 'flex', flexDirection: 'column' }}
          >
            {regionDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionDistribution.sort((a, b) => b.value - a.value).slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip formatter={formatNumber} content={<CustomTooltip />} />
                  <Bar dataKey="value" name="学校数量">
                    {regionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '60px' }} />
            )}
          </Card>
        </Col>

        {/* 学校类型分布 */}
        <Col xs={24} md={24} lg={8}>
          <Card 
            title="学校类型分布" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '300px', display: 'flex', flexDirection: 'column' }}
          >
            {schoolTypeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schoolTypeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill={COLORS.primary}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {schoolTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatNumber} content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '60px' }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 第二行图表 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* 业务收入分布 */}
        <Col xs={24} lg={12}>
          <Card 
            title="业务收入分布（按项目类型）" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '350px', display: 'flex', flexDirection: 'column' }}
          >
            {businessRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={businessRevenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={formatCurrency} content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="收入金额" fill={COLORS.purple} radius={[4, 4, 0, 0]}>
                    {businessRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '80px' }} />
            )}
          </Card>
        </Col>

        {/* 交付状态分析 */}
        <Col xs={24} lg={12}>
          <Card 
            title="项目交付状态分析" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '350px', display: 'flex', flexDirection: 'column' }}
          >
            {deliveryStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill={COLORS.primary}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deliveryStatusData.map((entry, index) => {
                      let color = COLORS.chartColors[index % COLORS.chartColors.length];
                      // 为不同状态设置特定颜色
                      if (entry.name === '已交付通过') color = COLORS.success;
                      else if (entry.name === '未交付通过') color = COLORS.warning;
                      else if (entry.name === '部分未通过') color = COLORS.error;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip formatter={formatNumber} content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '80px' }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 第三行图表 */}
      <Row gutter={[24, 24]}>
        {/* 学校活跃度分析 */}
        <Col xs={24} lg={12}>
          <Card 
            title="学校活跃度分析" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '350px', display: 'flex', flexDirection: 'column' }}
          >
            {dataCenterData.schoolRanking.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataCenterData.schoolRanking.slice(0, 5)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="usageRate" name="使用率 (%)" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '80px' }} />
            )}
          </Card>
        </Col>

        {/* 设备使用分析 */}
        <Col xs={24} lg={12}>
          <Card 
            title="设备使用分析" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '350px', display: 'flex', flexDirection: 'column' }}
          >
            {dataCenterData.deviceUsageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dataCenterData.deviceUsageData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={formatNumber} content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="使用占比 (%)" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '80px' }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 第四行图表 - 学校表现雷达图 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card 
            title="核心学校综合表现分析" 
            variant="outlined"
            className="dashboard-card"
            style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
          >
            {schoolPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={120} data={[
                  {
                    subject: '使用率',
                    ...schoolPerformanceData.reduce((acc, school, index) => {
                      acc[`${school.name}`] = school.usageRate;
                      return acc;
                    }, {})
                  },
                  {
                    subject: '课程数量',
                    ...schoolPerformanceData.reduce((acc, school, index) => {
                      acc[`${school.name}`] = Math.min(100, (school.openCourse / 10000) * 10);
                      return acc;
                    }, {})
                  },
                  {
                    subject: '平均使用时长',
                    ...schoolPerformanceData.reduce((acc, school, index) => {
                      acc[`${school.name}`] = Math.min(100, (school.avgUsage / 10000) * 10);
                      return acc;
                    }, {})
                  }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  {schoolPerformanceData.map((entry, index) => (
                    <Radar
                      key={index}
                      name={entry.name}
                      dataKey={entry.name}
                      stroke={COLORS.chartColors[index % COLORS.chartColors.length]}
                      fill={COLORS.chartColors[index % COLORS.chartColors.length]}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无数据" style={{ marginTop: '100px' }} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataVisualizationDashboard;
