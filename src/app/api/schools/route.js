import { NextResponse } from 'next/server'
import { getSchools, getSchoolStatistics } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/schools
 * 获取学校列表（Server Component 友好的 API）
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')
    const schoolType = searchParams.get('schoolType')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 100
    const offset = parseInt(searchParams.get('offset')) || 0

    // 获取学校列表
    const schools = await getSchools({
      region,
      schoolType,
      search,
      limit,
      offset
    })

    // 获取统计数据
    const statistics = await getSchoolStatistics()

    return NextResponse.json({
      success: true,
      data: {
        schools,
        statistics
      }
    })
  } catch (error) {
    console.error('获取学校数据失败:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
