import React, { useState, useEffect } from 'react'
import { Card, Table, Typography, Input, Select, Space, Tag, Button, DatePicker, Modal, Form, message } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { deliveryData } from '../mock/mockData'
const { RangePicker } = DatePicker

const { Title } = Typography
const { Search } = Input
const { Option } = Select

// 使用集中管理的Mock数据中的交付跟踪信息

const DeliveryTracking = () => {
  const [filteredData, setFilteredData] = useState(deliveryData.deliveries)
  const [searchText, setSearchText] = useState('')
  const [selectedSchoolType, setSelectedSchoolType] = useState('')
  const [selectedPlanStatus, setSelectedPlanStatus] = useState('')
  const [selectedDesignStatus, setSelectedDesignStatus] = useState('')
  const [selectedPurchaseStatus, setSelectedPurchaseStatus] = useState('')
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('')
  const [dateRange, setDateRange] = useState([])
  const [selectedProductProcurementStatus, setSelectedProductProcurementStatus] = useState('')
  const [selectedAdvertisementStatus, setSelectedAdvertisementStatus] = useState('')
  const [selectedDecorationStatus, setSelectedDecorationStatus] = useState('')
  
  // 编辑功能相关状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)
  const [form] = Form.useForm()
  
  // 模拟数据存储（实际项目中会连接后端API）
  const [deliveriesData, setDeliveriesData] = useState(deliveryData.deliveries)

  // 搜索功能
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(
      value, 
      selectedSchoolType, 
      selectedPlanStatus, 
      selectedDesignStatus, 
      selectedPurchaseStatus,
      selectedDeliveryStatus,
      dateRange,
      selectedProductProcurementStatus,
      selectedAdvertisementStatus,
      selectedDecorationStatus
    )
  }

  // 筛选功能
  const handleFilterChange = (setter, filterType, value) => {
    setter(value)
    filterData(
      searchText,
      filterType === 'projectType' ? value : selectedSchoolType,
      filterType === 'planStatus' ? value : selectedPlanStatus,
      filterType === 'designStatus' ? value : selectedDesignStatus,
      filterType === 'purchaseStatus' ? value : selectedPurchaseStatus,
      filterType === 'deliveryStatus' ? value : selectedDeliveryStatus,
      filterType === 'dateRange' ? value : dateRange,
      filterType === 'productProcurementStatus' ? value : selectedProductProcurementStatus,
      filterType === 'advertisementStatus' ? value : selectedAdvertisementStatus,
      filterType === 'decorationStatus' ? value : selectedDecorationStatus
    )
  }

  // 综合筛选数据
  const filterData = (search, projectType, planStatus, designStatus, purchaseStatus, deliveryStatus, dateRange, productProcurementStatus, advertisementStatus, decorationStatus) => {
    let data = deliveriesData
    
    if (search) {
      data = data.filter(item => 
        item.orderId.includes(search) || 
        item.manager.includes(search)
      )
    }
    
    if (projectType) {
      data = data.filter(item => item.projectType === projectType)
    }
    
    if (planStatus) {
      data = data.filter(item => item.planStatus === planStatus)
    }
    
    if (designStatus) {
      data = data.filter(item => item.designStatus === designStatus)
    }
    
    if (purchaseStatus) {
      data = data.filter(item => item.purchaseStatus === purchaseStatus)
    }
    
    if (deliveryStatus) {
      data = data.filter(item => item.deliveryStatus === deliveryStatus)
    }
    
    // 新增状态筛选
    if (productProcurementStatus) {
      data = data.filter(item => item.productProcurementStatus === productProcurementStatus)
    }
    
    if (advertisementStatus) {
      data = data.filter(item => item.advertisementStatus === advertisementStatus)
    }
    
    if (decorationStatus) {
      data = data.filter(item => item.decorationStatus === decorationStatus)
    }
    
    // 日期范围筛选
    if (dateRange.length === 2) {
      const startDate = dateRange[0].format('YYYY-MM-DD')
      const endDate = dateRange[1].format('YYYY-MM-DD')
      data = data.filter(item => {
        const deliveryDate = item.deliveryDate || item.estimatedDeliveryTime
        return deliveryDate && deliveryDate >= startDate && deliveryDate <= endDate
      })
    }
    
    setFilteredData(data)
  }

  // 方案状态标签颜色
  const getPlanStatusColor = (status) => {
    switch (status) {
      case '方案已接单': return 'blue'
      case '方案策划中': return 'orange'
      case '方案已完成': return 'green'
      default: return 'default'
    }
  }

  // 设计状态标签颜色
  const getDesignStatusColor = (status) => {
    switch (status) {
      case '设计已派单': return 'blue'
      case '设计交付中': return 'orange'
      case '设计已完成': return 'green'
      default: return 'default'
    }
  }

  // 采购状态标签颜色
  const getPurchaseStatusColor = (status) => {
    switch (status) {
      case '无需采购': return 'default'
      case '采购已完成': return 'green'
      case '硬件采购': return 'blue'
      case '广告制作': return 'orange'
      case '装饰装修': return 'red'
      default: return 'default'
    }
  }
  
  // 成品采购状态标签颜色
   const getProductProcurementStatusColor = (status) => {
     switch (status) {
       case '下单生产中': return 'blue'
       case '运输中': return 'orange'
       case '到货安装': return 'green'
       default: return 'default'
     }
   }
   
   // 广告制作状态标签颜色
   const getAdvertisementStatusColor = (status) => {
     switch (status) {
       case '设计排版': return 'blue'
       case '下单': return 'cyan'
       case '制作': return 'orange'
       case '到货安装': return 'green'
       default: return 'default'
     }
   }
   
   // 装饰装修状态标签颜色
   const getDecorationStatusColor = (status) => {
     switch (status) {
       case '施工图输出': return 'blue'
       case '备料': return 'cyan'
       case '施工中': return 'orange'
       case '完工': return 'green'
       default: return 'default'
     }
   }

  // 交付状态标签颜色
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case '已交付通过': return 'green'
      case '未交付通过': return 'orange'
      case '不同未通过': return 'red'
      default: return 'default'
    }
  }

  // 项目类型标签颜色
  const getProjectTypeColor = (type) => {
    switch (type) {
      case '硬件设备': return 'purple'
      case '软件系统': return 'cyan'
      case '解决方案': return 'magenta'
      case '定制方案': return 'lime'
      case '硬件采购': return 'blue'
      case '广告制作': return 'orange'
      case '装饰装修': return 'red'
      default: return 'default'
    }
  }

  // 打开编辑模态框 - 改进版本
  const openEditModal = (record) => {
    if (!record) {
      message.error('无法编辑，请选择有效的项目');
      return;
    }
    
    setIsEditMode(true)
    setCurrentRecord(record)
    
    // 确保所有字段都被正确设置，包括可能的空值
    const formValues = {
      orderId: record.orderId || '',
      projectType: record.projectType || '',
      purchaseStatus: record.purchaseStatus || '',
      productProcurementStatus: record.productProcurementStatus || record.productPurchaseStatus || '',
      estimatedProductCompleteTime: record.estimatedProductCompleteTime ? new Date(record.estimatedProductCompleteTime) : undefined,
      advertisementStatus: record.advertisementStatus || record.adProductionStatus || '',
      estimatedAdCompleteTime: record.estimatedAdCompleteTime ? new Date(record.estimatedAdCompleteTime) : undefined,
      decorationStatus: record.decorationStatus || '',
      estimatedDecorationCompleteTime: record.estimatedDecorationCompleteTime ? new Date(record.estimatedDecorationCompleteTime) : undefined,
      deliveryDate: record.deliveryDate ? new Date(record.deliveryDate) : undefined,
      deliveryStatus: record.deliveryStatus || '',
      deliveryRemarks: record.deliveryRemarks || '',
      manager: record.manager || ''
    }
    
    // 重置表单并设置值
    form.resetFields();
    setTimeout(() => {
      form.setFieldsValue(formValues);
    }, 0);
    
    setIsModalVisible(true)
  }
  
  // 打开新增模态框
  const openAddModal = () => {
    setIsEditMode(false)
    setCurrentRecord(null)
    form.resetFields()
    setIsModalVisible(true)
  }
  
  // 保存编辑或新增
  const handleSave = () => {
    form.validateFields().then(values => {
      // 处理日期格式 - 使用原生JavaScript处理日期
      let deliveryDate = null;
      if (values.deliveryDate) {
        if (values.deliveryDate._isAMomentObject) {
          // 兼容可能的moment对象
          deliveryDate = values.deliveryDate.format ? 
            values.deliveryDate.format('YYYY-MM-DD') : 
            values.deliveryDate.toString();
        } else if (values.deliveryDate instanceof Date) {
          // 原生Date对象处理
          const year = values.deliveryDate.getFullYear();
          const month = String(values.deliveryDate.getMonth() + 1).padStart(2, '0');
          const day = String(values.deliveryDate.getDate()).padStart(2, '0');
          deliveryDate = `${year}-${month}-${day}`;
        } else if (typeof values.deliveryDate === 'string') {
          // 直接使用字符串
          deliveryDate = values.deliveryDate;
        }
      }
      
      // 处理预计阶段完成时间 - 成品采购
      let estimatedProductCompleteTime = null;
      if (values.estimatedProductCompleteTime) {
        if (values.estimatedProductCompleteTime._isAMomentObject) {
          estimatedProductCompleteTime = values.estimatedProductCompleteTime.format ? 
            values.estimatedProductCompleteTime.format('YYYY-MM-DD') : 
            values.estimatedProductCompleteTime.toString();
        } else if (values.estimatedProductCompleteTime instanceof Date) {
          const year = values.estimatedProductCompleteTime.getFullYear();
          const month = String(values.estimatedProductCompleteTime.getMonth() + 1).padStart(2, '0');
          const day = String(values.estimatedProductCompleteTime.getDate()).padStart(2, '0');
          estimatedProductCompleteTime = `${year}-${month}-${day}`;
        } else if (typeof values.estimatedProductCompleteTime === 'string') {
          estimatedProductCompleteTime = values.estimatedProductCompleteTime;
        }
      }
      
      // 处理预计阶段完成时间 - 广告制作
      let estimatedAdCompleteTime = null;
      if (values.estimatedAdCompleteTime) {
        if (values.estimatedAdCompleteTime._isAMomentObject) {
          estimatedAdCompleteTime = values.estimatedAdCompleteTime.format ? 
            values.estimatedAdCompleteTime.format('YYYY-MM-DD') : 
            values.estimatedAdCompleteTime.toString();
        } else if (values.estimatedAdCompleteTime instanceof Date) {
          const year = values.estimatedAdCompleteTime.getFullYear();
          const month = String(values.estimatedAdCompleteTime.getMonth() + 1).padStart(2, '0');
          const day = String(values.estimatedAdCompleteTime.getDate()).padStart(2, '0');
          estimatedAdCompleteTime = `${year}-${month}-${day}`;
        } else if (typeof values.estimatedAdCompleteTime === 'string') {
          estimatedAdCompleteTime = values.estimatedAdCompleteTime;
        }
      }
      
      // 处理预计阶段完成时间 - 装饰装修
      let estimatedDecorationCompleteTime = null;
      if (values.estimatedDecorationCompleteTime) {
        if (values.estimatedDecorationCompleteTime._isAMomentObject) {
          estimatedDecorationCompleteTime = values.estimatedDecorationCompleteTime.format ? 
            values.estimatedDecorationCompleteTime.format('YYYY-MM-DD') : 
            values.estimatedDecorationCompleteTime.toString();
        } else if (values.estimatedDecorationCompleteTime instanceof Date) {
          const year = values.estimatedDecorationCompleteTime.getFullYear();
          const month = String(values.estimatedDecorationCompleteTime.getMonth() + 1).padStart(2, '0');
          const day = String(values.estimatedDecorationCompleteTime.getDate()).padStart(2, '0');
          estimatedDecorationCompleteTime = `${year}-${month}-${day}`;
        } else if (typeof values.estimatedDecorationCompleteTime === 'string') {
          estimatedDecorationCompleteTime = values.estimatedDecorationCompleteTime;
        }
      }
      
      // 构建更新数据，确保不包含estimatedDeliveryTime
      const { estimatedDeliveryTime, ...restValues } = values;
      
      const updatedData = {
        ...restValues,
        deliveryDate,
        estimatedProductCompleteTime,
        estimatedAdCompleteTime,
        estimatedDecorationCompleteTime,
        // 根据项目类型和采购状态设置相应的状态字段
        productPurchaseStatus: values.productProcurementStatus,
        adProductionStatus: values.advertisementStatus,
        // 明确删除estimatedDeliveryTime字段（如果存在）
        estimatedDeliveryTime: undefined
      }
      
      let newDeliveriesData
      if (isEditMode && currentRecord) {
        // 更新现有记录 - 确保正确匹配记录
        newDeliveriesData = deliveriesData.map(item => {
          // 优先使用id匹配，如果没有id再使用orderId
          if (currentRecord.id && item.id === currentRecord.id) {
            return { ...item, ...updatedData };
          } else if (currentRecord.orderId && item.orderId === currentRecord.orderId) {
            return { ...item, ...updatedData };
          }
          return item;
        })
        message.success('项目更新成功')
      } else {
        // 添加新记录
        const newId = `DEL${String(deliveriesData.length + 1).padStart(3, '0')}`
        const newRecord = {
          id: newId,
          ...updatedData
        }
        newDeliveriesData = [...deliveriesData, newRecord]
        message.success('项目添加成功')
      }
      
      // 确保数据更新后能正确显示
      setDeliveriesData(newDeliveriesData)
      
      // 重新筛选数据以更新表格
      filterData(
        searchText, selectedSchoolType, selectedPlanStatus, selectedDesignStatus, 
        selectedPurchaseStatus, selectedDeliveryStatus, dateRange,
        selectedProductProcurementStatus, selectedAdvertisementStatus, selectedDecorationStatus
      )
      
      // 关闭模态框
      setIsModalVisible(false)
    }).catch(errorInfo => {
      // 添加错误处理
      console.error('表单验证失败:', errorInfo);
      message.error('保存失败，请检查表单填写');
    })
  }
  
  // 删除项目
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 ${record.orderId} 吗？`,
      onOk: () => {
        const newDeliveriesData = deliveriesData.filter(
          item => item.id !== record.id && item.orderId !== record.orderId
        )
        setDeliveriesData(newDeliveriesData)
        filterData(
        searchText, selectedSchoolType, selectedPlanStatus, selectedDesignStatus, 
              selectedPurchaseStatus, selectedDeliveryStatus, dateRange,
          selectedProductProcurementStatus, selectedAdvertisementStatus, selectedDecorationStatus
        )
        message.success('项目删除成功')
      }
    })
  }
  
  // 表格列配置
  const columns = [
    { title: '项目编号', dataIndex: 'orderId', key: 'orderId' },
    { title: '项目类型', dataIndex: 'projectType', key: 'projectType',
      render: type => 
        <Tag color={getProjectTypeColor(type)}>{type}</Tag>
    },
    { title: '采购类别', dataIndex: 'purchaseStatus', key: 'purchaseStatus',
      render: status => 
        <Tag color={getPurchaseStatusColor(status)}>{status}</Tag>
    },
    { title: '成品采购', key: 'productProcurement', render: (_, record) => {
            const productStatus = record.productProcurementStatus || record.productPurchaseStatus;
            const estimatedTime = record.estimatedProductCompleteTime;
            return (
              <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  {productStatus ? 
                    <Tag color={getProductProcurementStatusColor(productStatus)}>{productStatus}</Tag> : 
                    '-'}
                </div>
                <div style={{
                  fontWeight: 'bold', 
                  color: '#ff4d4f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#ff4d4f', marginRight: '5px', transform: 'rotate(45deg)' }}></div>
                  {estimatedTime ? (
                    <>
                      {(() => {
                        try {
                          const date = new Date(estimatedTime);
                          if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}.${month}.${day}`;
                          }
                          return '-';
                        } catch (e) {
                          return '-';
                        }
                      })()}
                    </>
                  ) : '-'}
                </div>
              </div>
            );
          }
        },
        { title: '广告制作', key: 'advertisement', render: (_, record) => {
            const adStatus = record.advertisementStatus || record.adProductionStatus;
            const estimatedTime = record.estimatedAdCompleteTime;
            return (
              <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  {adStatus ? 
                    <Tag color={getAdvertisementStatusColor(adStatus)}>{adStatus}</Tag> : 
                    '-'}
                </div>
                <div style={{
                  fontWeight: 'bold', 
                  color: '#ff4d4f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#ff4d4f', marginRight: '5px', transform: 'rotate(45deg)' }}></div>
                  {estimatedTime ? (
                    <>
                      {(() => {
                        try {
                          const date = new Date(estimatedTime);
                          if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}.${month}.${day}`;
                          }
                          return '-';
                        } catch (e) {
                          return '-';
                        }
                      })()}
                    </>
                  ) : '-'}
                </div>
              </div>
            );
          }
        },
        { title: '装饰装修', key: 'decoration', render: (_, record) => {
            const decorationStatus = record.decorationStatus;
            const estimatedTime = record.estimatedDecorationCompleteTime;
            return (
              <div style={{
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '8px',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  {decorationStatus ? 
                    <Tag color={getDecorationStatusColor(decorationStatus)}>{decorationStatus}</Tag> : 
                    '-'}
                </div>
                <div style={{
                  fontWeight: 'bold', 
                  color: '#ff4d4f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#ff4d4f', marginRight: '5px', transform: 'rotate(45deg)' }}></div>
                  {estimatedTime ? (
                    <>
                      {(() => {
                        try {
                          const date = new Date(estimatedTime);
                          if (!isNaN(date.getTime())) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}.${month}.${day}`;
                          }
                          return '-';
                        } catch (e) {
                          return '-';
                        }
                      })()}
                    </>
                  ) : '-'}
                </div>
              </div>
            );
          }
        },
    { title: '项自预计交付日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '交付备注', dataIndex: 'deliveryRemarks', key: 'deliveryRemarks',
      render: (remarks, record) => 
        <div>
          {remarks || record.deliveryStatus ? (
            <Tag color={getDeliveryStatusColor(record.deliveryStatus || 'default')}>
              {remarks || record.deliveryStatus}
            </Tag>
          ) : '-'
          }
        </div>
    },
    { title: '交付经理', dataIndex: 'manager', key: 'manager' },
    {
      title: '操作', 
      key: 'action',
      render: (_, record) => {
        // 确保record存在
        if (!record) return null;
        
        return (
          <Space size="middle">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                openEditModal(record);
              }}
              title="编辑项目"
            >
              编辑
            </Button>
          </Space>
        );
      }
    }
  ]

  return (
    <div>
      <Space className="mb-4" direction="horizontal" size="middle" style={{ float: 'right' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={openAddModal}
        >
          新增项目
        </Button>
      </Space>
      
      <Title level={2}>交付跟踪</Title>
      
      {/* 搜索和筛选区域 */}
      <Card className="mb-4">
        <Space wrap size="middle">
          <Space.Compact size="middle" style={{ width: 300 }}>
            <Input
              placeholder="搜索项目编号或负责人"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => handleSearch(searchText)} />
          </Space.Compact>
          <Select
            placeholder="学校类型"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange(setSelectedSchoolType, 'projectType', value)}
          >
            <Option value="硬件设备">硬件设备</Option>
            <Option value="软件系统">软件系统</Option>
            <Option value="解决方案">解决方案</Option>
            <Option value="定制方案">定制方案</Option>
            <Option value="硬件采购">硬件采购</Option>
            <Option value="广告制作">广告制作</Option>
            <Option value="装饰装修">装饰装修</Option>
            <Option value="校史文化墙科">校史文化墙科</Option>
            <Option value="校园科创文化墙">校园科创文化墙</Option>
            <Option value="党建文化墙">党建文化墙</Option>
            <Option value="美育文化墙">美育文化墙</Option>
          </Select>
          <Select
            placeholder="采购状态"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange(setSelectedPurchaseStatus, 'purchaseStatus', value)}
          >
            <Option value="无需采购">无需采购</Option>
            <Option value="采购已完成">采购已完成</Option>
            <Option value="硬件采购">硬件采购</Option>
            <Option value="广告制作">广告制作</Option>
            <Option value="装饰装修">装饰装修</Option>
          </Select>
          <Select
            placeholder="成品采购状态"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange(setSelectedProductProcurementStatus, 'productProcurementStatus', value)}
          >
            <Option value="下单生产中">下单生产中</Option>
            <Option value="运输中">运输中</Option>
            <Option value="到货安装">到货安装</Option>
          </Select>
          <Select
            placeholder="广告制作状态"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange(setSelectedAdvertisementStatus, 'advertisementStatus', value)}
          >
            <Option value="设计排版">设计排版</Option>
            <Option value="下单">下单</Option>
            <Option value="制作">制作</Option>
            <Option value="到货安装">到货安装</Option>
          </Select>
          <Select
            placeholder="装饰装修状态"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange(setSelectedDecorationStatus, 'decorationStatus', value)}
          >
            <Option value="施工图输出">施工图输出</Option>
            <Option value="备料">备料</Option>
            <Option value="施工中">施工中</Option>
            <Option value="完工">完工</Option>
          </Select>
          <RangePicker 
            placeholder={['开始日期', '结束日期']} 
            onChange={(dates) => handleFilterChange(setDateRange, 'dateRange', dates || [])}
          />
        </Space>
      </Card>
      
      {/* 交付跟踪表格 */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="orderId"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      
      {/* 编辑/新增项目模态框 */}
      <Modal
        title={isEditMode ? '编辑项目' : '新增项目'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
        >
          <Form.Item
            label="项目编号"
            name="orderId"
            rules={[{ required: true, message: '请输入项目编号' }]}
          >
            <Input placeholder="请输入项目编号" />
          </Form.Item>
          
          <Form.Item
            label="项目类型"
            name="projectType"
            rules={[{ required: true, message: '请选择项目类型' }]}
          >
            <Select placeholder="请选择项目类型">
              <Option value="硬件设备">硬件设备</Option>
              <Option value="软件系统">软件系统</Option>
              <Option value="解决方案">解决方案</Option>
              <Option value="定制方案">定制方案</Option>
              <Option value="硬件采购">硬件采购</Option>
              <Option value="广告制作">广告制作</Option>
              <Option value="装饰装修">装饰装修</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="采购类别"
            name="purchaseStatus"
            rules={[{ required: true, message: '请选择采购类别' }]}
          >
            <Select placeholder="请选择采购类别">
              <Option value="无需采购">无需采购</Option>
              <Option value="采购已完成">采购已完成</Option>
              <Option value="硬件采购">硬件采购</Option>
              <Option value="广告制作">广告制作</Option>
              <Option value="装饰装修">装饰装修</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="成品采购状态"
            name="productProcurementStatus"
          >
            <Select placeholder="请选择成品采购状态" allowClear>
              <Option value="下单生产中">下单生产中</Option>
              <Option value="运输中">运输中</Option>
              <Option value="到货安装">到货安装</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="预计阶段完成时间-成品采购"
            name="estimatedProductCompleteTime"
          >
            <DatePicker placeholder="请选择日期" />
          </Form.Item>
          
          <Form.Item
            label="广告制作状态"
            name="advertisementStatus"
          >
            <Select placeholder="请选择广告制作状态" allowClear>
              <Option value="设计排版">设计排版</Option>
              <Option value="下单">下单</Option>
              <Option value="制作">制作</Option>
              <Option value="到货安装">到货安装</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="预计阶段完成时间-广告制作"
            name="estimatedAdCompleteTime"
          >
            <DatePicker placeholder="请选择日期" />
          </Form.Item>
          
          <Form.Item
            label="装饰装修状态"
            name="decorationStatus"
          >
            <Select placeholder="请选择装饰装修状态" allowClear>
              <Option value="施工图输出">施工图输出</Option>
              <Option value="备料">备料</Option>
              <Option value="施工中">施工中</Option>
              <Option value="完工">完工</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="预计阶段完成时间-装饰装修"
            name="estimatedDecorationCompleteTime"
          >
            <DatePicker placeholder="请选择日期" />
          </Form.Item>
          
          <Form.Item
            label="预计交付日期"
            name="deliveryDate"
          >
            <DatePicker placeholder="请选择日期" />
          </Form.Item>
          
          <Form.Item
            label="交付状态"
            name="deliveryStatus"
            rules={[{ required: true, message: '请选择交付状态' }]}
          >
            <Select placeholder="请选择交付状态">
              <Option value="已交付通过">已交付通过</Option>
              <Option value="未交付通过">未交付通过</Option>
              <Option value="部分未通过">部分未通过</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="交付备注"
            name="deliveryRemarks"
            tooltip="可自由编辑的交付备注信息"
          >
            <Input.TextArea rows={3} placeholder="请输入交付备注（可选，如不填写则显示交付状态）" />
          </Form.Item>
          
          <Form.Item
            label="交付经理"
            name="manager"
            rules={[{ required: true, message: '请输入交付经理' }]}
          >
            <Input placeholder="请输入交付经理" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DeliveryTracking