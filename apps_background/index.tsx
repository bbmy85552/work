
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Pill, 
  Bell, 
  Search, 
  Menu,
  X,
  HeartPulse,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  LogOut,
  Settings,
  UserCircle,
  Calendar,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Shield,
  Globe,
  Moon,
  Mail,
  Lock,
  Check,
  MessageSquare,
  Sparkles,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { generateData, getDashboardStats, MEDICATIONS, MED_FREQUENCIES, getHealthAnalysis, getUserHealthHistory } from './services/mockData';
import { User, HealthRecord, MedicationIntake, UserRole, Medication } from './types';

// --- Components ---

// 1. Custom SVG Chart Component with Smooth Curves and Gradients for Blood Pressure (Dual Lines)
const BloodPressureChart = ({ systolicData, diastolicData, labels, height = 250 }: {
  systolicData: number[],
  diastolicData: number[],
  labels: string[],
  height?: number
}) => {
  const chartId = useMemo(() => Math.random().toString(36).slice(2, 9), []);
  // Handle empty data
  if (!systolicData || !diastolicData || !labels || systolicData.length === 0 || diastolicData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>暫無血壓數據</p>
        </div>
      </div>
    );
  }

  const allData = [...systolicData, ...diastolicData];
  const max = Math.ceil(Math.max(...allData) + 10);
  const min = Math.floor(Math.min(...allData) - 5);
  const range = max - min || 1;
  const displayMax = Math.ceil(max);
  const displayMin = Math.floor(Math.max(0, min));
  const displayRange = displayMax - displayMin;

  // Helper to calculate coordinates
  const getCoord = (val: number, index: number) => {
    const x = systolicData.length <= 1 ? 50 : (index / (systolicData.length - 1)) * 100;
    const y = 100 - ((val - displayMin) / displayRange) * 100;
    return [x, y];
  };

  // Generate Smooth Path (Cubic Bezier)
  const generateSmoothPath = (points: number[][]) => {
    if (points.length === 0) return "";

    const getControlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const line = [n[0] - p[0], n[1] - p[1]];
      const length = Math.sqrt(Math.pow(line[0], 2) + Math.pow(line[1], 2));
      const angle = Math.atan2(line[1], line[0]) + (reverse ? Math.PI : 0);
      const lengthControl = length * smoothing;
      return [
        current[0] + Math.cos(angle) * lengthControl,
        current[1] + Math.sin(angle) * lengthControl
      ];
    };

    const d = points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      const [cpsX, cpsY] = getControlPoint(a[i - 1], a[i - 2], point);
      const [cpeX, cpeY] = getControlPoint(point, a[i - 1], a[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    }, "");

    return d;
  };

  const systolicPoints = systolicData.map((val, i) => getCoord(val, i));
  const diastolicPoints = diastolicData.map((val, i) => getCoord(val, i));
  const systolicPath = generateSmoothPath(systolicPoints);
  const diastolicPath = generateSmoothPath(diastolicPoints);
  const systolicFirst = systolicPoints[0];
  const systolicLast = systolicPoints[systolicPoints.length - 1];
  const diastolicFirst = diastolicPoints[0];
  const diastolicLast = diastolicPoints[diastolicPoints.length - 1];

  const shouldShowLabel = (index: number, total: number) => {
    if (total <= 7) return true;
    const interval = Math.floor((total - 1) / 5);
    return index % interval === 0 || index === total - 1;
  };

  return (
    <div className="w-full flex flex-col" style={{ height: `${height}px` }}>
      <div className="flex flex-1 min-h-0">
        {/* Y Axis */}
        <div className="flex flex-col justify-between text-xs text-gray-400 pr-4 py-2 text-right font-mono min-w-[3rem] select-none">
          <span>{displayMax}</span>
          <span>{Math.round(displayMax - displayRange * 0.5)}</span>
          <span>{displayMin}</span>
        </div>

        {/* Chart Area */}
        <div className="relative flex-1 rounded-2xl bg-gradient-to-b from-white via-indigo-50/10 to-indigo-50/40 border border-indigo-50">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-60 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-t border-white/70 border-dashed w-full h-0"></div>
            ))}
          </div>

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible relative z-10">
            <defs>
              <linearGradient id={`systolic-area-${chartId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id={`diastolic-area-${chartId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
              </linearGradient>
              <filter id={`systolic-shadow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#4F46E5" floodOpacity="0.35" />
              </filter>
              <filter id={`diastolic-shadow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#EF4444" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Area Fills */}
            <path
              d={`${systolicPath} L ${systolicLast[0]},100 L ${systolicFirst[0]},100 Z`}
              fill={`url(#systolic-area-${chartId})`}
              opacity="0.9"
            />
            <path
              d={`${diastolicPath} L ${diastolicLast[0]},100 L ${diastolicFirst[0]},100 Z`}
              fill={`url(#diastolic-area-${chartId})`}
              opacity="0.9"
            />

            {/* Systolic Line */}
            <path
              d={systolicPath}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#systolic-shadow-${chartId})`}
              vectorEffect="non-scaling-stroke"
            />

            {/* Diastolic Line */}
            <path
              d={diastolicPath}
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#diastolic-shadow-${chartId})`}
              vectorEffect="non-scaling-stroke"
              opacity="0.95"
            />

          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end gap-4 mt-4">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
          <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></span>
          收縮壓
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-red-500">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>
          舒張壓
        </div>
      </div>

      {/* X Axis */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono select-none">
        {labels.map((label, index) => (
          <span
            key={index}
            className={`flex-1 text-center ${shouldShowLabel(index, labels.length) ? 'opacity-80' : 'opacity-0'}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

// 1. Single Line Chart for Glucose
const SimpleLineChart = ({ data, labels, color = "#10B981", height = 250 }: { data: number[], labels: string[], color?: string, height?: number }) => {
  // Handle empty data
  if (!data || !labels || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>暫無血糖數據</p>
        </div>
      </div>
    );
  }

  const max = Math.ceil(Math.max(...data));
  const min = Math.floor(Math.min(...data));
  const range = max - min || 1;
  const paddingY = range * 0.1;
  const displayMax = Math.ceil(max + paddingY);
  const displayMin = Math.floor(Math.max(0, min - paddingY));
  const displayRange = displayMax - displayMin;

  const getCoord = (val: number, index: number) => {
    const x = data.length <= 1 ? 50 : (index / (data.length - 1)) * 100;
    const y = 100 - ((val - displayMin) / displayRange) * 100;
    return [x, y];
  };

  const generateSmoothPath = (points: number[][]) => {
    if (points.length === 0) return "";

    const getControlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const line = [n[0] - p[0], n[1] - p[1]];
      const length = Math.sqrt(Math.pow(line[0], 2) + Math.pow(line[1], 2));
      const angle = Math.atan2(line[1], line[0]) + (reverse ? Math.PI : 0);
      const lengthControl = length * smoothing;
      return [
        current[0] + Math.cos(angle) * lengthControl,
        current[1] + Math.sin(angle) * lengthControl
      ];
    };

    const d = points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      const [cpsX, cpsY] = getControlPoint(a[i - 1], a[i - 2], point);
      const [cpeX, cpeY] = getControlPoint(point, a[i - 1], a[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    }, "");

    return d;
  };

  const points = data.map((val, i) => getCoord(val, i));
  const linePath = generateSmoothPath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = points.length ? `${linePath} L ${lastPoint[0]},100 L ${firstPoint[0]},100 Z` : "";
  const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  const shouldShowLabel = (index: number, total: number) => {
    if (total <= 7) return true;
    const interval = Math.floor((total - 1) / 5);
    return index % interval === 0 || index === total - 1;
  };

  return (
    <div className="w-full flex flex-col" style={{ height: `${height}px` }}>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col justify-between text-xs text-gray-400 pr-4 py-2 text-right font-mono min-w-[3rem] select-none">
          <span>{displayMax}</span>
          <span>{Math.round(displayMax - displayRange * 0.5)}</span>
          <span>{displayMin}</span>
        </div>

        <div className="relative flex-1 rounded-2xl bg-gradient-to-b from-white via-emerald-50/20 to-emerald-50/40 border border-emerald-50">
          <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-60 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-t border-white/70 border-dashed w-full h-0"></div>
            ))}
          </div>

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible relative z-10">
            <defs>
              <linearGradient id={`gradient-${uniqueId}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
              <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor={color} floodOpacity="0.35" />
              </filter>
            </defs>

            {areaPath && (
              <path
                d={areaPath}
                fill={`url(#gradient-${uniqueId})`}
              />
            )}

            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#shadow-${uniqueId})`}
              vectorEffect="non-scaling-stroke"
            />

          </svg>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono select-none">
        {labels.map((label, index) => (
          <span
            key={index}
            className={`flex-1 text-center ${shouldShowLabel(index, labels.length) ? 'opacity-80' : 'opacity-0'}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

const MiniSparkline = ({ data, color = '#4F46E5', width = 120, height = 60 }: { data: number[], color?: string, width?: number, height?: number }) => {
  const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);
  if (!data || data.length === 0) {
    return <div style={{ width, height }}></div>;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, idx) => {
    const x = data.length <= 1 ? 50 : (idx / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return [x, y];
  });

  const generateSmoothPath = (pts: number[][]) => {
    if (pts.length === 0) return "";
    const getControlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const line = [n[0] - p[0], n[1] - p[1]];
      const length = Math.sqrt(Math.pow(line[0], 2) + Math.pow(line[1], 2));
      const angle = Math.atan2(line[1], line[0]) + (reverse ? Math.PI : 0);
      const controlLength = length * smoothing;
      return [
        current[0] + Math.cos(angle) * controlLength,
        current[1] + Math.sin(angle) * controlLength
      ];
    };

    return pts.reduce((acc, point, i, array) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      const [cpsX, cpsY] = getControlPoint(array[i - 1], array[i - 2], point);
      const [cpeX, cpeY] = getControlPoint(point, array[i - 1], array[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    }, "");
  };

  const linePath = generateSmoothPath(points);

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint[0]},100 L ${firstPoint[0]},100 Z`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: `${width}px`, height: `${height}px` }} className="shrink-0">
      <defs>
        <linearGradient id={`sparkline-stroke-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`sparkline-fill-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sparkline-fill-${uniqueId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={`url(#sparkline-stroke-${uniqueId})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type DetailTab = 'health' | 'chat';

const FEATURE_HIGHLIGHTS = [
  {
    id: 'ai',
    title: 'AI 智慧陪伴',
    description: '24/7 與長者互動、提醒與安撫情緒，亦能引導呼吸、講故事維持陪伴。',
    icon: MessageCircle,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    points: ['對話中即時辨識情緒', '主動提醒血壓 / 用藥', '手機一鍵開啟陪聊']
  },
  {
    id: 'input',
    title: '多元資料錄入',
    description: '支援語音、拍照 OCR 及手動輸入，照護者也能代為更新指標與生活紀錄。',
    icon: FileText,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    points: ['語音輸入、文字即時轉檔', 'OCR 辨識儀器/處方', '自訂健康欄位與備註']
  },
  {
    id: 'care',
    title: '照護者協同',
    description: '可邀請家屬或專業照護者加入，同步收到警示並留下照護紀錄。',
    icon: Users,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    points: ['多帳號共用同一長者', '即時推播異常狀態', '完整照護操作日誌']
  },
  {
    id: 'analytics',
    title: '後台智慧分析',
    description: '專屬儀表板彙整健康與聊天資料，輸出洞察與建議，協助決策。',
    icon: LayoutDashboard,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    points: ['健康趨勢與用藥依從性', '聊天摘要 / 情緒走勢', '自動產生重點提醒']
  }
];

// 2. Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }: any) => {
  const menuItems = [
    { id: 'features', label: '功能特點', icon: Sparkles },
    { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
    { id: 'users', label: '用戶管理', icon: Users },
    { id: 'health', label: '健康監測', icon: HeartPulse },
    { id: 'medications', label: '用藥管理', icon: Pill },
    { id: 'contact', label: '聯絡我們', icon: Mail },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsMobileOpen(false)}></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">智</div>
            <span className="text-xl font-bold text-gray-800">智康健</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button className="flex items-center w-full px-4 py-3 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">登出</span>
          </button>
        </div>
      </div>
    </>
  );
};

const FeatureHighlightsView = () => {
  const slides = useMemo(() => ([
    { id: 'feature-overview', type: 'content' },
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `feature-image-${index + 1}`,
      type: 'image' as const,
      src: getPublicAsset(`${index + 1}.png`),
      caption: `產品功能示意 ${index + 1}`
    }))
  ]), []);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const isFeatureSlide = currentSlide === 0;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, isFeatureSlide ? 10000 : 5000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  const featureContent = (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">產品核心能力</h2>
          <p className="text-gray-600 text-base md:text-lg">整合長者 App、照護者協作與後台 AI 分析，打造可視化的健康照護流程。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['長者手機即用', '照護者多人共管', 'AI 聊天 + 後台洞察'].map((tag) => (
            <span key={tag} className="px-5 py-2 text-lg font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
        {FEATURE_HIGHLIGHTS.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className="bg-white shadow-lg border border-white/80 rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-indigo-500 via-white to-emerald-500 pointer-events-none"></div>
              <div className="flex items-center justify-start gap-4 mb-4">
                <div className={`p-4 rounded-2xl ${feature.iconBg}`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                  <span className="text-xs uppercase tracking-widest text-gray-400">for elders & carers</span>
                </div>
              </div>
              <p className="text-base text-gray-700 leading-relaxed flex-1">{feature.description}</p>
              <ul className="mt-5 space-y-3 text-base text-gray-700">
                {feature.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-2 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSlide = () => {
    const slide = slides[currentSlide];
    if (slide.type === 'content') {
      return featureContent;
    }
    return (
      <div className="relative min-h-[520px] rounded-[32px] overflow-hidden">
        <img
          src={slide.src}
          alt={slide.caption}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white space-y-2 drop-shadow-lg">
          <p className="text-2xl font-semibold">AI 健康管家</p>
          <p className="text-sm uppercase tracking-widest">{slide.caption}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-[32px] bg-gradient-to-b from-indigo-50/70 via-white to-emerald-50/50 p-6 border border-indigo-50 shadow-inner min-h-[520px]">
        {renderSlide()}
      </div>
      <div className="flex justify-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            aria-label={`切換到第 ${index + 1} 張`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full border transition-all ${currentSlide === index ? 'bg-indigo-600 border-indigo-600 scale-110' : 'bg-transparent border-gray-300 hover:border-indigo-400'}`}
          />
        ))}
      </div>
    </div>
  );
};

const ContactView = () => {
  const shots = [
    { src: getPublicAsset('Image (1).jpeg'), title: 'wechat', description: '' },
    { src: getPublicAsset('Image (2).jpeg'), title: 'whatsapp', description: '' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">聯絡我們</h2>
          <p className="text-gray-500 text-base md:text-lg">展示長者端與照護者端的真實畫面，若需進一步合作或導入請與我們聯繫。</p>
        </div>
        <div className="bg-white border border-indigo-100 rounded-2xl px-5 py-3 shadow-sm">
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="text-lg font-semibold text-gray-900">+852 3426 2604</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {shots.map((shot) => (
          <div key={shot.src} className="bg-white border border-gray-100 rounded-[32px] shadow-lg p-6 flex flex-col gap-5">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-900">{shot.title}</h3>
              <p className="text-sm text-gray-500">{shot.description}</p>
            </div>
            <div
              className="w-full rounded-2xl border border-gray-200 shadow-inner bg-gray-50 overflow-hidden flex items-center justify-center p-3"
              style={{ height: '60vh', minHeight: '360px' }}
            >
              <img
                src={shot.src}
                alt={shot.title}
                className="w-full h-auto object-cover"
                style={{ clipPath: 'inset(20% 0 20% 0)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Dashboard View
const DashboardView = ({ stats, records }: { stats: any, records: HealthRecord[] }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Mock data for charts - dynamic based on selection
  const chartData = useMemo(() => {
    if (timeRange === 'week') {
      return {
        bp: [118, 120, 119, 125, 122, 130, 124],
        glucose: [5.2, 5.4, 5.1, 5.8, 6.1, 5.9, 5.3],
        avgBp: "124 mmHg",
        avgGlucose: "5.4 mmol/L",
        labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
      };
    } else {
      // Generate labels for 30 days
      const labels = Array.from({length: 30}, (_, i) => `${i + 1}日`);
      return {
        bp: [115, 118, 120, 122, 119, 121, 125, 128, 124, 122, 120, 118, 125, 130, 128, 126, 124, 122, 120, 121, 119, 118, 120, 124, 122, 130, 128, 124, 121, 119],
        glucose: [5.0, 5.2, 5.3, 5.4, 5.1, 5.5, 5.8, 6.1, 5.9, 5.6, 5.5, 5.3, 5.2, 5.0, 5.1, 5.3, 5.8, 6.0, 5.9, 5.5, 5.3, 5.2, 5.4, 5.1, 5.8, 6.1, 5.9, 5.5, 5.3, 5.2],
        avgBp: "122 mmHg",
        avgGlucose: "5.5 mmol/L",
        labels: labels
      };
    }
  }, [timeRange]);

  const allAlerts = records.filter(r => r.status !== 'normal');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">總覽</h2>
        <p className="text-gray-500">歡迎回來，Oscar。這是今天的概況。</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "總用戶數", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%", trendUp: true, compare: "較上月" },
          { label: "緊急警報", value: stats.activeAlerts, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", trend: "+2", trendUp: false, compare: "較昨日" }, 
          { label: "用藥依從性", value: `${stats.medicationCompliance}%`, icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+5%", trendUp: true, compare: "較上週" },
          { label: "新增用戶", value: stats.newUsersToday, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.trend && (
                <div className="text-right">
                   <span className={`flex items-center justify-end text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp ? (stat.color === "text-red-600" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600") : (stat.color === "text-red-600" ? "bg-red-100 text-red-600" : "bg-red-100 text-red-600")}`}>
                    {stat.trend}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{stat.compare}</p>
                </div>
              )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">健康趨勢分析</h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
               <button 
                 onClick={() => setTimeRange('week')}
                 className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 'week' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 本週
               </button>
               <button 
                 onClick={() => setTimeRange('month')}
                 className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 本月
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm px-2">
                <span className="text-gray-500">平均收縮壓</span>
                <span className="font-bold text-indigo-600">{chartData.avgBp}</span>
              </div>
              <SimpleLineChart data={chartData.bp} labels={chartData.labels} color="#4F46E5" height={200} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm px-2">
                <span className="text-gray-500">平均血糖</span>
                <span className="font-bold text-emerald-600">{chartData.avgGlucose}</span>
              </div>
              <SimpleLineChart data={chartData.glucose} labels={chartData.labels} color="#10B981" height={200} />
            </div>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-bold text-gray-800 mb-4">近期警報</h3>
          <div className="space-y-4 flex-1 overflow-hidden">
            {allAlerts.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${record.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{record.user_name.replace(' (長者)', '')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {record.type === 'bloodPressure' ? `血壓: ${record.systolic}/${record.diastolic}` : `血糖: ${record.glucose}`} 
                    <span className="mx-1 text-gray-300">•</span> 
                    {new Date(record.recorded_at).toLocaleDateString('zh-TW', {month: 'numeric', day: 'numeric'})} {new Date(record.recorded_at).toLocaleTimeString('zh-TW', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            {allAlerts.length === 0 && (
               <div className="text-center py-8 text-gray-400 text-sm">暫無近期警報</div>
            )}
          </div>
          <button 
            onClick={() => setShowAllAlerts(true)}
            className="w-full mt-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          >
            查看所有警報
          </button>
        </div>
      </div>

      {/* All Alerts Modal */}
      {showAllAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                所有異常警報記錄
              </h3>
              <button onClick={() => setShowAllAlerts(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">時間</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">用戶</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">類型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">數值</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allAlerts.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(record.recorded_at).toLocaleString('zh-TW')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {record.user_name.replace(' (長者)', '')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.type === 'bloodPressure' ? '血壓' : '血糖'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {record.type === 'bloodPressure' ? `${record.systolic}/${record.diastolic} mmHg` : `${record.glucose} mmol/L`}
                      </td>
                      <td className="px-4 py-3">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {record.status === 'critical' ? '危急' : '注意'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Users View
const UsersView = ({ users, records }: { users: User[], records: HealthRecord[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const userRecordsMap = useMemo(() => {
    const map: Record<string, HealthRecord[]> = {};
    records.forEach(record => {
      if (!map[record.user_id]) {
        map[record.user_id] = [];
      }
      map[record.user_id].push(record);
    });
    return map;
  }, [records]);

  const roleToChinese = (role: UserRole) => {
    return role === UserRole.Elder ? '長者' : '照護者';
  };

  const statusToChinese = (status: string) => {
    if (status === 'normal') return '正常';
    if (status === 'warning') return '注意';
    if (status === 'critical') return '危急';
    return status;
  };

  const getUserChartData = (userId: string) => {
    const userRecords = userRecordsMap[userId] || [];
    const formatLabel = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
    const lastSevenDays = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - idx));
      return {
        key: date.toISOString().split('T')[0],
        label: formatLabel(date)
      };
    });

    const buckets = lastSevenDays.reduce((acc, day) => {
      acc[day.key] = { systolic: [] as number[], diastolic: [] as number[], glucose: [] as number[] };
      return acc;
    }, {} as Record<string, { systolic: number[], diastolic: number[], glucose: number[] }>);

    userRecords.forEach(record => {
      const dateKey = record.recorded_at.split('T')[0];
      const bucket = buckets[dateKey];
      if (!bucket) return;

      if (record.type === 'bloodPressure' && typeof record.systolic === 'number' && typeof record.diastolic === 'number') {
        bucket.systolic.push(record.systolic);
        bucket.diastolic.push(record.diastolic);
      }
      if (record.type === 'glucose' && typeof record.glucose === 'number') {
        bucket.glucose.push(record.glucose);
      }
    });

    const getAverage = (values: number[], precision: number = 0) => {
      if (!values.length) return null;
      const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
      return parseFloat(avg.toFixed(precision));
    };

    const getAllValues = (type: 'systolic' | 'diastolic' | 'glucose') => {
      return userRecords
        .filter(record => {
          if (type === 'glucose') {
            return record.type === 'glucose' && typeof record.glucose === 'number';
          }
          return record.type === 'bloodPressure' && typeof (type === 'systolic' ? record.systolic : record.diastolic) === 'number';
        })
        .map(record => {
          if (type === 'glucose') {
            return record.glucose as number;
          }
          return type === 'systolic' ? (record.systolic as number) : (record.diastolic as number);
        });
    };

    let lastSystolic = getAverage(getAllValues('systolic')) || 125;
    let lastDiastolic = getAverage(getAllValues('diastolic')) || 82;
    let lastGlucose = getAverage(getAllValues('glucose'), 1) || 6.1;

    const systolicData: number[] = [];
    const diastolicData: number[] = [];
    const glucoseData: number[] = [];

    lastSevenDays.forEach(day => {
      const bucket = buckets[day.key];
      const avgSystolic = getAverage(bucket.systolic);
      const avgDiastolic = getAverage(bucket.diastolic);
      const avgGlucose = getAverage(bucket.glucose, 1);

      if (avgSystolic !== null) lastSystolic = avgSystolic;
      if (avgDiastolic !== null) lastDiastolic = avgDiastolic;
      if (avgGlucose !== null) lastGlucose = avgGlucose;

      systolicData.push(Math.round(lastSystolic));
      diastolicData.push(Math.round(lastDiastolic));
      glucoseData.push(parseFloat(lastGlucose.toFixed(1)));
    });

    return {
      systolicData,
      diastolicData,
      glucoseData,
      labels: lastSevenDays.map(day => day.label)
    };
  };

  // User Details Modal Component
  const UserDetailsModal = ({ user }: { user: User }) => {
    const { systolicData, diastolicData, glucoseData, labels } = getUserChartData(user.id);
    const [detailTab, setDetailTab] = useState<DetailTab>('chat');

    // AI健康分析数据
    const getHealthAnalysis = (userId: string) => {
      const analyses = {
        "u-1": {
          summary: "李秀英的健康狀況整體穩定但需要注意。血壓略高，血糖處於正常高值。服藥依從性良好，生活規律。血壓在135-145 mmHg之間波動，血糖在5.7-6.3 mmol/L範圍內。",
          concerns: [
            "血壓持續偏高，收縮壓平均140 mmHg，舒張壓平均86 mmHg",
            "鹽分攝入應適當控制，建議每日不超過6克",
            "血糖處於正常高值，需要飲食控制和規律運動"
          ],
          recommendations: [
            "每天測量血壓並記錄，固定時間測量",
            "保持低鹽飲食，多吃蔬菜水果",
            "每週運動至少3次，每次30分鐘有氧運動",
            "定期複診並調整用藥劑量"
          ]
        },
        "u-2": {
          summary: "張偉強的健康狀況需要立即關注。血壓和血糖都處於危險高值，血壓達到165-198/95-122 mmHg，血糖8.2-12.1 mmol/L，需要密切監測和及時醫療介入。",
          concerns: [
            "血壓嚴重超标，有心血管疾病和中風風險",
            "血糖控制不佳，長期高血糖會導致腎臟、眼部併發症",
            "需要立即醫療評估，可能需要住院治療"
          ],
          recommendations: [
            "立即聯繫主治醫師進行緊急評估",
            "每日監測血壓和血糖2-3次，記錄變化",
            "嚴格遵守用藥時間，不得自行停藥或改藥",
            "避免高鹽高糖高脂食物，嚴格控制飲食",
            "家屬需要密切協助監測，出現不適立即就醫"
          ]
        },
        "u-3": {
          summary: "陳美麗的健康狀況良好。血壓穩定在115-130/72-81 mmHg之間，血糖在4.8-6.1 mmol/L範圍內，各項指標都在正常範圍。生活規律，服藥依從性佳。",
          concerns: [
            "年齡較高(75歲)，需繼續維持健康狀態",
            "注意預防跌倒和意外，保持居家環境安全",
            "定期檢查肝腎功能，監測用藥副作用"
          ],
          recommendations: [
            "保持目前的生活習慣和飲食規律",
            "定期健康檢查，每3-6個月全面體檢一次",
            "適度運動保持體能，如散步、太極拳",
            "維持社交活動，保持心理健康"
          ]
        },
        "u-4": {
          summary: "黃志明的健康狀況基本穩定，但血糖控制需要改善。血壓正常穩定在125-140/78-92 mmHg，但血糖偏高7.2-11.1 mmol/L，需要加強飲食管理。",
          concerns: [
            "血糖偏高，控制不佳，有糖尿病併發症風險",
            "體重管理需要加強，BMI可能超標",
            "需要更好的飲食自律性"
          ],
          recommendations: [
            "控制碳水化合物攝入，減少精緻澱粉",
            "增加纖維類食物，多吃全穀物和蔬菜",
            "規律運動有助血糖控制，建議每天快走30分鐘",
            "每3個月檢測糖化血色素，評估長期血糖控制"
          ]
        }
      };

      return analyses[userId] || {
        summary: "健康狀況穩定，持續監測中。",
        concerns: ["定期健康檢查"],
        recommendations: ["保持健康生活方式"]
      };
    };

    const getChatAnalysis = (userId: string) => {
      const chatAnalyses = {
        "u-1": {
          summary: "過去一週與AI互動14次，以血壓提醒與陪伴聊天為主，整體情緒穩定略偏正向。",
          stats: {
            sessions: 14,
            avgDuration: "11 分鐘",
            positiveRate: "68%",
            focusTopic: "血壓/睡眠"
          },
          trend: {
            sessions: [10, 12, 11, 13, 14, 15, 14],
            positive: [62, 64, 63, 66, 67, 68, 70]
          },
          insights: [
            "早上9-10點最常主動發起聊天，詢問血壓是否在安全值。",
            "晚上睡前有輕微焦慮，需要被提醒呼吸放鬆才能入眠。",
            "對孫子與家人話題有興趣，分享頻率增加帶來好情緒。"
          ],
          suggestions: [
            "維持早晨關懷問候並即時回覆血壓紀錄，給予肯定。",
            "睡前提供呼吸引導、放鬆音樂等訊息協助入睡。",
            "適時延伸家人話題，讓長者覺得被傾聽。"
          ],
          sampleChats: [
            { time: "03/12 09:18", speaker: "長者", role: "elder", content: "今天早上血壓135/82，可以放心嗎？", sentiment: "關注健康" },
            { time: "03/12 09:19", speaker: "AI助理", role: "ai", content: "數值在可接受範圍，午餐記得減鹽並維持散步30分鐘喔。", sentiment: "回應與提醒" },
            { time: "03/11 21:05", speaker: "長者", role: "elder", content: "最近睡前會緊張，你能陪我聊一下嗎？", sentiment: "情緒陪伴" }
          ],
          lastInteraction: "03/12 21:05"
        },
        "u-2": {
          summary: "近七日互動22次，大多主動尋求血壓/血糖異常的協助，語氣焦慮，需要強化安撫。",
          stats: {
            sessions: 22,
            avgDuration: "8 分鐘",
            positiveRate: "42%",
            focusTopic: "血壓警示"
          },
          trend: {
            sessions: [18, 19, 20, 21, 22, 24, 23],
            positive: [38, 40, 37, 41, 39, 42, 43]
          },
          insights: [
            "晚上10點後頻繁回報頭暈與胸悶，需提醒即時就醫流程。",
            "常質疑藥物效果，期待更具體的行動建議。",
            "情緒波動大，回應太慢會再三追問。"
          ],
          suggestions: [
            "回覆時採取分段式指引，列出下一步動作降低焦慮。",
            "重複強調與醫師溝通的重要性，提供聯絡資訊。",
            "主動確認症狀是否緩解，增加安全感。"
          ],
          sampleChats: [
            { time: "03/10 22:41", speaker: "長者", role: "elder", content: "血壓飆到168/100，現在怎麼辦？", sentiment: "緊急警示" },
            { time: "03/10 22:42", speaker: "AI助理", role: "ai", content: "請立即坐下深呼吸，同時通知家人準備就醫，我幫您整理注意事項。", sentiment: "行動指引" },
            { time: "03/09 07:25", speaker: "長者", role: "elder", content: "今天還需要吃同樣的藥嗎？效果好像不大。", sentiment: "用藥疑惑" }
          ],
          lastInteraction: "03/11 22:48"
        },
        "u-3": {
          summary: "與AI互動9次，以分享日常與問候為主，語氣輕鬆開朗，偶爾提醒復健進度。",
          stats: {
            sessions: 9,
            avgDuration: "6 分鐘",
            positiveRate: "82%",
            focusTopic: "生活分享"
          },
          trend: {
            sessions: [7, 8, 9, 10, 9, 8, 9],
            positive: [78, 80, 81, 82, 83, 84, 82]
          },
          insights: [
            "下午茶時間喜歡聊天，常分享社區活動。",
            "對於復健運動會主動回報完成狀態。",
            "希望得到語音陪伴，表示聽故事很放鬆。"
          ],
          suggestions: [
            "維持愉快問候語氣，延伸話題到興趣與社交活動。",
            "定期追蹤復健進度並給予鼓勵。",
            "提供可以收聽的有聲內容或引導呼吸。"
          ],
          sampleChats: [
            { time: "03/08 15:10", speaker: "長者", role: "elder", content: "我今天跟鄰居做了太極，覺得很舒服。", sentiment: "正向分享" },
            { time: "03/08 15:12", speaker: "AI助理", role: "ai", content: "太棒了！保持溫和動作最適合妳，等下記得補充溫水喔。", sentiment: "肯定與提醒" },
            { time: "03/07 20:30", speaker: "長者", role: "elder", content: "可以再講一個睡前故事嗎？昨天那個很好聽。", sentiment: "情緒需求" }
          ],
          lastInteraction: "03/08 21:03"
        },
        "u-4": {
          summary: "過去7天互動12次，主題圍繞飲食與血糖控制，白天心情穩定，餐後容易擔心。",
          stats: {
            sessions: 12,
            avgDuration: "7 分鐘",
            positiveRate: "56%",
            focusTopic: "飲食提醒"
          },
          trend: {
            sessions: [9, 10, 11, 12, 11, 12, 12],
            positive: [50, 51, 53, 55, 56, 57, 58]
          },
          insights: [
            "午餐後30分鐘固定上線詢問血糖與飲食搭配。",
            "晚餐前擔心吃太多，會主動詢問替代食物。",
            "喜歡被給予具體菜單與運動提醒。"
          ],
          suggestions: [
            "提供簡易菜單或份量提示，降低飲食壓力。",
            "多鼓勵餐後散步與拉伸，建立正向回饋。",
            "提醒記錄血糖後傳送照片，增加互動。"
          ],
          sampleChats: [
            { time: "03/11 12:52", speaker: "長者", role: "elder", content: "今天便當有紅燒肉，我可以多吃嗎？", sentiment: "飲食猶豫" },
            { time: "03/11 12:53", speaker: "AI助理", role: "ai", content: "建議先吃一半，搭配多一份青菜，飯後散步15分鐘。", sentiment: "具體建議" },
            { time: "03/10 19:10", speaker: "長者", role: "elder", content: "血糖量到8.9，有點擔心。", sentiment: "血糖提醒" }
          ],
          lastInteraction: "03/11 19:42"
        }
      };

      return chatAnalyses[userId] || {
        summary: "最近互動紀錄穩定，AI持續提供陪伴與提醒。",
        stats: {
          sessions: 6,
          avgDuration: "8 分鐘",
          positiveRate: "60%",
          focusTopic: "日常問候"
        },
        trend: {
          sessions: [5, 6, 6, 7, 6, 7, 6],
          positive: [55, 57, 58, 59, 60, 61, 62]
        },
        insights: ["持續觀察情緒變化。"],
        suggestions: ["保持規律問候與健康提醒。"],
        sampleChats: [
          { time: "03/10 10:00", speaker: "長者", role: "elder", content: "感謝你的提醒，我會記得量血壓。", sentiment: "互動回饋" }
        ],
        lastInteraction: "03/10 10:00"
      };
    };

    const healthAnalysis = getHealthAnalysis(user.id);
    const chatAnalysis = getChatAnalysis(user.id);
    const detailToggleButtons: { id: DetailTab; label: string; icon: React.ElementType }[] = [
      { id: 'health', label: '健康數據', icon: HeartPulse },
      { id: 'chat', label: '聊天分析', icon: MessageCircle }
    ];
    const latestSystolic = systolicData.length ? systolicData[systolicData.length - 1] : null;
    const latestDiastolic = diastolicData.length ? diastolicData[diastolicData.length - 1] : null;
    const latestGlucose = glucoseData.length ? glucoseData[glucoseData.length - 1] : null;
    const joinedDate = new Date(user.joined_at).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] max-h-[90vh] flex flex-col shadow-2xl animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap justify-between gap-4 items-start">
              <div className="flex items-center gap-4 flex-1 min-w-[240px]">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${user.avatar_color}`}>
                  {user.name.replace(' (長者)', '').charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{user.name.replace(' (長者)', '')}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === UserRole.Elder ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {roleToChinese(user.role)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.health_status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                      user.health_status === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.health_status === 'normal' ? 'bg-emerald-500' :
                        user.health_status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></span>
                      {statusToChinese(user.health_status)}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      加入: {joinedDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  {detailToggleButtons.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = detailTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDetailTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                          isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 bg-white overflow-hidden">
            {detailTab === 'health' ? (
              <div className="h-full overflow-y-auto bg-white p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-emerald-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">最新血壓</p>
                        <p className="text-2xl font-bold text-emerald-900 mt-1">{latestSystolic !== null && latestDiastolic !== null ? `${latestSystolic}/${latestDiastolic} mmHg` : '--'}</p>
                        <p className="text-xs text-emerald-700 mt-1">維持規律紀錄以追蹤變化</p>
                      </div>
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-indigo-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">最新血糖</p>
                        <p className="text-2xl font-bold text-indigo-900 mt-1">{latestGlucose !== null ? `${latestGlucose} mmol/L` : '--'}</p>
                        <p className="text-xs text-indigo-700 mt-1">飯後30分鐘測量</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">血壓趨勢</h4>
                          <p className="text-xs text-gray-500">過去14天收縮壓 / 舒張壓變化</p>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                          <HeartPulse className="w-3.5 h-3.5" />
                          mmHg
                        </div>
                      </div>
                      <BloodPressureChart
                        systolicData={systolicData}
                        diastolicData={diastolicData}
                        labels={labels}
                        height={280}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">血糖趨勢</h4>
                          <p className="text-xs text-gray-500">過去14天餐後血糖</p>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                          <TrendingUp className="w-3.5 h-3.5" />
                          mmol/L
                        </div>
                      </div>
                      <SimpleLineChart
                        data={glucoseData}
                        labels={labels}
                        color="#10B981"
                        height={260}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-white/60 shadow-inner space-y-5">
                      <div className="flex items-center gap-2 text-gray-800">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-lg font-semibold">AI健康分析</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{healthAnalysis.summary}</p>

                      <div className="space-y-4">
                        <div className="bg-white/80 border border-white/60 rounded-xl p-4">
                          <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            需注意項目
                          </h5>
                          <ul className="space-y-2">
                            {healthAnalysis.concerns.map((concern, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                          <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            建議措施
                          </h5>
                          <ul className="space-y-2">
                            {healthAnalysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2 text-green-700 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto bg-white p-6">
                <div className="max-w-3xl mx-auto space-y-5">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">聊天紀錄分析</h4>
                          <p className="text-xs text-gray-500">AI助理與長者互動摘要</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400">更新：{chatAnalysis.lastInteraction}</span>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">{chatAnalysis.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center justify-between gap-6">
                        <div>
                          <p className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wide">過去7日互動</p>
                          <p className="text-2xl font-bold text-indigo-700">{chatAnalysis.stats.sessions}</p>
                          <p className="text-xs text-indigo-600">平均 {chatAnalysis.stats.avgDuration}</p>
                        </div>
                        <MiniSparkline data={chatAnalysis.trend?.sessions || []} color="#4F46E5" width={150} height={60} />
                      </div>
                      <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/70 flex items-center justify-between gap-6">
                        <div>
                          <p className="text-[11px] text-emerald-500 font-semibold uppercase tracking-wide">情緒正向率</p>
                          <p className="text-2xl font-bold text-emerald-700">{chatAnalysis.stats.positiveRate}</p>
                          <p className="text-xs text-emerald-600">焦點：{chatAnalysis.stats.focusTopic}</p>
                        </div>
                        <MiniSparkline data={chatAnalysis.trend?.positive || []} color="#059669" width={150} height={60} />
                    </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2 text-sm">關鍵觀察</h5>
                      <ul className="space-y-2">
                        {chatAnalysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                      <h5 className="font-medium text-gray-800 mb-3 text-sm">近期對話摘錄</h5>
                      <div className="space-y-3">
                        {chatAnalysis.sampleChats.map((chat, index) => (
                          <div key={index} className="rounded-xl bg-white border border-gray-100 p-3 shadow-sm">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                              <span className={`font-semibold ${chat.role === 'ai' ? 'text-indigo-600' : 'text-gray-600'}`}>{chat.speaker}</span>
                              <span>{chat.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{chat.content}</p>
                            <span className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              chat.role === 'ai' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                            }`}>{chat.sentiment}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2 text-sm">建議互動策略</h5>
                      <ul className="space-y-2">
                        {chatAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">用戶管理</h2>
          <p className="text-gray-500">查看病患詳細健康資料與分析報告。</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜尋用戶..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">用戶</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">狀態</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">聯絡方式</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">年齡</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.avatar_color || 'bg-gray-200'}`}>
                        {user.name.replace(' (長者)', '').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name.replace(' (長者)', '')}</p>
                        <p className="text-xs text-gray-500">{user.gender === 'male' ? '男' : '女'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === UserRole.Elder ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'}`}>
                      {roleToChinese(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.health_status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                      user.health_status === 'warning' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.health_status === 'normal' ? 'bg-emerald-500' :
                        user.health_status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></span>
                      {statusToChinese(user.health_status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{user.phone_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.age}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      查看詳情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && <UserDetailsModal user={selectedUser} />}
    </div>
  );
};

// 5. Health View
const HealthView = ({ users, records }: { users: User[], records: HealthRecord[] }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const elderUsers = users.filter(u => u.role === UserRole.Elder);
  
  // Helper to get latest record for a user
  const getLatestVitals = (userId: string) => {
    const userRecords = records.filter(r => r.user_id === userId);
    const bp = userRecords.find(r => r.type === 'bloodPressure');
    const gluc = userRecords.find(r => r.type === 'glucose');
    return { bp, gluc };
  };

  // STRICT THRESHOLDS for displaying status
  const getIndicatorStatus = (record?: HealthRecord) => {
    if (!record) return 'normal';
    
    if (record.type === 'bloodPressure') {
      if ((record.systolic && record.systolic >= 160) || (record.diastolic && record.diastolic >= 100)) return 'critical';
      if ((record.systolic && record.systolic >= 140) || (record.diastolic && record.diastolic >= 90)) return 'warning';
    }
    
    if (record.type === 'glucose') {
      if (record.glucose && record.glucose >= 10.0) return 'critical';
      if (record.glucose && record.glucose >= 7.0) return 'warning';
    }

    // Fallback if available, otherwise normal
    return record.status || 'normal';
  };

  const statusToChinese = (status?: string) => {
    if (!status || status === 'normal') return '正常';
    if (status === 'warning') return '注意';
    if (status === 'critical') return '危急';
    return status;
  };

  // Get history records for the selected user (Last 7 Days)
  const historyRecords = useMemo(() => {
    if (!selectedUserId) return [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return records.filter(r => 
      r.user_id === selectedUserId && 
      new Date(r.recorded_at) >= sevenDaysAgo
    ).sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
  }, [selectedUserId, records]);

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">健康監測</h2>
        <p className="text-gray-500">所有病患的即時健康指標。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elderUsers.map(user => {
          const { bp, gluc } = getLatestVitals(user.id);
          
          // Determine specific status based on values
          const bpStatus = getIndicatorStatus(bp);
          const glucStatus = getIndicatorStatus(gluc);

          const isCriticalBp = bpStatus === 'critical';
          const isWarningBp = bpStatus === 'warning';
          const isCriticalGluc = glucStatus === 'critical';
          const isWarningGluc = glucStatus === 'warning';
          
          // Determine overall status based on vitals priority (Critical > Warning > Normal)
          // IF ANY is Critical => Overall is Critical
          let overallStatus = 'normal';
          
          if (isCriticalBp || isCriticalGluc) {
            overallStatus = 'critical';
          } else if (isWarningBp || isWarningGluc) {
            overallStatus = 'warning';
          } else {
            overallStatus = 'normal';
          }

          const name = user.name.replace(' (長者)', '');
          
          return (
            <div key={user.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all hover:shadow-lg ${
              overallStatus === 'critical' ? 'border-red-200 shadow-red-50' : 'border-gray-100'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${user.avatar_color}`}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{name}</h3>
                    <p className="text-xs text-gray-500">{user.age} 歲 • {user.gender === 'male' ? '男' : '女'}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  overallStatus === 'critical' ? 'bg-red-100 text-red-600 animate-pulse' : 
                  overallStatus === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {statusToChinese(overallStatus)}
                </div>
              </div>

              <div className="space-y-4">
                {/* Blood Pressure Card */}
                <div className={`p-3 rounded-xl border transition-colors ${
                  isCriticalBp ? 'bg-red-50 border-red-100 text-red-900' : 
                  isWarningBp ? 'bg-orange-50 border-orange-100 text-orange-900' : 
                  'bg-emerald-50 border-emerald-100 text-emerald-900'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium uppercase ${
                      isCriticalBp ? 'text-red-600' : isWarningBp ? 'text-orange-600' : 'text-emerald-600'
                    }`}>血壓</span>
                    <HeartPulse className={`w-4 h-4 ${
                       isCriticalBp ? 'text-red-400' : isWarningBp ? 'text-orange-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">{bp?.systolic || '--'}</span>
                    <span className={`text-sm mb-1 ${
                       isCriticalBp ? 'text-red-600' : isWarningBp ? 'text-orange-600' : 'text-emerald-600'
                    }`}>/ {bp?.diastolic || '--'} mmHg</span>
                  </div>
                  <div className={`mt-1 text-xs ${
                     isCriticalBp ? 'text-red-500' : isWarningBp ? 'text-orange-500' : 'text-emerald-500'
                  }`}>脈搏: {bp?.pulse || '--'} bpm</div>
                </div>

                {/* Glucose Card */}
                <div className={`p-3 rounded-xl border transition-colors ${
                   isCriticalGluc ? 'bg-red-50 border-red-100 text-red-900' : 
                   isWarningGluc ? 'bg-orange-50 border-orange-100 text-orange-900' : 
                   'bg-emerald-50 border-emerald-100 text-emerald-900'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium uppercase ${
                       isCriticalGluc ? 'text-red-600' : isWarningGluc ? 'text-orange-600' : 'text-emerald-600'
                    }`}>血糖</span>
                    <Activity className={`w-4 h-4 ${
                       isCriticalGluc ? 'text-red-400' : isWarningGluc ? 'text-orange-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">{gluc?.glucose || '--'}</span>
                    <span className={`text-sm mb-1 ${
                       isCriticalGluc ? 'text-red-600' : isWarningGluc ? 'text-orange-600' : 'text-emerald-600'
                    }`}>mmol/L</span>
                  </div>
                  <div className={`mt-1 text-xs ${
                     isCriticalGluc ? 'text-red-500' : isWarningGluc ? 'text-orange-500' : 'text-emerald-500'
                  }`}>狀態: {statusToChinese(glucStatus)}</div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedUserId(user.id)}
                className="w-full mt-6 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                查看詳細歷史
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed History Modal */}
      {selectedUserId && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  {selectedUser.name.replace(' (長者)', '')} - 近7天健康記錄
                </h3>
                <p className="text-xs text-gray-500 mt-1">顯示最近一週的血壓與血糖測量結果</p>
              </div>
              <button onClick={() => setSelectedUserId(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">時間</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">類型</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">數值</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {historyRecords.map((record) => {
                    const status = getIndicatorStatus(record);
                    return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(record.recorded_at).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.type === 'bloodPressure' ? '血壓' : '血糖'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-mono">
                        {record.type === 'bloodPressure' ? `${record.systolic}/${record.diastolic} mmHg` : `${record.glucose} mmol/L`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === 'normal' ? 'bg-emerald-100 text-emerald-800' :
                          status === 'warning' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {statusToChinese(status)}
                        </span>
                      </td>
                    </tr>
                  )})}
                  {historyRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                        過去7天內無記錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button 
                onClick={() => setSelectedUserId(null)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Medications View
const MedicationsView = ({ 
  medications, 
  intakes, 
  users, 
  onAddMedication, 
  onEditMedication, 
  onDeleteMedication 
}: { 
  medications: Medication[], 
  intakes: MedicationIntake[], 
  users: User[], 
  onAddMedication: (med: Medication) => void,
  onEditMedication: (med: Medication) => void,
  onDeleteMedication: (id: string) => void
}) => {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'closed'>('closed');
  const [currentMedId, setCurrentMedId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medToDelete, setMedToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    dosage: '',
    frequency: '',
    nextIntake: ''
  });

  // Helper to convert localized time string (e.g. "下午 02:00") to 24h format (14:00) for input
  const convertTo24Hour = (timeStr: string) => {
    if (!timeStr) return '';
    // Check if already 24h format just in case
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

    const [period, time] = timeStr.split(' ');
    if (!time) return timeStr; // fallback
    
    let [hours, minutes] = time.split(':').map(Number);
    
    if ((period === '下午' || period === '晚上') && hours !== 12) {
      hours += 12;
    }
    if ((period === '上午') && hours === 12) {
      hours = 0;
    }
    // "中午 12:00" -> hours is 12, correct.
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const openAddModal = () => {
    setFormData({ userId: '', name: '', dosage: '', frequency: '', nextIntake: '' });
    setModalMode('add');
    setCurrentMedId(null);
  };

  const openEditModal = (med: Medication) => {
    setFormData({
      userId: med.user_id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      nextIntake: convertTo24Hour(med.next_intake)
    });
    setCurrentMedId(med.id);
    setModalMode('edit');
  };

  const openDeleteModal = (id: string) => {
    setMedToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleRemind = (name: string) => {
    const el = document.createElement('div');
    el.className = "fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-in flex items-center gap-2";
    el.innerHTML = `<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> 已發送提醒給 ${name}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.name || !formData.dosage || !formData.frequency || !formData.nextIntake) {
      alert('請填寫所有欄位');
      return;
    }

    // Convert time from 24h to AM/PM format roughly for display
    const [hours, minutes] = formData.nextIntake.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? '下午' : '上午';
    const formattedTime = `${ampm} ${h > 12 ? h - 12 : h}:${minutes}`;

    if (modalMode === 'add') {
      const newMed: Medication = {
        id: `med-${Date.now()}`,
        user_id: formData.userId,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        next_intake: formattedTime,
        is_active: true
      };
      onAddMedication(newMed);
    } else if (modalMode === 'edit' && currentMedId) {
      const updatedMed: Medication = {
        id: currentMedId,
        user_id: formData.userId,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        next_intake: formattedTime,
        is_active: true
      };
      onEditMedication(updatedMed);
    }

    setModalMode('closed');
    setFormData({ userId: '', name: '', dosage: '', frequency: '', nextIntake: '' });
    setCurrentMedId(null);
  };

  const confirmDelete = () => {
    if (medToDelete) {
      onDeleteMedication(medToDelete);
      setIsDeleteModalOpen(false);
      setMedToDelete(null);
    }
  };

  const elderUsers = users.filter(u => u.role === UserRole.Elder);

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-gray-800">用藥管理</h2>
        <p className="text-gray-500">追蹤用藥依從性並管理處方。</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">目前處方</h3>
          <button 
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-indigo-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> 新增藥品
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">用戶</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">藥品</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">劑量</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">頻率</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">下次服用</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medications.map((med, idx) => {
                const user = users.find(u => u.id === med.user_id);
                // Remove " (長者)" suffix for the medication view
                const userName = user ? user.name.replace(' (長者)', '') : '未知用戶';

                return (
                  <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                       <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user?.avatar_color || 'bg-gray-200'}`}>
                          {userName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{userName}</span>
                      </div>
                    </td> 
                    <td className="px-6 py-4 text-indigo-600 font-medium">{med.name}</td>
                    <td className="px-6 py-4 text-gray-600">{med.dosage}</td>
                    <td className="px-6 py-4 text-gray-600">{med.frequency}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-gray-600">
                         <Clock className="w-4 h-4 text-gray-400" />
                         {med.next_intake}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleRemind(userName)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          發送提醒
                        </button>
                        <button 
                          onClick={() => openEditModal(med)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="編輯"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(med.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Medication Modal */}
      {modalMode !== 'closed' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{modalMode === 'add' ? '新增藥品處方' : '編輯藥品處方'}</h3>
              <button onClick={() => setModalMode('closed')} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">選擇用戶</label>
                <select 
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  disabled={modalMode === 'edit'} // Can't change user when editing
                >
                  <option value="">請選擇...</option>
                  {elderUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name.replace(' (長者)', '')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">藥品名稱</label>
                <select 
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={(e) => {
                     const selected = MEDICATIONS.find(m => m.name === e.target.value);
                     setFormData({
                       ...formData, 
                       name: e.target.value,
                       dosage: selected ? selected.dosage : formData.dosage // Auto-fill dosage if available
                     });
                  }}
                >
                  <option value="">從藥品庫選擇...</option>
                  {MEDICATIONS.map((med, i) => (
                    <option key={i} value={med.name}>{med.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">劑量</label>
                  <input 
                    type="text"
                    required
                    placeholder="例如: 10mg"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">頻率</label>
                  <select 
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  >
                    <option value="">請選擇...</option>
                    {MED_FREQUENCIES.map((freq, i) => (
                      <option key={i} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">下次服用時間</label>
                <input 
                  type="time"
                  required
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.nextIntake}
                  onChange={(e) => setFormData({...formData, nextIntake: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setModalMode('closed')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  {modalMode === 'add' ? '確認新增' : '儲存變更'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">確認刪除</h3>
              <p className="text-gray-500 text-sm mb-6">您確定要刪除此用藥處方嗎？此動作無法復原。</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 7. Profile View
const ProfileView = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative h-48 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 p-6 flex items-end translate-y-1/2 ml-4">
           <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
             <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold border-4 border-white">O</div>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Oscar</h2>
            <p className="text-gray-500 font-medium">系統管理員</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">健康管理部</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active</span>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-6 text-left space-y-3">
              <div className="flex items-center text-gray-600 gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">oscar@healthguard.com</span>
              </div>
              <div className="flex items-center text-gray-600 gap-3">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">0912-345-678</span>
              </div>
              <div className="flex items-center text-gray-600 gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm">台北市信義區</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Editable Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-800">個人資料</h3>
               <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">編輯資料</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">全名</label>
                 <input type="text" value="Oscar" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">職稱</label>
                 <input type="text" value="資深健康管理師" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                 <input type="email" value="oscar@healthguard.com" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電話</label>
                 <input type="text" value="0912-345-678" readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700" />
               </div>
             </div>
             <div className="mt-6">
               <label className="block text-sm font-medium text-gray-700 mb-1">個人簡介</label>
               <textarea rows={4} readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700" value="負責管理智康健平台的日常運作，監控老年患者的健康數據異常，並確保照護者與患者之間的溝通順暢。" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Settings View
const SettingsView = () => {
  return (
     <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">設定</h2>
        <p className="text-gray-500">管理您的帳號偏好與系統設定。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <nav className="space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg">
              <UserCircle className="w-4 h-4 mr-3"/> 帳號安全
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Bell className="w-4 h-4 mr-3"/> 通知設定
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Shield className="w-4 h-4 mr-3"/> 隱私權
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Globe className="w-4 h-4 mr-3"/> 系統偏好
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Security */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" /> 登入與安全
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                <div>
                  <p className="font-medium text-gray-800">更改密碼</p>
                  <p className="text-sm text-gray-500">上次更改於 3 個月前</p>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">更新</button>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-50">
                <div>
                  <p className="font-medium text-gray-800">雙重驗證 (2FA)</p>
                  <p className="text-sm text-gray-500">為您的帳戶增加一層額外的安全保護</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"/>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" /> 通知偏好
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-gray-700">接收每日健康摘要郵件</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-gray-700">緊急警報即時推送</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-gray-700">新用戶註冊通知</span>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
               </div>
            </div>
          </div>

          {/* System */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-gray-500" /> 外觀與語言
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">介面語言</label>
                 <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                   <option>繁體中文 (台灣)</option>
                   <option>English (US)</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">主題模式</label>
                 <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                   <option>系統預設</option>
                   <option>淺色模式</option>
                   <option>深色模式</option>
                 </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. Main App Component
const publicAssetCache: Record<string, string> = {};
const getPublicAsset = (filename: string) => {
  if (!publicAssetCache[filename]) {
    publicAssetCache[filename] = new URL(`./public/${filename}`, import.meta.url).href;
  }
  return publicAssetCache[filename];
};

const App = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  // Mock Notifications
  const mockNotifications = [
    { id: 1, type: 'critical', message: '李秀 的血壓異常 (180/110)', time: '2 分鐘前', read: false },
    { id: 2, type: 'warning', message: '張偉 錯過了服藥時間', time: '1 小時前', read: false },
    { id: 3, type: 'info', message: '新用戶 黃小明 已註冊', time: '3 小時前', read: true },
    { id: 4, type: 'info', message: '系統維護將於今晚進行', time: '5 小時前', read: true },
  ];

  useEffect(() => {
    const d = generateData();
    const s = getDashboardStats();
    setData(d);
    setStats(s);
  }, []);

  // Callback to add medication to state
  const handleAddMedication = (newMed: Medication) => {
    setData((prevData: any) => ({
      ...prevData,
      medications: [newMed, ...prevData.medications]
    }));
  };

  // Callback to edit medication
  const handleEditMedication = (updatedMed: Medication) => {
    setData((prevData: any) => ({
      ...prevData,
      medications: prevData.medications.map((med: Medication) => 
        med.id === updatedMed.id ? updatedMed : med
      )
    }));
  };

  // Callback to delete medication
  const handleDeleteMedication = (id: string) => {
    setData((prevData: any) => ({
      ...prevData,
      medications: prevData.medications.filter((med: Medication) => med.id !== id)
    }));
  };

  if (!data || !stats) return <div className="flex items-center justify-center h-screen text-indigo-600">正在載入智康健...</div>;

  // Helper to translate active tab for display
  const getTabName = (tab: string) => {
    switch(tab) {
      case 'dashboard': return '儀表板';
      case 'users': return '用戶管理';
      case 'health': return '健康監測';
      case 'medications': return '用藥管理';
      case 'profile': return '個人檔案';
      case 'settings': return '設定';
      default: return tab;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 font-bold text-gray-800">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">智</div>
             智康健
          </div>
          <button onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </header>

        {/* Desktop Header area (Search & Profile) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="text-xl font-bold text-gray-800 capitalize">
            {getTabName(activeTab)}
          </div>
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full transition-colors relative ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-sm">通知中心</h3>
                    <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800">全部已讀</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                        <div className="flex gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            notif.type === 'critical' ? 'bg-red-500' : 
                            notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-50 text-center">
                    <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">查看所有通知</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Section with Interaction */}
            <div className="relative ml-4 border-l border-gray-200 pl-4">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-700">Oscar</p>
                    <p className="text-xs text-gray-500">管理員</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm hover:shadow-md transition-shadow">
                    O
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-90' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-800">Oscar</p>
                      <p className="text-xs text-gray-500 truncate">oscar@healthguard.com</p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setActiveTab('profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-left flex items-center gap-3 transition-colors"
                      >
                        <UserCircle className="w-4 h-4" /> 個人檔案
                      </button>
                       <button 
                        onClick={() => {
                          setActiveTab('settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-left flex items-center gap-3 transition-colors"
                       >
                        <Settings className="w-4 h-4" /> 設定
                      </button>
                    </div>
                    <div className="border-t border-gray-50 py-1">
                      <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-3 transition-colors">
                        <LogOut className="w-4 h-4" /> 登出
                      </button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'features' && <FeatureHighlightsView />}
            {activeTab === 'contact' && <ContactView />}
            {activeTab === 'dashboard' && <DashboardView stats={stats} records={data.healthRecords} />}
            {activeTab === 'users' && <UsersView users={data.users} records={data.healthRecords} />}
            {activeTab === 'health' && <HealthView users={data.users} records={data.healthRecords} />}
            {activeTab === 'medications' && 
              <MedicationsView 
                medications={data.medications} 
                intakes={data.intakes} 
                users={data.users} 
                onAddMedication={handleAddMedication} 
                onEditMedication={handleEditMedication}
                onDeleteMedication={handleDeleteMedication}
              />
            }
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
