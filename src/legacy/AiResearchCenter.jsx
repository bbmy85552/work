import React, { useState } from 'react';
import { Card, Row, Col, Progress, Tag, Tabs, Statistic, Avatar, List, Badge } from 'antd';
import {
  DatabaseOutlined,
  BarChartOutlined,
  TeamOutlined,
  ExperimentOutlined,
  TrophyOutlined,
  GlobalOutlined,
  BookOutlined,
  BulbOutlined,
  RocketOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import aiResearchCenterData from '../mock/aiResearchCenterData';

const { TabPane } = Tabs;
const { Meta } = Card;

const AiResearchCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    bigDataCapabilities,
    productCompetitiveness,
    collaborationCapabilities,
    aiCapabilities,
    teamInfo
  } = aiResearchCenterData;

  return (
    <div className="ai-research-center">
      {/* 顶部横幅图（横向铺满） */}
      <div className="research-banner">
        <img
          className="research-banner-image"
          src="https://student-1320907290.cos.ap-guangzhou.myqcloud.com/img6.png"
          alt="宇智AI研发中心"
          loading="lazy"
        />
      </div>

      {/* 主要内容区域 */}
      <div className="research-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
          {/* 概览标签页 */}
          <TabPane
            tab={
              <span>
                <BulbOutlined />
                研发概览
              </span>
            }
            key="overview"
          >
            <Row gutter={[24, 24]}>
              {/* 大数据技术能力卡片 */}
              <Col span={12}>
                <Card
                  title={
                    <span>
                      <DatabaseOutlined style={{ marginRight: 8 }} />
                      大数据技术能力
                    </span>
                  }
                  className="capability-card"
                >
                  <List
                    dataSource={bigDataCapabilities.slice(0, 3)}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.title}
                          description={
                            <div>
                              <p>{item.description}</p>
                              <div className="tech-tags">
                                {item.technologies.map(tech => (
                                  <Tag key={tech} color="blue">{tech}</Tag>
                                ))}
                              </div>
                              <div className="capability-meta">
                                <span className="performance">{item.performance}</span>
                                <Badge
                                  status={item.status === '已成熟应用' ? 'success' : 'processing'}
                                  text={item.status}
                                />
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* AI核心技术卡片 */}
              <Col span={12}>
                <Card
                  title={
                    <span>
                      <RocketOutlined style={{ marginRight: 8 }} />
                      AI核心技术
                    </span>
                  }
                  className="capability-card"
                >
                  <List
                    dataSource={aiCapabilities.coreTechnologies}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <span>
                              {item.name}
                              <Tag color="gold" style={{ marginLeft: 8 }}>{item.level}</Tag>
                            </span>
                          }
                          description={
                            <div>
                              <p>{item.description}</p>
                              <div className="application-tags">
                                {item.applications.map(app => (
                                  <Tag key={app} color="green">{app}</Tag>
                                ))}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 产品竞争力分析标签页 */}
          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                产品竞争力分析
              </span>
            }
            key="competitiveness"
          >
            <Row gutter={[24, 24]}>
              {/* 市场分析 */}
              <Col span={16}>
                <Card title="市场竞争分析" className="market-analysis-card">
                  <List
                    dataSource={productCompetitiveness.marketAnalysis}
                    renderItem={item => (
                      <List.Item>
                        <Card className="market-item-card">
                          <div className="market-header">
                            <h3>{item.productType}</h3>
                            <div className="market-stats">
                              <span className="market-share">市场份额: {item.marketShare}</span>
                              <span className="growth-rate">增长率: {item.growthRate}</span>
                            </div>
                          </div>
                          <p className="market-size">{item.marketSize}</p>
                          <div className="competitors">
                            <strong>主要竞争对手:</strong>
                            {item.competitors.map(competitor => (
                              <Tag key={competitor} color="orange">{competitor}</Tag>
                            ))}
                          </div>
                          <div className="advantages">
                            <strong>核心优势:</strong>
                            <ul>
                              {item.advantages.map((advantage, index) => (
                                <li key={index}>{advantage}</li>
                              ))}
                            </ul>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 竞争力评分 */}
              <Col span={8}>
                <Card title="竞争力评分" className="competitiveness-card">
                  <List
                    dataSource={productCompetitiveness.competitiveFeatures}
                    renderItem={item => (
                      <List.Item>
                        <div className="feature-item">
                          <div className="feature-header">
                            <span className="feature-name">{item.feature}</span>
                            <span className="feature-score">{item.score}/10</span>
                          </div>
                          <Progress
                            percent={item.score * 10}
                            showInfo={false}
                            strokeColor="#1890ff"
                            trailColor="#f0f0f0"
                          />
                          <p className="feature-description">{item.description}</p>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 研发合作能力标签页 */}
          <TabPane
            tab={
              <span>
                <TeamOutlined />
                研发合作能力
              </span>
            }
            key="collaboration"
          >
            <Row gutter={[24, 24]}>
              {collaborationCapabilities.map((collaboration, index) => (
                <Col span={8} key={index}>
                  <Card
                    title={
                      <span>
                        {collaboration.type === '产学研合作' && <BookOutlined style={{ marginRight: 8 }} />}
                        {collaboration.type === '产业合作' && <GlobalOutlined style={{ marginRight: 8 }} />}
                        {collaboration.type === '国际合作' && <GlobalOutlined style={{ marginRight: 8 }} />}
                        {collaboration.type}
                      </span>
                    }
                    className="collaboration-card"
                  >
                    <div className="partners-section">
                      <h4>合作伙伴:</h4>
                      <div className="partners-list">
                        {collaboration.partners.map((partner, idx) => (
                          <Tag key={idx} color="blue">{partner}</Tag>
                        ))}
                      </div>
                    </div>

                    <div className="projects-section">
                      <h4>合作项目:</h4>
                      <ul>
                        {collaboration.projects.map((project, idx) => (
                          <li key={idx}>{project}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="achievements-section">
                      <h4>主要成果:</h4>
                      <p>{collaboration.achievements}</p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* 研发方向与团队标签页 */}
          <TabPane
            tab={
              <span>
                <ExperimentOutlined />
                研发方向与团队
              </span>
            }
            key="research"
          >
            <Row gutter={[24, 24]}>
              {/* 研发方向 */}
              <Col span={16}>
                <Card title="前沿研发方向" className="research-directions-card">
                  <List
                    dataSource={aiCapabilities.researchDirections}
                    renderItem={item => (
                      <List.Item>
                        <Card className="research-item-card">
                          <div className="research-header">
                            <h3>{item.direction}</h3>
                            <Badge
                              status={item.progress.includes('已完成') ? 'success' :
                                     item.progress.includes('开发中') ? 'processing' : 'default'}
                              text={item.progress}
                            />
                          </div>
                          <p className="research-focus">{item.focus}</p>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 团队信息 */}
              <Col span={8}>
                <Card title="核心团队" className="team-card">
                  <div className="team-stats">
                    <Statistic title="总人数" value={teamInfo.totalMembers} suffix="人" />
                    <Statistic title="博士比例" value={teamInfo.phdRatio} />
                    <Statistic title="平均经验" value={teamInfo.averageExperience} suffix="年" />
                  </div>

                  <div className="key-members">
                    <h4>核心成员:</h4>
                    <List
                      dataSource={teamInfo.keyMembers}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar size="large">{item.name.charAt(0)}</Avatar>}
                            title={`${item.name} - ${item.title}`}
                            description={
                              <div>
                                <p><strong>专长:</strong> {item.expertise}</p>
                                <p><strong>背景:</strong> {item.background}</p>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 荣誉与成就标签页 */}
          <TabPane
            tab={
              <span>
                <TrophyOutlined />
                荣誉与成就
              </span>
            }
            key="achievements"
          >
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card title="学术成就" className="achievements-card">
                  <Statistic
                    title="专利申请"
                    value={aiCapabilities.patentsAndPublications.patents}
                    suffix="项"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Statistic
                    title="论文发表"
                    value={aiCapabilities.patentsAndPublications.publications}
                    suffix="篇"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div className="conference-list">
                    <h4>国际会议:</h4>
                    <div className="conference-tags">
                      {aiCapabilities.patentsAndPublications.conferences.map(conf => (
                        <Tag key={conf} color="purple">{conf}</Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="获奖荣誉" className="awards-card">
                  <List
                    dataSource={aiCapabilities.patentsAndPublications.awards}
                    renderItem={(award, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<TrophyOutlined style={{ color: '#faad14', fontSize: '24px' }} />}
                          title={award}
                          description={`获得时间: ${new Date().getFullYear() - index}年`}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AiResearchCenter;
