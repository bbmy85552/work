import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Select, Input, Button, Tag, Empty, Spin, Modal, Image, Space } from 'antd';
import { EyeOutlined, FilterOutlined, CalendarOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import caseData from '../mock/caseData.js';
import { getImageUrl, getPlaceholderUrl, handleImageError } from '../utils/imageConfig.js';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const CaseLibrary = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    region: '',
    schoolType: '',
    category: ''
  });

  useEffect(() => {
    // 模拟加载数据
    setLoading(true);
    setTimeout(() => {
      setCases(caseData.cases);
      setFilteredCases(caseData.cases);
      setLoading(false);
    }, 500);
  }, []);

  // 筛选案例
  const handleFilter = () => {
    let result = [...cases];
    
    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(item => 
        item.schoolName.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.projectName.toLowerCase().includes(keyword)
      );
    }
    
    // 地区筛选
    if (filters.region) {
      result = result.filter(item => item.region === filters.region);
    }
    
    // 学校类型筛选
    if (filters.schoolType) {
      result = result.filter(item => item.schoolType === filters.schoolType);
    }
    
    // 项目类别筛选
    if (filters.category) {
      result = result.filter(item => item.categories.includes(filters.category));
    }
    
    setFilteredCases(result);
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({
      keyword: '',
      region: '',
      schoolType: '',
      category: ''
    });
    setFilteredCases(cases);
  };

  // 处理筛选条件变化
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // 查看案例详情
  const handleViewDetail = (caseItem) => {
    setSelectedCase(caseItem);
    setModalVisible(true);
  };

  // 获取所有地区选项
  const getRegionOptions = () => {
    const regions = [...new Set(cases.map(item => item.region))];
    return regions.map(region => ({ label: region, value: region }));
  };

  // 获取所有学校类型选项
  const getSchoolTypeOptions = () => {
    const types = [...new Set(cases.map(item => item.schoolType))];
    return types.map(type => ({ label: type, value: type }));
  };

  // 获取所有项目类别选项
  const getCategoryOptions = () => {
    const allCategories = cases.flatMap(item => item.categories);
    const uniqueCategories = [...new Set(allCategories)];
    return uniqueCategories.map(category => ({ label: category, value: category }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '32px', color: '#1890ff' }}>落地案例库</Title>
      
      {/* 筛选器区域 */}
      <Card variant="outlined" style={{ marginBottom: '24px' }}>
        <Title level={5} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', color: '#333' }}>
          <FilterOutlined style={{ marginRight: '8px' }} /> 案例筛选
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Search
              placeholder="搜索案例名称/学校/描述"
              allowClear
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              onSearch={handleFilter}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Select
              placeholder="选择地区"
              allowClear
              style={{ width: '100%' }}
              size="large"
              value={filters.region}
              onChange={(value) => handleFilterChange('region', value)}
            >
              {getRegionOptions().map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Select
              placeholder="选择学校类型"
              allowClear
              style={{ width: '100%' }}
              size="large"
              value={filters.schoolType}
              onChange={(value) => handleFilterChange('schoolType', value)}
            >
              {getSchoolTypeOptions().map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Select
              placeholder="选择项目类别"
              allowClear
              style={{ width: '100%' }}
              size="large"
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
            >
              {getCategoryOptions().map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} style={{ textAlign: 'right' }}>
            <Button type="primary" style={{ marginRight: '8px' }} onClick={handleFilter}>
              筛选
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 案例统计信息 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card variant="outlined" style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Row align="middle">
              <Col span={8}>
                <div style={{ fontSize: '32px', color: '#52c41a', textAlign: 'center' }}>
                  {cases.length}
                </div>
              </Col>
              <Col span={16}>
                <Title level={5} style={{ margin: 0, color: '#52c41a' }}>总案例数</Title>
                <Text type="secondary">所有已完成的校园项目</Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="outlined" style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Row align="middle">
              <Col span={8}>
                <div style={{ fontSize: '32px', color: '#1890ff', textAlign: 'center' }}>
                  {getRegionOptions().length}
                </div>
              </Col>
              <Col span={16}>
                <Title level={5} style={{ margin: 0, color: '#1890ff' }}>覆盖地区</Title>
                <Text type="secondary">案例分布的地区数量</Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="outlined" style={{ backgroundColor: '#fff7e6', borderColor: '#ffd591' }}>
            <Row align="middle">
              <Col span={8}>
                <div style={{ fontSize: '32px', color: '#fa8c16', textAlign: 'center' }}>
                  {getSchoolTypeOptions().length}
                </div>
              </Col>
              <Col span={16}>
                <Title level={5} style={{ margin: 0, color: '#fa8c16' }}>学校类型</Title>
                <Text type="secondary">不同类型的学校数量</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 案例列表 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '16px' }}>加载案例中...</Text>
        </div>
      ) : filteredCases.length > 0 ? (
        <Row gutter={[16, 16]}>
          {filteredCases.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                variant="outlined"
                hoverable
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                cover={
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <Image
                      src={getImageUrl(item.coverImage)}
                      alt={item.projectName}
                      placeholder={
                        <img
                          src={getPlaceholderUrl(400, 180)}
                          alt="loading"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      }
                      loading="lazy"
                      onError={handleImageError}
                      wrapperStyle={{ width: '100%', height: '100%', display: 'block' }}
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      preview={false}
                    />
                  </div>
                }
                actions={[
                  <Button
                    key="view"
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(item)}
                    style={{ padding: 0 }}
                  >
                    查看详情
                  </Button>
                ]}
              >
                <Card.Meta
                  title={<Title level={4} style={{ margin: 0, color: '#1890ff' }}>{item.projectName}</Title>}
                  description={
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <BookOutlined style={{ marginRight: '4px', color: '#666' }} />
                        <Text strong>{item.schoolName}</Text>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                          {item.description}
                        </Paragraph>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <CalendarOutlined style={{ marginRight: '4px', color: '#666' }} />
                          <Text type="secondary">完成时间: {item.completionDate}</Text>
                        </div>
                      </div>
                      <div>
                        {item.categories.map(category => (
                          <Tag key={category} color="blue" style={{ marginRight: '4px', marginBottom: '4px' }}>
                            {category}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="暂无匹配的案例"
          style={{ padding: '60px 0' }}
        />
      )}

      {/* 案例详情模态框 */}
      <Modal
        title={selectedCase?.projectName || '案例详情'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
        centered
      >
        {selectedCase && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Image
                src={getImageUrl(selectedCase.coverImage)}
                alt={selectedCase.projectName}
                placeholder={
                  <img
                    src={getPlaceholderUrl(800, 400)}
                    alt="loading"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                }
                loading="lazy"
                onError={handleImageError}
                wrapperStyle={{ width: '100%', display: 'block' }}
                style={{ width: '100%', display: 'block', borderRadius: '8px' }}
                imgStyle={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Title level={4} style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
                项目信息
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                      <Text strong>学校名称:</Text>
                      <Text style={{ marginLeft: '8px' }}>{selectedCase.schoolName}</Text>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    <Text strong>完成时间:</Text>
                    <Text style={{ marginLeft: '8px' }}>{selectedCase.completionDate}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    <Text strong>项目负责人:</Text>
                    <Text style={{ marginLeft: '8px' }}>{selectedCase.projectManager}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Text strong>地区:</Text>
                    <Text style={{ marginLeft: '8px' }}>{selectedCase.region}</Text>
                  </div>
                </Col>
                <Col xs={24}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Text strong style={{ marginTop: '2px' }}>项目类别:</Text>
                    <Space style={{ marginLeft: '8px' }}>
                      {selectedCase.categories.map(category => (
                        <Tag key={category} color="blue">
                          {category}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </Col>
              </Row>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Title level={4} style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
                项目描述
              </Title>
              <Paragraph style={{ lineHeight: '1.8' }}>
                {selectedCase.description}
              </Paragraph>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Title level={4} style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
                项目成果
              </Title>
              <Paragraph style={{ lineHeight: '1.8' }}>
                {selectedCase.achievements}
              </Paragraph>
            </div>
            
            {selectedCase.galleryImages && selectedCase.galleryImages.length > 0 && (
              <div>
                <Title level={4} style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
                  成果展示
                </Title>
                <Row gutter={[16, 16]}>
                  {selectedCase.galleryImages.map((image, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <Image
                        src={getImageUrl(image)}
                        alt={`成果图片 ${index + 1}`}
                        wrapperStyle={{ width: '100%', display: 'block' }}
                        style={{ width: '100%', display: 'block', borderRadius: '8px' }}
                        imgStyle={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CaseLibrary;