import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb, Button, Card, Col, Divider, List, Row, Tag, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import productLibraryData from '../mock/productLibraryData'
import './ProductLibrary.css'

const { Title, Text, Paragraph } = Typography

function ImagePlaceholder({ height = 140, label = '图片占位' }) {
  return (
    <div className="pl-image-placeholder" style={{ height }}>
      <span className="pl-image-placeholder-text">{label}</span>
    </div>
  )
}

function CategoryOverview({ categories, onEnterCategory }) {
  return (
    <div className="pl-page">
      {/* 顶部横幅图（横向铺满） */}
      <div className="pl-banner">
        <img
          className="pl-banner-image"
          src="https://student-1320907290.cos.ap-guangzhou.myqcloud.com/logo2.jpg"
          alt="学智"
          loading="lazy"
        />
      </div>

      <Divider style={{ margin: '18px 0' }} />

      
      <Row gutter={[16, 16]}>
        {categories.map((c) => (
          <Col key={c.key} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="pl-card"
              onClick={() => onEnterCategory(c.key)}
              title={<span className="pl-card-title">{c.name}</span>}
            >
              <ImagePlaceholder height={120} label="分类图片占位" />
              <Paragraph className="pl-card-desc" style={{ marginTop: 12 }}>
                {c.description}
              </Paragraph>
              <div className="pl-card-footer">
                <Button type="primary">进入查看</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

function CategoryProducts({ category, products, onBack, onOpenProduct }) {
  return (
    <div className="pl-page">
      <Breadcrumb
        items={[
          { title: '学智产品库', onClick: onBack, className: 'pl-breadcrumb-link' },
          { title: category.name },
        ]}
      />

      <div className="pl-header pl-header-row">
        <div>
          <Title level={3} style={{ margin: 0 }}>{category.name}</Title>
          <Text type="secondary">{category.description}</Text>
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>返回分类</Button>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
        dataSource={products}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              className="pl-card"
              onClick={() => onOpenProduct(item.id)}
              title={<span className="pl-card-title">{item.name}</span>}
            >
              <ImagePlaceholder height={120} label="产品图片占位" />
              <div style={{ marginTop: 12 }}>
                <Tag color="blue">{item.vendor}</Tag>
              </div>
              <Paragraph className="pl-card-desc" style={{ marginTop: 8, marginBottom: 0 }}>
                {item.shortIntro}
              </Paragraph>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

function ProductDetail({ category, product, onBackToCategory, onBackToOverview }) {
  return (
    <div className="pl-page">
      <Breadcrumb
        items={[
          { title: '学智产品库', onClick: onBackToOverview, className: 'pl-breadcrumb-link' },
          { title: category.name, onClick: onBackToCategory, className: 'pl-breadcrumb-link' },
          { title: product.name },
        ]}
      />

      <div className="pl-header pl-header-row">
        <div>
          <Title level={3} style={{ margin: 0 }}>{product.name}</Title>
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">{product.vendor}</Tag>
            <Tag>{category.name}</Tag>
          </div>
        </div>
        <div className="pl-detail-actions">
          <Button onClick={onBackToCategory} icon={<ArrowLeftOutlined />}>返回列表</Button>
          <Button onClick={onBackToOverview}>返回分类</Button>
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card className="pl-card">
            <ImagePlaceholder height={320} label="产品大图占位" />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">当前模块暂时无图片，已预留展示位置，后续可接入供应商图片资源。</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card className="pl-card" title="产品说明">
            <Paragraph style={{ marginBottom: 12 }}>{product.detailIntro}</Paragraph>
            <Divider style={{ margin: '12px 0' }} />
            <Title level={5} style={{ marginTop: 0 }}>核心亮点</Title>
            <List
              size="small"
              dataSource={product.highlights || []}
              renderItem={(h) => <List.Item>• {h}</List.Item>}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Title level={5} style={{ marginTop: 0 }}>基础信息</Title>
            <div className="pl-specs">
              {Object.entries(product.specs || {}).map(([k, v]) => (
                <div key={k} className="pl-spec-row">
                  <Text className="pl-spec-key">{k}</Text>
                  <Text className="pl-spec-val">{v}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default function ProductLibrary() {
  const navigate = useNavigate()
  const { categoryKey, productId } = useParams()

  const categories = productLibraryData.categories
  const products = productLibraryData.products
  const stats = useMemo(() => ({
    // 对齐 case-library / 设计稿展示数字：后续接入真实接口可替换为动态统计
    productTotal: 12,
    vendorTotal: 5,
    categoryTotal: categories.length,
  }), [categories.length])

  const category = useMemo(
    () => categories.find((c) => c.key === categoryKey),
    [categories, categoryKey],
  )

  const categoryProducts = useMemo(
    () => (category ? products.filter((p) => p.categoryKey === category.key) : []),
    [products, category],
  )

  const product = useMemo(
    () => (productId ? products.find((p) => p.id === productId) : null),
    [products, productId],
  )

  // 路由状态：
  // - /product-library: 分类总览
  // - /product-library/:categoryKey: 分类下产品列表
  // - /product-library/:categoryKey/:productId: 产品详情
  if (!categoryKey) {
    return (
      <CategoryOverview
        categories={categories}
        stats={stats}
        onEnterCategory={(key) => navigate(`/product-library/${key}`)}
      />
    )
  }

  // 类别不存在：回到总览
  if (!category) {
    return (
      <div className="pl-page">
        <Title level={4}>分类不存在</Title>
        <Text type="secondary">请从分类列表重新进入。</Text>
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => navigate('/product-library')}>返回分类</Button>
        </div>
      </div>
    )
  }

  if (!productId) {
    return (
      <CategoryProducts
        category={category}
        products={categoryProducts}
        onBack={() => navigate('/product-library')}
        onOpenProduct={(id) => navigate(`/product-library/${category.key}/${id}`)}
      />
    )
  }

  // 产品不存在：回到该分类列表
  if (!product) {
    return (
      <div className="pl-page">
        <Title level={4}>产品不存在</Title>
        <Text type="secondary">请返回列表重新选择。</Text>
        <div style={{ marginTop: 12 }}>
          <Button type="primary" onClick={() => navigate(`/product-library/${category.key}`)}>返回列表</Button>
        </div>
      </div>
    )
  }

  // 产品与分类不一致：按产品自身分类跳转（防止手动改URL）
  if (product.categoryKey !== category.key) {
    navigate(`/product-library/${product.categoryKey}/${product.id}`, { replace: true })
    return null
  }

  return (
    <ProductDetail
      category={category}
      product={product}
      onBackToCategory={() => navigate(`/product-library/${category.key}`)}
      onBackToOverview={() => navigate('/product-library')}
    />
  )
}


