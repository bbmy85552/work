import { Pool } from 'pg'

// PostgreSQL 连接池配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
})

// 测试数据库连接
pool.on('connect', () => {
  console.log('✅ PostgreSQL 数据库连接成功')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 数据库连接错误:', err)
})

/**
 * 执行 SQL 查询
 * @param {string} text - SQL 查询语句
 * @param {Array} params - 查询参数
 * @returns {Promise<Object>} 查询结果
 */
export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('📊 Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Query error:', error)
    throw error
  }
}

/**
 * 获取学校列表
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 学校列表
 */
export async function getSchools(options = {}) {
  const {
    limit = 100,
    offset = 0,
    region,
    schoolType,
    search
  } = options

  let queryText = `
    SELECT
      id,
      name as school_name,
      type as school_type,
      area_name as region,
      owner as contact_person,
      mobile as contact_phone,
      director as salesman,
      customer_type,
      status,
      create_time,
      update_time
    FROM schools
    WHERE 1=1
  `
  const params = []
  let paramIndex = 1

  if (region) {
    queryText += ` AND area_name = $${paramIndex}`
    params.push(region)
    paramIndex++
  }

  if (schoolType) {
    queryText += ` AND type = $${paramIndex}`
    params.push(schoolType)
    paramIndex++
  }

  if (search) {
    queryText += ` AND (name ILIKE $${paramIndex} OR owner ILIKE $${paramIndex} OR mobile ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  queryText += ` ORDER BY create_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(limit, offset)

  const res = await query(queryText, params)
  return res.rows
}

/**
 * 根据 ID 获取单个学校
 * @param {number} id - 学校 ID
 * @returns {Promise<Object>} 学校信息
 */
export async function getSchoolById(id) {
  const queryText = `
    SELECT
      id,
      name as school_name,
      type as school_type,
      area_name as region,
      owner as contact_person,
      mobile as contact_phone,
      director as salesman,
      customer_type,
      status,
      create_time,
      update_time
    FROM schools
    WHERE id = $1
  `
  const res = await query(queryText, [id])
  return res.rows[0]
}

/**
 * 获取统计数据
 * @returns {Promise<Object>} 统计数据
 */
export async function getSchoolStatistics() {
  // 按类型统计
  const typeStats = await query(`
    SELECT
      type,
      COUNT(*) as count
    FROM schools
    GROUP BY type
    ORDER BY count DESC
  `)

  // 按区域统计
  const regionStats = await query(`
    SELECT
      area_name as region,
      COUNT(*) as count
    FROM schools
    GROUP BY area_name
    ORDER BY count DESC
    LIMIT 10
  `)

  // 总数统计
  const totalStats = await query(`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN status = 1 THEN 1 END) as active_count
    FROM schools
  `)

  return {
    byType: typeStats.rows,
    byRegion: regionStats.rows,
    total: totalStats.rows[0]?.total || 0,
    activeCount: totalStats.rows[0]?.active_count || 0
  }
}

export default pool
