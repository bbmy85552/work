
import { User, UserRole, Gender, HealthRecord, HealthIndicatorType, MedicationIntake, DashboardStats, Medication } from '../types';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(1));
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const SURNAMES = ["張", "李", "王", "趙", "劉", "陳", "楊", "黃", "周", "吳", "徐", "孫", "胡", "朱", "高", "林", "何", "郭", "馬", "羅"];
const MALE_NAMES = ["偉", "強", "磊", "洋", "勇", "軍", "杰", "濤", "超", "明", "剛", "平", "輝", "志明", "建國", "俊傑", "志強", "文豪"];
const FEMALE_NAMES = ["芳", "秀", "靜", "麗", "敏", "燕", "艷", "娟", "蘭", "雲", "萍", "玲", "秀英", "麗華", "美玉", "雅婷", "淑芬", "惠敏"];

export const MEDICATIONS = [
  { name: "氨氯地平 (Amlodipine)", dosage: "5mg" },
  { name: "二甲雙胍 (Metformin)", dosage: "500mg" },
  { name: "阿托伐他汀 (Atorvastatin)", dosage: "10mg" },
  { name: "賴諾普利 (Lisinopril)", dosage: "10mg" },
  { name: "奧美拉唑 (Omeprazole)", dosage: "20mg" },
  { name: "氯沙坦 (Losartan)", dosage: "50mg" }
];

export const MED_FREQUENCIES = ["每日一次", "每日兩次", "每週三次", "睡前服用", "飯後服用", "早晚各一次"];
const NEXT_INTAKE_TIMES = ["上午 08:00", "上午 09:30", "中午 12:00", "下午 02:00", "下午 06:30", "晚上 09:00"];

const AVATAR_COLORS = [
  "bg-red-100 text-red-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-yellow-100 text-yellow-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
];

let cachedUsers: User[] = [];
let cachedHealthRecords: HealthRecord[] = [];
let cachedIntakes: MedicationIntake[] = [];
let cachedMedications: Medication[] = [];

const generateName = (gender: Gender) => {
  const surname = randomItem(SURNAMES);
  const givenName = gender === Gender.Male ? randomItem(MALE_NAMES) : randomItem(FEMALE_NAMES);
  return surname + givenName;
};

// Generate fixed historical data for each user
const generateUserHealthHistory = (userId: string, userName: string) => {
  const history: HealthRecord[] = [];
  const today = new Date();

  // Different health patterns for different users
  let bpPattern, glucosePattern;

  switch(userId) {
    case "u-1": // 李秀英 - Warning status, moderately elevated BP
      bpPattern = Array.from({length: 30}, (_, i) => ({
        systolic: 135 + Math.random() * 15,
        diastolic: 85 + Math.random() * 10,
        pulse: 72 + Math.random() * 8
      }));
      glucosePattern = Array.from({length: 30}, (_, i) => 5.8 + Math.random() * 1.2);
      break;
    case "u-2": // 張偉強 - Critical status, severely elevated BP and glucose
      bpPattern = Array.from({length: 30}, (_, i) => ({
        systolic: 160 + Math.random() * 25,
        diastolic: 95 + Math.random() * 15,
        pulse: 80 + Math.random() * 15
      }));
      glucosePattern = Array.from({length: 30}, (_, i) => 8.5 + Math.random() * 2.5);
      break;
    case "u-3": // 陳美麗 - Normal status
      bpPattern = Array.from({length: 30}, (_, i) => ({
        systolic: 110 + Math.random() * 20,
        diastolic: 70 + Math.random() * 15,
        pulse: 65 + Math.random() * 10
      }));
      glucosePattern = Array.from({length: 30}, (_, i) => 4.5 + Math.random() * 1.5);
      break;
    case "u-4": // 黃志明 - Warning status, elevated glucose
      bpPattern = Array.from({length: 30}, (_, i) => ({
        systolic: 125 + Math.random() * 20,
        diastolic: 78 + Math.random() * 12,
        pulse: 70 + Math.random() * 12
      }));
      glucosePattern = Array.from({length: 30}, (_, i) => 7.2 + Math.random() * 1.8);
      break;
    default:
      bpPattern = Array.from({length: 30}, (_, i) => ({
        systolic: 120 + Math.random() * 20,
        diastolic: 75 + Math.random() * 15,
        pulse: 70 + Math.random() * 10
      }));
      glucosePattern = Array.from({length: 30}, (_, i) => 5.0 + Math.random() * 2.0);
  }

  // Generate daily records for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate blood pressure record
    const bpDate = new Date(date);
    bpDate.setHours(8 + Math.floor(Math.random() * 3), Math.random() * 60);
    const bpData = bpPattern[i];
    const bpStatus = (bpData.systolic >= 140 || bpData.diastolic >= 90) ?
      (bpData.systolic >= 160 || bpData.diastolic >= 100 ? 'critical' : 'warning') : 'normal';

    history.push({
      id: `hr-${userId}-${i}-bp`,
      user_id: userId,
      user_name: userName,
      type: HealthIndicatorType.BloodPressure,
      recorded_at: bpDate.toISOString(),
      systolic: Math.round(bpData.systolic),
      diastolic: Math.round(bpData.diastolic),
      pulse: Math.round(bpData.pulse),
      status: bpStatus
    });

    // Generate glucose record
    const gluDate = new Date(date);
    gluDate.setHours(19 + Math.floor(Math.random() * 2), Math.random() * 60);
    const gluData = glucosePattern[i];
    const gluStatus = gluData >= 7.0 ? (gluData >= 10.0 ? 'critical' : 'warning') : 'normal';

    history.push({
      id: `hr-${userId}-${i}-glu`,
      user_id: userId,
      user_name: userName,
      type: HealthIndicatorType.Glucose,
      recorded_at: gluDate.toISOString(),
      glucose: parseFloat(gluData.toFixed(1)),
      status: gluStatus
    });
  }

  return history;
};

// Generate AI health analysis for each user
const generateHealthAnalysis = (userId: string) => {
  const analyses = {
    "u-1": {
      summary: "李秀英的健康狀況整體穩定但需要注意。血壓略高，血糖處於正常高值。服藥依從性良好，生活規律。",
      concerns: [
        "血壓持續偏高，需要加強監測",
        "鹽分攝入應適當控制",
        "建議增加有氧運動"
      ],
      recommendations: [
        "每天測量血壓並記錄",
        "保持低鹽飲食",
        "每週運動至少3次，每次30分鐘",
        "定期複診並調整用藥"
      ]
    },
    "u-2": {
      summary: "張偉強的健康狀況需要立即關注。血壓和血糖都處於危險高值，需要密切監測和及時醫療介入。",
      concerns: [
        "血壓嚴重超标，有心血管疾病風險",
        "血糖控制不佳，可能導致併發症",
        "需要立即醫療評估"
      ],
      recommendations: [
        "立即聯繫主治醫師進行評估",
        "每日監測血壓和血糖2-3次",
        "嚴格遵守用藥時間",
        "避免高鹽高糖食物",
        "家屬需要密切協助監測"
      ]
    },
    "u-3": {
      summary: "陳美麗的健康狀況良好。血壓和血糖都在正常範圍內，生活規律，服藥依從性佳。",
      concerns: [
        "年齡較高，需繼續維持健康狀態",
        "注意預防跌倒和意外"
      ],
      recommendations: [
        "保持目前的生活習慣",
        "定期健康檢查",
        "適度運動保持體能",
        "維持社交活動"
      ]
    },
    "u-4": {
      summary: "黃志明的健康狀況基本穩定，但血糖控制需要改善。血壓在正常範圍內波動。",
      concerns: [
        "血糖略高，需要飲食控制",
        "體重管理需要加強"
      ],
      recommendations: [
        "控制碳水化合物攝入",
        "增加纖維類食物",
        "規律運動有助血糖控制",
        "每3個月檢測糖化血色素"
      ]
    }
  };

  return analyses[userId] || {
    summary: "健康狀況穩定，持續監測中。",
    concerns: ["定期健康檢查"],
    recommendations: ["保持健康生活方式"]
  };
};

export const generateData = () => {
  // Always regenerate data for now to ensure we have the correct users and health records
  // if (cachedUsers.length > 0) return { users: cachedUsers, healthRecords: cachedHealthRecords, intakes: cachedIntakes, medications: cachedMedifications };

  // 1. Users - Generate fewer users with specific profiles
  cachedUsers = [
    {
      id: "u-1",
      name: "李秀英 (長者)",
      gender: Gender.Female,
      phone_number: "0912-345-678",
      role: UserRole.Elder,
      age: 72,
      health_status: 'warning',
      joined_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      avatar_color: "bg-blue-100 text-blue-600",
    } as User,
    {
      id: "u-2",
      name: "張偉強 (長者)",
      gender: Gender.Male,
      phone_number: "0923-456-789",
      role: UserRole.Elder,
      age: 68,
      health_status: 'critical',
      joined_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      avatar_color: "bg-red-100 text-red-600",
    } as User,
    {
      id: "u-3",
      name: "陳美麗 (長者)",
      gender: Gender.Female,
      phone_number: "0934-567-890",
      role: UserRole.Elder,
      age: 75,
      health_status: 'normal',
      joined_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      avatar_color: "bg-green-100 text-green-600",
    } as User,
    {
      id: "u-4",
      name: "黃志明 (長者)",
      gender: Gender.Male,
      phone_number: "0945-678-901",
      role: UserRole.Elder,
      age: 80,
      health_status: 'warning',
      joined_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      avatar_color: "bg-purple-100 text-purple-600",
    } as User,
    {
      id: "u-5",
      name: "王慧玲",
      gender: Gender.Female,
      phone_number: "0956-789-012",
      role: UserRole.Caregiver,
      age: 35,
      health_status: 'normal',
      joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      avatar_color: "bg-pink-100 text-pink-600",
    } as User,
  ];

  // 2. Health Records - Use fixed historical data
  cachedHealthRecords = [];
  cachedUsers.filter(u => u.role === UserRole.Elder).forEach(user => {
    const userHistory = generateUserHealthHistory(user.id, user.name);
    cachedHealthRecords.push(...userHistory);
  });
  // Sort by date descending
  cachedHealthRecords.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());

  // 3. Medications & Intakes
  cachedMedications = [];
  cachedIntakes = [];
  cachedUsers.filter(u => u.role === UserRole.Elder).forEach(user => {
    const numMeds = randomInt(1, 4);
    for(let i=0; i<numMeds; i++) {
      const medInfo = randomItem(MEDICATIONS);
      const medId = `med-${user.id}-${i}`;
      
      cachedMedications.push({
        id: medId,
        user_id: user.id,
        name: medInfo.name,
        dosage: medInfo.dosage,
        frequency: randomItem(MED_FREQUENCIES),
        next_intake: randomItem(NEXT_INTAKE_TIMES),
        is_active: true
      });

      // Intakes
      for(let d=0; d<3; d++) {
        cachedIntakes.push({
          id: `intake-${medId}-${d}`,
          user_id: user.id,
          user_name: user.name,
          medication_name: medInfo.name,
          intake_date: new Date(Date.now() - d * 86400000).toISOString().split('T')[0],
          intake_time: "08:00:00",
          status: d === 0 ? randomItem(['taken', 'pending']) : randomItem(['taken', 'taken', 'missed'])
        });
      }
    }
  });

  return { users: cachedUsers, healthRecords: cachedHealthRecords, intakes: cachedIntakes, medications: cachedMedications };
};

// Export the health analysis function for use in components
export const getHealthAnalysis = (userId: string) => {
  return generateHealthAnalysis(userId);
};

// Get historical health data for a specific user
export const getUserHealthHistory = (userId: string, days: number = 30) => {
  try {
    const data = generateData();
    if (!data || !data.healthRecords) {
      console.error('No health records found in generated data');
      return [];
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const userRecords = data.healthRecords.filter(r =>
      r.user_id === userId &&
      new Date(r.recorded_at) >= cutoffDate
    );

    console.log(`Found ${userRecords.length} records for user ${userId}`);

    return userRecords.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
  } catch (error) {
    console.error('Error getting user health history:', error);
    return [];
  }
};

export const getDashboardStats = (): DashboardStats => {
  const { users, healthRecords, intakes } = generateData();
  const today = new Date().toDateString();

  const alerts = healthRecords.filter(r => r.status !== 'normal' && new Date(r.recorded_at).toDateString() === today).length;
  const taken = intakes.filter(i => i.status === 'taken').length;
  const total = intakes.length;

  return {
    totalUsers: users.length,
    activeAlerts: alerts,
    medicationCompliance: Math.round((taken / total) * 100) || 0,
    newUsersToday: randomInt(0, 3)
  };
};
