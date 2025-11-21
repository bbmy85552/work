// 模擬使用者健康資料 - 更真實的數據
const usersData = [
    {
        id: 1,
        name: "陳志明",
        age: 68,
        gender: "男",
        phone: "0912-886-532",
        latestBloodPressure: { systolic: 142, diastolic: 88 },
        latestBloodSugar: 118,
        healthStatus: "注意",
        bloodPressureHistory: [
            { date: "2024-11-01", systolic: 138, diastolic: 85 },
            { date: "2024-11-05", systolic: 140, diastolic: 86 },
            { date: "2024-11-09", systolic: 135, diastolic: 83 },
            { date: "2024-11-13", systolic: 143, diastolic: 87 },
            { date: "2024-11-17", systolic: 145, diastolic: 89 },
            { date: "2024-11-21", systolic: 142, diastolic: 88 }
        ],
        bloodSugarHistory: [
            { date: "2024-11-01", level: 112 },
            { date: "2024-11-05", level: 115 },
            { date: "2024-11-09", level: 108 },
            { date: "2024-11-13", level: 120 },
            { date: "2024-11-17", level: 116 },
            { date: "2024-11-21", level: 118 }
        ]
    },
    {
        id: 2,
        name: "林美惠",
        age: 62,
        gender: "女",
        phone: "0923-775-419",
        latestBloodPressure: { systolic: 158, diastolic: 96 },
        latestBloodSugar: 168,
        healthStatus: "警示",
        bloodPressureHistory: [
            { date: "2024-11-01", systolic: 152, diastolic: 92 },
            { date: "2024-11-05", systolic: 155, diastolic: 94 },
            { date: "2024-11-09", systolic: 160, diastolic: 98 },
            { date: "2024-11-13", systolic: 156, diastolic: 95 },
            { date: "2024-11-17", systolic: 162, diastolic: 99 },
            { date: "2024-11-21", systolic: 158, diastolic: 96 }
        ],
        bloodSugarHistory: [
            { date: "2024-11-01", level: 155 },
            { date: "2024-11-05", level: 162 },
            { date: "2024-11-09", level: 170 },
            { date: "2024-11-13", level: 165 },
            { date: "2024-11-17", level: 172 },
            { date: "2024-11-21", level: 168 }
        ]
    },
    {
        id: 3,
        name: "張偉強",
        age: 55,
        gender: "男",
        phone: "0934-662-887",
        latestBloodPressure: { systolic: 125, diastolic: 78 },
        latestBloodSugar: 92,
        healthStatus: "正常",
        bloodPressureHistory: [
            { date: "2024-11-01", systolic: 122, diastolic: 76 },
            { date: "2024-11-05", systolic: 124, diastolic: 77 },
            { date: "2024-11-09", systolic: 120, diastolic: 75 },
            { date: "2024-11-13", systolic: 126, diastolic: 79 },
            { date: "2024-11-17", systolic: 128, diastolic: 80 },
            { date: "2024-11-21", systolic: 125, diastolic: 78 }
        ],
        bloodSugarHistory: [
            { date: "2024-11-01", level: 88 },
            { date: "2024-11-05", level: 90 },
            { date: "2024-11-09", level: 85 },
            { date: "2024-11-13", level: 93 },
            { date: "2024-11-17", level: 95 },
            { date: "2024-11-21", level: 92 }
        ]
    },
    {
        id: 4,
        name: "王雅婷",
        age: 48,
        gender: "女",
        phone: "0945-334-221",
        latestBloodPressure: { systolic: 132, diastolic: 84 },
        latestBloodSugar: 105,
        healthStatus: "注意",
        bloodPressureHistory: [
            { date: "2024-11-01", systolic: 128, diastolic: 82 },
            { date: "2024-11-05", systolic: 130, diastolic: 83 },
            { date: "2024-11-09", systolic: 135, diastolic: 85 },
            { date: "2024-11-13", systolic: 129, diastolic: 81 },
            { date: "2024-11-17", systolic: 133, diastolic: 84 },
            { date: "2024-11-21", systolic: 132, diastolic: 84 }
        ],
        bloodSugarHistory: [
            { date: "2024-11-01", level: 98 },
            { date: "2024-11-05", level: 102 },
            { date: "2024-11-09", level: 106 },
            { date: "2024-11-13", level: 100 },
            { date: "2024-11-17", level: 108 },
            { date: "2024-11-21", level: 105 }
        ]
    },
    {
        id: 5,
        name: "李宗翰",
        age: 71,
        gender: "男",
        phone: "0987-991-445",
        latestBloodPressure: { systolic: 148, diastolic: 91 },
        latestBloodSugar: 145,
        healthStatus: "警示",
        bloodPressureHistory: [
            { date: "2024-11-01", systolic: 145, diastolic: 89 },
            { date: "2024-11-05", systolic: 150, diastolic: 92 },
            { date: "2024-11-09", systolic: 147, diastolic: 90 },
            { date: "2024-11-13", systolic: 152, diastolic: 94 },
            { date: "2024-11-17", systolic: 149, diastolic: 91 },
            { date: "2024-11-21", systolic: 148, diastolic: 91 }
        ],
        bloodSugarHistory: [
            { date: "2024-11-01", level: 138 },
            { date: "2024-11-05", level: 142 },
            { date: "2024-11-09", level: 148 },
            { date: "2024-11-13", level: 150 },
            { date: "2024-11-17", level: 143 },
            { date: "2024-11-21", level: 145 }
        ]
    },
    {
        id: 6,
        name: "陳靜怡",
        age: 39,
        gender: "女",
        phone: "0916-228-773",
        latestBloodPressure: { systolic: 115, diastolic: 72 },
        latestBloodSugar: 82,
        healthStatus: "正常",
        bloodPressureHistory: [
            { date: "2024-11-01", systolic: 112, diastolic: 70 },
            { date: "2024-11-05", systolic: 118, diastolic: 74 },
            { date: "2024-11-09", systolic: 114, diastolic: 71 },
            { date: "2024-11-13", systolic: 116, diastolic: 73 },
            { date: "2024-11-17", systolic: 113, diastolic: 71 },
            { date: "2024-11-21", systolic: 115, diastolic: 72 }
        ],
        bloodSugarHistory: [
            { date: "2024-11-01", level: 78 },
            { date: "2024-11-05", level: 84 },
            { date: "2024-11-09", level: 80 },
            { date: "2024-11-13", level: 83 },
            { date: "2024-11-17", level: 81 },
            { date: "2024-11-21", level: 82 }
        ]
    }
];

let currentUser = null;
let bpChart = null;
let bsChart = null;

// 初始化頁面
document.addEventListener('DOMContentLoaded', function() {
    renderUsersList();
});

// 渲染使用者列表
function renderUsersList() {
    const usersGrid = document.getElementById('usersGrid');
    usersGrid.innerHTML = '';

    usersData.forEach(user => {
        const userCard = createUserCard(user);
        usersGrid.appendChild(userCard);
    });
}

// 建立使用者卡片
function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.onclick = () => showUserDetails(user);

    let statusClass = 'status-normal';
    if (user.healthStatus === '注意') statusClass = 'status-warning';
    if (user.healthStatus === '警示') statusClass = 'status-danger';

    card.innerHTML = `
        <h3>${user.name}</h3>
        <div class="user-info">
            <div class="info-row">
                <span class="info-label">年齡：</span>
                <span class="info-value">${user.age}歲</span>
            </div>
            <div class="info-row">
                <span class="info-label">性別：</span>
                <span class="info-value">${user.gender}</span>
            </div>
            <div class="info-row">
                <span class="info-label">電話：</span>
                <span class="info-value">${user.phone}</span>
            </div>
            <div class="info-row">
                <span class="info-label">血壓：</span>
                <span class="info-value">${user.latestBloodPressure.systolic}/${user.latestBloodPressure.diastolic}</span>
            </div>
            <div class="info-row">
                <span class="info-label">血糖：</span>
                <span class="info-value">${user.latestBloodSugar} mg/dL</span>
            </div>
        </div>
        <div class="health-status ${statusClass}">
            健康狀態：${user.healthStatus}
        </div>
    `;

    return card;
}

// 顯示使用者詳情
function showUserDetails(user) {
    currentUser = user;
    document.getElementById('userName').textContent = `${user.name} - 健康詳情`;
    document.getElementById('detailsPanel').style.display = 'block';

    // 滾動到詳情面板
    document.getElementById('detailsPanel').scrollIntoView({ behavior: 'smooth' });

    // 建立圖表
    createBloodPressureChart(user);
    createBloodSugarChart(user);

    // 生成智能分析
    generateHealthAnalysis(user);
}

// 建立血壓圖表
function createBloodPressureChart(user) {
    const ctx = document.getElementById('bloodPressureChart').getContext('2d');

    // 銷毀之前的圖表
    if (bpChart) {
        bpChart.destroy();
    }

    const dates = user.bloodPressureHistory.map(item => item.date);
    const systolic = user.bloodPressureHistory.map(item => item.systolic);
    const diastolic = user.bloodPressureHistory.map(item => item.diastolic);

    bpChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: '收縮壓',
                    data: systolic,
                    borderColor: '#ff6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.4
                },
                {
                    label: '舒張壓',
                    data: diastolic,
                    borderColor: '#36a2eb',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '血壓變化趨勢'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 180
                }
            }
        }
    });
}

// 建立血糖圖表
function createBloodSugarChart(user) {
    const ctx = document.getElementById('bloodSugarChart').getContext('2d');

    // 銷毀之前的圖表
    if (bsChart) {
        bsChart.destroy();
    }

    const dates = user.bloodSugarHistory.map(item => item.date);
    const levels = user.bloodSugarHistory.map(item => item.level);

    bsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '血糖值',
                data: levels,
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '血糖變化趨勢'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 70,
                    max: 200
                }
            }
        }
    });
}

// 生成健康分析
function generateHealthAnalysis(user) {
    const analysisContent = document.getElementById('analysisContent');

    const analyses = [];

    // 血壓分析
    const latestBP = user.latestBloodPressure;
    let bpAnalysis = '';
    let bpClass = '';

    if (latestBP.systolic > 140 || latestBP.diastolic > 90) {
        bpAnalysis = '血壓偏高，建議就醫諮詢並調整生活習慣。減少鹽分攝取，規律運動有助於控制血壓。';
        bpClass = 'danger';
    } else if (latestBP.systolic > 130 || latestBP.diastolic > 85) {
        bpAnalysis = '血壓處於正常高值，建議注意飲食和運動，定期監測血壓變化。';
        bpClass = 'warning';
    } else {
        bpAnalysis = '血壓正常，請繼續保持健康的生活方式。';
        bpClass = 'success';
    }

    // 血糖分析
    const latestBS = user.latestBloodSugar;
    let bsAnalysis = '';
    let bsClass = '';

    if (latestBS > 140) {
        bsAnalysis = '血糖偏高，建議控制碳水化合物攝取，增加運動量，必要時請就醫檢查。';
        bsClass = 'danger';
    } else if (latestBS > 100) {
        bsAnalysis = '血糖略高，建議注意飲食控制，避免高糖食物，保持規律運動。';
        bsClass = 'warning';
    } else {
        bsAnalysis = '血糖正常，請維持良好的飲食和運動習慣。';
        bsClass = 'success';
    }

    // 趨勢分析
    const trendAnalysis = analyzeTrends(user);

    analyses.push(`
        <div class="analysis-item ${bpClass}">
            <h4>🩺 血壓狀況</h4>
            <p>${bpAnalysis}</p>
        </div>
    `);

    analyses.push(`
        <div class="analysis-item ${bsClass}">
            <h4>🩸 血糖狀況</h4>
            <p>${bsAnalysis}</p>
        </div>
    `);

    analyses.push(`
        <div class="analysis-item">
            <h4>📈 趨勢分析</h4>
            <p>${trendAnalysis}</p>
        </div>
    `);

    // 建議
    analyses.push(`
        <div class="analysis-item">
            <h4>💡 健康建議</h4>
            <p>${getHealthRecommendations(user)}</p>
        </div>
    `);

    analysisContent.innerHTML = analyses.join('');
}

// 分析趨勢
function analyzeTrends(user) {
    const bpHistory = user.bloodPressureHistory;
    const bsHistory = user.bloodSugarHistory;

    // 計算血壓趨勢
    const recentBP = bpHistory.slice(-3);
    const olderBP = bpHistory.slice(0, 3);

    const avgRecentSystolic = recentBP.reduce((sum, item) => sum + item.systolic, 0) / recentBP.length;
    const avgOlderSystolic = olderBP.reduce((sum, item) => sum + item.systolic, 0) / olderBP.length;

    const bpTrend = avgRecentSystolic > avgOlderSystolic ? '上升' : '穩定或下降';

    // 計算血糖趨勢
    const recentBS = bsHistory.slice(-3);
    const olderBS = bsHistory.slice(0, 3);

    const avgRecentBS = recentBS.reduce((sum, item) => sum + item.level, 0) / recentBS.length;
    const avgOlderBS = olderBS.reduce((sum, item) => sum + item.level, 0) / olderBS.length;

    const bsTrend = avgRecentBS > avgOlderBS ? '上升' : '穩定或下降';

    return `近期血壓趨勢呈${bpTrend}，血糖趨勢呈${bsTrend}。${bpTrend === '上升' || bsTrend === '上升' ? '建議加強監測並諮詢醫師。' : '整體狀況良好，請繼續保持。'}`;
}

// 獲取健康建議
function getHealthRecommendations(user) {
    let recommendations = [];

    if (user.age > 60) {
        recommendations.push('定期健康檢查');
        recommendations.push('適度運動如散步、太極拳');
    }

    if (user.latestBloodPressure.systolic > 130 || user.latestBloodPressure.diastolic > 85) {
        recommendations.push('減少鹽分攝取');
        recommendations.push('每天運動30分鐘');
    }

    if (user.latestBloodSugar > 100) {
        recommendations.push('控制碳水化合物');
        recommendations.push('避免含糖飲料');
    }

    if (recommendations.length === 0) {
        recommendations.push('保持健康生活方式');
        recommendations.push('定期運動');
    }

    return recommendations.join('、') + '。';
}

// 關閉詳情面板
function closeDetails() {
    document.getElementById('detailsPanel').style.display = 'none';
    currentUser = null;

    // 銷毀圖表
    if (bpChart) {
        bpChart.destroy();
        bpChart = null;
    }
    if (bsChart) {
        bsChart.destroy();
        bsChart = null;
    }
}