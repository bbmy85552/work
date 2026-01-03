import { NextResponse } from 'next/server'
import { getSchoolById } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/schools/:id
 * 获取单个学校详情
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    const school = await getSchoolById(parseInt(id))

    if (!school) {
      return NextResponse.json({
        success: false,
        error: '学校不存在'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: school
    })
  } catch (error) {
    console.error('获取学校详情失败:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
