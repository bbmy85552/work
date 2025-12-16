// 数据中心模拟数据

// 实时数据统计
const realTimeStats = {
  schoolCount: 342,
  teacherCount: 1245,
  teacherOnline: 42987,
  studentCount: 264153,
  parentCount: 568917,
  deviceCount: 1245,
  courseCount: 22,
  resourceCount: 453562,
  // 业务数据中心指标
  pendingSchools: 45,
  pendingDesign: 32,
  pendingOrders: 18,
  completedSchools: 289,
  totalStudents: 264153,
  totalRevenue: 15680000,
  monthlyRevenue: 1285000
}

// 学生实时分析数据（最近24小时）
const studentRealTimeData = [
  { time: '10-08', count: 12000 },
  { time: '10-09', count: 15000 },
  { time: '10-10', count: 13500 },
  { time: '10-11', count: 18000 },
  { time: '10-12', count: 16800 },
  { time: '16:00', count: 14500 },
  { time: '17:00', count: 19200 },
  { time: '18:00', count: 20500 },
  { time: '19:00', count: 18700 },
  { time: '20:00', count: 15600 },
  { time: '21:00', count: 14200 },
  { time: '22:00', count: 11000 }
]

// 等级分布数据
const levelDistribution = {
  '小学': 20,
  '初中': 22,
  '高中': 22,
  '其他': 6
}

// 访问量分析数据
const visitorAnalysis = [
  { date: '10-08', pc: 15000, mobile: 8000 },
  { date: '10-09', pc: 16200, mobile: 8500 },
  { date: '10-10', pc: 14800, mobile: 7800 },
  { date: '10-11', pc: 17500, mobile: 9200 },
  { date: '10-12', pc: 18300, mobile: 9700 }
]

// 学校排名数据
const schoolRanking = [
  { name: '山东综合实验第二中学', usageRate: 100, openCourse: 124235, avgUsage: 145678 },
  { name: '烟台市第二中学', usageRate: 97, openCourse: 118765, avgUsage: 138901 },
  { name: '烟台市第四中学', usageRate: 95, openCourse: 112345, avgUsage: 132456 },
  { name: '烟台莱山第一中学', usageRate: 93, openCourse: 108765, avgUsage: 128901 },
  { name: '烟台实验中学', usageRate: 92, openCourse: 105432, avgUsage: 125678 }
]

// 设备使用分析数据
const deviceUsageData = [
  { name: '浏览器', value: 42 },
  { name: '移动端', value: 28 },
  { name: '门禁', value: 15 },
  { name: '考勤机', value: 8 },
  { name: '管理过程', value: 7 }
]

// 小程序点击量数据
const miniProgramClicks = [
  { date: '10-08', clicks: 28793 },
  { date: '10-09', clicks: 26193 },
  { date: '10-10', clicks: 19831 },
  { date: '10-11', clicks: 18511 },
  { date: '10-12', clicks: 21392 },
  { date: '10-13', clicks: 19432 }
]

// 学生端分析数据
const studentEndAnalysis = [
  { name: '男生', value: 38 },
  { name: '女生', value: 62 }
]

// 应用使用排名
const appUsageRanking = [
  { name: '综合评价平台', rate: 97 },
  { name: '体育记录平台', rate: 82 },
  { name: '综合平台', rate: 80 },
  { name: '成绩平台', rate: 77 },
  { name: '平板教学平台', rate: 72 }
]

// 导出数据
const dataCenterData = {
  realTimeStats,
  studentRealTimeData,
  levelDistribution,
  visitorAnalysis,
  schoolRanking,
  deviceUsageData,
  miniProgramClicks,
  studentEndAnalysis,
  appUsageRanking
}

export default dataCenterData