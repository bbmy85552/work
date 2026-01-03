import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import registerChinaMap from '../assets/map/china'

registerChinaMap(echarts)

const provinceList = [
  '北京',
  '天津',
  '上海',
  '重庆',
  '河北',
  '河南',
  '云南',
  '辽宁',
  '黑龙江',
  '湖南',
  '安徽',
  '山东',
  '新疆',
  '江苏',
  '浙江',
  '江西',
  '湖北',
  '广西',
  '甘肃',
  '山西',
  '内蒙古',
  '陕西',
  '吉林',
  '福建',
  '贵州',
  '广东',
  '青海',
  '西藏',
  '四川',
  '宁夏',
  '海南',
  '台湾'
]

const initialMetrics = [
  { label: '覆盖区域总数', value: 342, unit: '个' },
  { label: '合作学校总数', value: 1245, unit: '所' },
  { label: '覆盖教职工', value: 42987, unit: '人' },
  { label: '覆盖学生总数', value: 264153, unit: '人' },
  { label: '销售设备总量', value: 568917, unit: '台' },
  { label: '累计课程资源', value: 1245, unit: '节' },
  { label: '本月访问总量', value: 453562, unit: '次' }
]

const initialOrders = [
  { id: 1, time: '10:23', school: '市第一中学', device: '智慧黑板', num: 20 },
  { id: 2, time: '10:15', school: '实验小学', device: 'AI摄像头', num: 50 },
  { id: 3, time: '09:58', school: '高新职业学院', device: '录播主机', num: 5 },
  { id: 4, time: '09:42', school: '育才中学', device: '电子班牌', num: 32 },
  { id: 5, time: '09:20', school: '附属二小', device: '平板电脑', num: 100 },
  { id: 6, time: '09:05', school: '滨海高中', device: 'VR设备', num: 12 }
]

const formatNumber = (num, fixed = 0) =>
  num.toLocaleString('zh-CN', {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed
  })

const BICockpit = () => {
  const [currentTime, setCurrentTime] = useState('')
  const [totalSales, setTotalSales] = useState(1674207.52)
  const [currentMonthOrders, setCurrentMonthOrders] = useState(42)
  const [topMetrics, setTopMetrics] = useState(initialMetrics)
  const [orderList, setOrderList] = useState(initialOrders)
  const chartsRef = useRef([])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString('zh-CN', {
          hour12: false,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          weekday: 'long'
        })
      )
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTopMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + Math.floor(Math.random() * 3)
        }))
      )
      setTotalSales((prev) => prev + Math.random() * 15)
      setCurrentMonthOrders((prev) => (Math.random() > 0.8 ? prev + 1 : prev))
      setOrderList((prev) => {
        if (!prev.length) return prev
        const [first, ...rest] = prev
        return [...rest, { ...first, id: Date.now() }]
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const mapData = provinceList.map((name) => ({
      name,
      value: Math.floor(Math.random() * 500)
    }))

    const mountedCharts = []

    const initChart = (id, option) => {
      const dom = document.getElementById(id)
      if (!dom) return
      const chart = echarts.init(dom)
      chart.setOption(option)
      mountedCharts.push(chart)
    }

    initChart('salesTrendChart', {
      tooltip: { trigger: 'axis' },
      grid: { top: '15%', bottom: '15%', left: '12%', right: '5%' },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLabel: { color: '#a0c5e8' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#a0c5e8' }
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [120, 132, 101, 134, 90, 230],
          lineStyle: { color: '#00f0ff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 240, 255, 0.3)' },
              { offset: 1, color: 'transparent' }
            ])
          }
        }
      ]
    })

    initChart('schoolTypeChart', {
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '50%'],
          data: [
            { value: 1048, name: '小学' },
            { value: 735, name: '初中' },
            { value: 580, name: '高中' },
            { value: 484, name: '大学' }
          ],
          label: { color: '#fff' },
          itemStyle: { borderRadius: 4, borderColor: '#020b18', borderWidth: 2 }
        }
      ]
    })

    initChart('salesRankChart', {
      grid: { top: '10%', bottom: '10%', left: '25%', right: '15%' },
      xAxis: { show: false },
      yAxis: {
        type: 'category',
        data: ['市一中', '实验小学', '高新职院', '育才中学', '科技大学'],
        axisLabel: { color: '#fff' }
      },
      series: [
        {
          type: 'bar',
          data: [320, 302, 280, 250, 210],
          barWidth: 12,
          itemStyle: { color: '#ed8884', borderRadius: 10 },
          label: { show: true, position: 'right', color: '#fff' }
        }
      ]
    })

    initChart('chinaMap', {
      visualMap: {
        min: 0,
        max: 500,
        show: false,
        inRange: {
          color: ['#0b2a5e']
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 20, 50, 0.9)',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params) => {
          if (!params.name) return ''
          const val = params.value || 0
          return `\
            <div style="padding:8px; line-height:24px;">\
              <div style="color:#00f0ff; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.2); margin-bottom:5px;">${params.name}</div>\
              <div style="font-size:13px;">合作学校：<span style="color:#ffe600; font-size:16px; font-family:Rajdhani;">${val}</span> 所</div>\
              <div style="font-size:13px;">AI设备数：<span style="color:#00ffaa; font-family:Rajdhani;">${(val * 12).toLocaleString()}</span> 台</div>\
            </div>`
        }
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        aspectScale: 0.75,
        scaleLimit: { min: 1, max: 3 },
        label: {
          show: true,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10
        },
        itemStyle: {
          areaColor: '#0b2a5e',
          borderColor: '#2ab8ff',
          borderWidth: 1,
          shadowColor: 'rgba(0, 54, 150, 1)',
          shadowBlur: 20,
          shadowOffsetX: -5,
          shadowOffsetY: 10
        },
        emphasis: {
          label: { show: true, color: '#fff' },
          itemStyle: {
            areaColor: '#1c5ab3',
            shadowBlur: 20,
            shadowColor: '#00f0ff'
          }
        }
      },
      series: [
        {
          name: '区域数据',
          type: 'map',
          geoIndex: 0,
          data: mapData
        },
        {
          name: 'Top点',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [],
          symbolSize: 8,
          rippleEffect: { brushType: 'stroke', scale: 4 },
          itemStyle: { color: '#ffe600' },
          zlevel: 1
        }
      ]
    })

    initChart('deviceTypeChart', {
      grid: { top: '20%', bottom: '20%', left: '10%', right: '10%' },
      xAxis: {
        type: 'category',
        data: ['AI机器人', '智慧人眼', '机器手臂', '科技教室', '智慧走廊'],
        axisLabel: { color: '#a0c5e8' }
      },
      yAxis: { show: false },
      series: [
        {
          type: 'bar',
          data: [220, 182, 191, 234, 290],
          itemStyle: { color: '#00f0ff' },
          label: { show: true, position: 'top', color: '#fff' }
        }
      ]
    })

    initChart('personnelChart', {
      grid: { top: '15%', bottom: '20%', left: '10%', right: '5%' },
      xAxis: {
        type: 'category',
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
        axisLabel: { color: '#a0c5e8' }
      },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          name: '师生',
          data: [150, 230, 224, 218],
          smooth: true,
          lineStyle: { color: '#00f0ff' }
        }
      ]
    })

    initChart('deviceStatusChart', {
      grid: { top: '10%', bottom: '10%', left: '20%', right: '15%' },
      xAxis: { show: false },
      yAxis: { type: 'category', data: ['活跃', '在线'], axisLabel: { color: '#fff' } },
      series: [
        {
          type: 'bar',
          data: [85, 92],
          barWidth: 10,
          itemStyle: { color: '#74f9ff', borderRadius: 5 },
          label: { show: true, position: 'right', formatter: '{c}%', color: '#fff' }
        }
      ]
    })

    chartsRef.current = mountedCharts

    const handleResize = () => {
      chartsRef.current.forEach((chart) => {
        if (chart) chart.resize()
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartsRef.current.forEach((chart) => chart.dispose())
    }
  }, [])

  return (
    <div className="sales-dashboard">
      <div className="header">
        <div className="header-center">
          <h1 className="title">学智AI大数据中心</h1>
          <div className="subtitle">XUEZHIAI BIG DATA CENTER</div>
        </div>
        <div className="header-info">
          <span className="time">{currentTime}</span>
          <span className="weather">24°C 多云转晴</span>
        </div>
      </div>

      <div className="top-metrics">
        {topMetrics.map((item) => (
          <div className="metric-item" key={item.label}>
            <div className="metric-label">{item.label}</div>
            <div className="metric-value-box">
              <span className="metric-value">{formatNumber(item.value, 0)}</span>
              <span className="metric-unit">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="main-grid">
        <div className="column left-col">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">AI设备销售趋势分析</span>
            </div>
            <div id="salesTrendChart" className="chart-box" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">客户学校类型分布</span>
            </div>
            <div id="schoolTypeChart" className="chart-box" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">区域销售业绩排行 TOP5</span>
            </div>
            <div id="salesRankChart" className="chart-box" />
          </div>
        </div>

        <div className="column center-col">
          <div className="map-container-box">
            <div className="map-stats">
              <div className="center-stat">
                <div className="stat-label">年度销售总额</div>
                <div className="stat-num">¥ {formatNumber(totalSales, 2)}</div>
              </div>
              <div className="center-stat">
                <div className="stat-label">本月新增订单</div>
                <div className="stat-num text-yellow">
                  {currentMonthOrders} <small>单</small>
                </div>
              </div>
            </div>
            <div id="chinaMap" className="map-chart" />
          </div>

          <div className="panel bottom-center-panel">
            <div className="panel-header">
              <span className="panel-title">热门销售设备统计</span>
            </div>
            <div id="deviceTypeChart" className="chart-box" />
          </div>
        </div>

        <div className="column right-col">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">覆盖师生人员增长</span>
            </div>
            <div id="personnelChart" className="chart-box" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">设备在线率与活跃度</span>
            </div>
            <div id="deviceStatusChart" className="chart-box" />
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">实时签约动态</span>
            </div>
            <div className="order-list">
              <div className="order-header">
                <span>时间</span>
                <span>学校</span>
                <span>设备</span>
                <span>数量</span>
              </div>
              <div className="order-scroll-container">
                <div className="order-scroll">
                  {orderList.map((order) => (
                    <div className="order-item" key={order.id}>
                      <span className="col-time">{order.time}</span>
                      <span className="col-school">{order.school}</span>
                      <span className="col-device">{order.device}</span>
                      <span className="col-num">{order.num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BICockpit
