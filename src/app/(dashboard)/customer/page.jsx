import { getSchools, getSchoolStatistics } from '@/lib/db'
import customerData from '@/mock/customerData'
import CustomerManagementClient from './CustomerManagementClient'

export const dynamic = 'force-dynamic'

/**
 * 客户管理页面 - Server Component
 * 直接在服务器从 PostgreSQL 数据库获取学校数据
 */
export default async function CustomerManagementPage({ searchParams }) {
  // 从服务器获取学校数据
  const region = searchParams.region || ''
  const schoolType = searchParams.schoolType || ''
  const search = searchParams.search || ''

  try {
    // 获取学校列表
    const schools = await getSchools({
      region,
      schoolType,
      search,
      limit: 100,
      offset: 0
    })

    // 获取统计数据
    const statistics = await getSchoolStatistics()

    // 将数据库字段映射为前端需要的格式
    const formattedSchools = schools.map(school => ({
      id: String(school.id),
      schoolName: school.school_name,
      schoolType: getSchoolTypeName(school.school_type),
      contactPerson: school.contact_person || '未填写',
      contactPhone: school.contact_phone || '未填写',
      salesman: school.salesman || '未分配',
      region: school.region || '未知',
      customerType: school.customer_type || '普通客户',
      status: school.status === 1 ? '已对接' : '待对接',
      isCooperation: school.status === 1,
      cooperationProjects: [],
      cooperationAmount: 0,
      industryType: '学校',
      createTime: school.create_time
    }))

    // 引入文旅、政府等非学校数据，保持老页面体验
    const legacyCustomers = (customerData?.allCustomers || [])
      .filter(customer => customer.industryType && customer.industryType !== '学校')
      .map(customer => ({
        id: customer.id,
        schoolName: customer.schoolName,
        schoolType: customer.schoolType,
        contactPerson: customer.contactPerson,
        contactPhone: customer.contactPhone,
        salesman: customer.salesman,
        region: customer.region,
        customerType: customer.customerType,
        status: customer.status,
        isCooperation: Boolean(customer.isCooperation),
        cooperationProjects: customer.cooperationProjects || [],
        cooperationAmount: customer.cooperationAmount || 0,
        industryType: customer.industryType,
        createTime: null
      }))

    const allCustomers = [...formattedSchools, ...legacyCustomers]

    // 获取所有唯一区域
    const regions = [...new Set(allCustomers.map(s => s.region).filter(Boolean))]

    // 传递数据给客户端组件
    return (
      <CustomerManagementClient
        initialSchools={allCustomers}
        initialStatistics={statistics}
        regions={regions}
      />
    )
  } catch (error) {
    console.error('获取学校数据失败:', error)
    return (
      <div style={{ padding: '24px' }}>
        <h2>加载失败</h2>
        <p>无法从数据库加载学校数据，请检查数据库连接配置。</p>
        <p style={{ color: '#999' }}>错误信息: {error.message}</p>
      </div>
    )
  }
}

/**
 * 将学校类型代码转换为名称
 */
function getSchoolTypeName(type) {
  const typeMap = {
    1: '幼儿园',
    2: '小学',
    3: '初中',
    4: '高中',
    5: '职校',
    6: '大学'
  }
  return typeMap[type] || '其他'
}
