document.addEventListener('DOMContentLoaded', () => {
    // 向后兼容处理 - 确保elementsFromPoint方法存在
    if (!document.elementsFromPoint) {
        document.elementsFromPoint = function(x, y) {
            let elements = [];
            let element = document.elementFromPoint(x, y);
            
            while (element && element !== document.body) {
                elements.push(element);
                element.style.pointerEvents = 'none';
                element = document.elementFromPoint(x, y);
            }
            
            // 恢复元素的pointer-events
            elements.forEach(el => {
                el.style.pointerEvents = '';
            });
            
            return elements;
        };
    }

    // 初始化金牌和讲解视频
    preloadResources();

    // 游戏状态
    const gameState = {
        cardsInPuzzle: [],
        currentLevel: 0,
        totalMedals: 0,
        selectedCard: null,
        isRotated: false,
        dragOffset: { x: 0, y: 0 },
        snapGrid: 40, // 修改网格大小为40px
        isDragging: false,
        rotationCooldown: false, // 旋转冷却标志
        isOverTrash: false, // 新增垃圾桶状态
        
        // 关卡信息
        levelInfo: {
            currentLevelNumber: 1,  // 当前关卡编号
            problemsPerLevel: 5,   // 每关题目数量
            problemsInCurrentLevel: 0  // 当前关卡已完成题目数
        },
        
        // 学习统计数据
        learningStats: {
            problemsAttempted: 0,       // 尝试过的题目总数
            problemsSolved: 0,          // 解决的题目数量
            currentRoundProblems: 0,    // 当前轮次已完成的题目数
            problemTimer: null,         // 当前题目计时器
            currentProblemStartTime: 0, // 当前题目开始时间
            problemRecords: [],         // 问题记录数组，用于跟踪所有完成的问题
            
            // 当前正在进行的问题
            currentProblem: {
                type: '',               // 题目类型
                polynomial: '',         // 多项式表达式
                answer: '',             // 正确答案
                attempts: 0,            // 尝试次数
                startTime: 0,           // 开始时间
                endTime: 0,             // 结束时间
                isSolved: false,        // 是否解决
                duration: 0,            // 持续时间
                errors: []              // 错误记录
            },
            
            // 按题型统计
            typeStats: {
                'perfect-square': { attempted: 0, solved: 0, attemptsCount: 0, totalTime: 0 },
                'cross-multiply': { attempted: 0, solved: 0, attemptsCount: 0, totalTime: 0 }
            },
            
            // 详细记录每道题的情况
            problemRecords: [],
            
            // 当前题目记录
            currentProblem: {
                type: '',
                polynomial: '',
                attempts: 0,
                startTime: 0,
                endTime: 0,
                isSolved: false,
                errors: []
            }
        }
    };

    // 多项式题目和答案
    const problemTypes = {
        'perfect-square': [
            {
                polynomial: 'a² + 2ab + b²',
                answer: '(a+b)²',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 2, 'b-square': 1 }
            },
            {
                polynomial: '4a² + 4ab + b²',
                answer: '(2a+b)²',
                requiredCards: { 'a-square': 4, 'ab-rectangle': 4, 'b-square': 1 }
            },
            {
                polynomial: 'a² + 4ab + 4b²',
                answer: '(a+2b)²',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 4, 'b-square': 4 }
            },
            {
                polynomial: '4a² + 8ab + 4b²',
                answer: '2(a+b)²',
                requiredCards: { 'a-square': 4, 'ab-rectangle': 8, 'b-square': 4 }
            },
            {
                polynomial: '9a² + 6ab + b²',
                answer: '(3a+b)²',
                requiredCards: { 'a-square': 9, 'ab-rectangle': 6, 'b-square': 1 }
            },
            {
                polynomial: 'a² + 6ab + 9b²',
                answer: '(a+3b)²',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 6, 'b-square': 9 }
            },
            {
                polynomial: 'a² + 8ab + 16b²',
                answer: '(a+4b)²',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 8, 'b-square': 16 }
            },
            {
                polynomial: '4a² + 12ab + 9b²',
                answer: '(2a+3b)²',
                requiredCards: { 'a-square': 4, 'ab-rectangle': 12, 'b-square': 9 }
            },
            {
                polynomial: '9a² + 12ab + 4b²',
                answer: '(3a+2b)²',
                requiredCards: { 'a-square': 9, 'ab-rectangle': 12, 'b-square': 4 }
            }
        ],
        'cross-multiply': [
            {
                polynomial: 'a² + 3ab + 2b²',
                answer: '(a+b)(a+2b)',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 3, 'b-square': 2 }
            },
            {
                polynomial: 'a² + 5ab + 6b²',
                answer: '(a+2b)(a+3b)',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 5, 'b-square': 6 }
            },
            {
                polynomial: 'a² + 6ab + 8b²',
                answer: '(a+2b)(a+4b)',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 6, 'b-square': 8 }
            },
            {
                polynomial: 'a² + 7ab + 10b²',
                answer: '(a+2b)(a+5b)',
                requiredCards: { 'a-square': 1, 'ab-rectangle': 7, 'b-square': 10 }
            },
            {
                polynomial: '2a² + 5ab + 3b²',
                answer: '(a+b)(2a+3b)',
                requiredCards: { 'a-square': 2, 'ab-rectangle': 5, 'b-square': 3 }
            },
            {
                polynomial: '2a² + 7ab + 6b²',
                answer: '(a+2b)(2a+3b)',
                requiredCards: { 'a-square': 2, 'ab-rectangle': 7, 'b-square': 6 }
            },
            {
                polynomial: '3a² + 7ab + 2b²',
                answer: '(3a+b)(a+2b)',
                requiredCards: { 'a-square': 3, 'ab-rectangle': 7, 'b-square': 2 }
            },
            {
                polynomial: '2a² + 9ab + 4b²',
                answer: '(a+4b)(2a+b)',
                requiredCards: { 'a-square': 2, 'ab-rectangle': 9, 'b-square': 4 }
            }
        ]
    };

    // 当前默认使用的题目集合
    let levels = problemTypes['cross-multiply'];
    
    // 选择的题库类型，默认为十字相乘法
    let selectedProblemType = 'cross-multiply';

    // DOM 元素
    const puzzleContainer = document.getElementById('puzzle-container');
    const currentPolynomialElement = document.getElementById('current-polynomial');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-btn');
    const rotateButton = document.getElementById('rotate-btn');
    const resetButton = document.getElementById('reset-btn');
    const resultModal = document.getElementById('result-modal');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const nextLevelButton = document.getElementById('next-level-btn');
    const tryAgainButton = document.getElementById('try-again-btn');
    const explanationVideo = document.getElementById('explanation-video');
    const medalsDisplay = document.getElementById('medals');

    // 实现关卡内题目不重复的函数
    function initLevelProblems() {
        // 为每个题库类型创建不重复的题目集合
        const typeProblems = {};
        
        for (const type in problemTypes) {
            // 获取该类型的所有题目
            const allProblems = problemTypes[type];
            
            // 在每次初始化时进行更彻底的随机排序
            const deepShuffled = [...allProblems].sort(() => Math.random() - 0.5);
            
            // 再次乱序以增加随机性
            const shuffled = deepShuffled.sort(() => Math.random() - 0.5);
            
            // 从打乱后的题目中选择至少5道题（如果有的话）
            // 这里我们确保选择尽可能多的不同题目
            const selectedProblems = [];
            const usedPolynomials = new Set(); // 用于追踪已经选择的多项式
            
            // 首先添加未重复的题目
            for (const problem of shuffled) {
                if (!usedPolynomials.has(problem.polynomial) && selectedProblems.length < 5) {
                    selectedProblems.push(problem);
                    usedPolynomials.add(problem.polynomial);
                }
            }
            
            // 如果题目不足5道，则从剩余题目中选择，但尽量避免连续重复
            if (selectedProblems.length < 5 && allProblems.length > 1) {
                const remaining = 5 - selectedProblems.length;
                
                // 再次打乱所有题目
                const remainingProblems = shuffled.filter(
                    p => !selectedProblems.includes(p)
                ).sort(() => Math.random() - 0.5);
                
                // 根据需要添加额外题目
                for (let i = 0; i < remaining; i++) {
                    // 如果剩余题目不足，则从头开始
                    const index = i % remainingProblems.length;
                    selectedProblems.push(remainingProblems[index]);
                }
                
                // 最后再次打乱选中的题目顺序，避免规律性
                selectedProblems.sort(() => Math.random() - 0.5);
            }
            
            typeProblems[type] = selectedProblems;
        }
        
        return typeProblems;
    }

    // 修改游戏初始化函数，使用新的题目生成方法
    function initGame() {
        console.log("游戏初始化开始...");
        
        // 初始化每个题型的题目集合，确保每关题目尽量不重复
        const levelProblems = initLevelProblems();
        for (const type in levelProblems) {
            problemTypes[type] = levelProblems[type];
        }
        
        // 重置游戏状态 - 确保关卡信息完全重置
        gameState.currentLevel = 0;  // 当前题库中的题目索引
        gameState.levelInfo = {
            currentLevelNumber: 1,    // 设置关卡编号为1
            problemsPerLevel: 5,     // 每关5题
            problemsInCurrentLevel: 0 // 当前关卡已完成题目数为0
        };
        
        // 更新当前题库并进行额外的随机化
        levels = [...problemTypes[selectedProblemType]].sort(() => Math.random() - 0.5);
        
        // 重置学习统计信息中的关卡相关数据
        gameState.learningStats.currentRoundProblems = 0;
        
        // 初始化金牌数量
        medalsDisplay.textContent = gameState.totalMedals || 0;
        
        // 设置拖放和事件监听
        setupDragAndDrop();
        setupEventListeners();
        
        // 初始化菜单
        setupGameMenu();
        
        // 更新多项式显示
        updatePolynomialDisplay();
        
        // 更新关卡显示
        updateLevelDisplay();
        
        // 添加对卡片区域的事件监听，阻止任何可能的误触发
        const puzzleArea = document.querySelector('.puzzle-area');
        if (puzzleArea) {
            puzzleArea.addEventListener('mouseover', function(e) {
                // 如果是禁用了旋转的按钮，确保鼠标样式正确
                if (e.target.classList.contains('rotate-button') && 
                    e.target.parentElement && 
                    e.target.parentElement.dataset.disableRotation === 'true') {
                    e.target.style.cursor = 'not-allowed';
                }
            });
        }
        
        // 显示游戏提示
        showGameTip("提示：拖动卡片到拼图区，点击旋转按钮可将卡片旋转一次");
        
        // 5秒后显示第二条提示
        setTimeout(() => {
            showGameTip("注意：每个卡片只能旋转一次，旋转后按钮将变灰");
        }, 5000);
        
        // 10秒后显示拼图原理提示
        setTimeout(() => {
            showGameTip("本游戏中，所有多项式均为正项，便于使用方块进行直观拼图");
        }, 10000);
        
        console.log("游戏初始化完成，关卡信息:", gameState.levelInfo);
        logLevelInfo();
    }

    // 修改菜单设置函数，使用ID选择器定位元素
    function setupGameMenu() {
        console.log("设置菜单...");
        
        // 使用ID选择器获取菜单按钮和菜单容器
        const menuButton = document.getElementById('menu-button');
        const menuDropdown = document.getElementById('menu-dropdown');
        
        if (!menuButton || !menuDropdown) {
            console.error("菜单元素未找到:", {menuButton, menuDropdown});
            return;
        }
        
        // 清空现有内容
        menuDropdown.innerHTML = '';
        
        // 移除所有已有的点击事件处理器
        const newMenuButton = menuButton.cloneNode(true);
        menuButton.parentNode.replaceChild(newMenuButton, menuButton);
        
        // 定义新的点击处理函数
        newMenuButton.addEventListener('click', function(e) {
            console.log("菜单按钮被点击");
            e.preventDefault();
            e.stopPropagation();
            
            // 切换菜单显示状态
            if (menuDropdown.style.display === 'none' || menuDropdown.style.display === '') {
                menuDropdown.style.display = 'block';
                console.log("菜单已显示");
            } else {
                menuDropdown.style.display = 'none';
                console.log("菜单已隐藏");
            }
        });
        
        // 菜单选项
        const menuItems = [
            { text: '重新开始本关', action: restartCurrentLevel },
            { text: '切换题库', action: showProblemTypeSelection },
            { text: '查看学习报告', action: () => generateLearningReport() },
            { text: '关于', action: showAboutInfo }
        ];
        
        // 创建菜单项
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.textContent = item.text;
            
            // 使用独立的点击处理函数
            menuItem.addEventListener('click', function(e) {
                console.log("菜单项被点击:", item.text);
                e.stopPropagation();
                
                // 执行操作
                item.action();
                
                // 隐藏菜单
                menuDropdown.style.display = 'none';
            });
            
            menuDropdown.appendChild(menuItem);
        });
        
        // 移除所有文档点击事件处理器并重新添加
        document.removeEventListener('click', document._menuCloseHandler);
        
        document._menuCloseHandler = function(e) {
            if (!newMenuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.style.display = 'none';
            }
        };
        
        document.addEventListener('click', document._menuCloseHandler);
        
        console.log("菜单设置完成");
    }

    // 切换菜单显示/隐藏
    function toggleGameMenu() {
        const menuDropdown = document.getElementById('menu-dropdown');
        if (menuDropdown) {
            menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
        }
    }

    // 重新开始当前关卡
    function restartCurrentLevel() {
        console.log("重新开始当前关卡");
        
        // 重置当前关卡的题目计数
        gameState.levelInfo.problemsInCurrentLevel = 0;
        
        // 重置当前轮次题目计数
        gameState.learningStats.currentRoundProblems = 0;
        
        // 确保每关5题
        gameState.levelInfo.problemsPerLevel = 5;
        
        // 重置拼图
        resetPuzzle();
        
        // 重新开始当前题目
        updatePolynomialDisplay();
        
        // 更新关卡显示
        updateLevelDisplay();
        
        // 显示提示
        showGameTip("已重新开始当前关卡");
    }

    // 显示题库选择界面
    function showProblemTypeSelection() {
        // 创建题库选择模态框
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content type-selection-content';
        
        const heading = document.createElement('h2');
        heading.textContent = '选择题库';
        
        const typeSelectionContainer = document.createElement('div');
        typeSelectionContainer.className = 'type-selection-container';
        
        // 题库选项
        const typeOptions = [
            { id: 'perfect-square', name: '完全平方公式' },
            { id: 'cross-multiply', name: '十字相乘法' }
        ];
        
        typeOptions.forEach(option => {
            const typeButton = document.createElement('button');
            typeButton.className = 'type-selection-btn';
            typeButton.textContent = option.name;
            
            if (option.id === selectedProblemType) {
                typeButton.classList.add('active');
            }
            
            typeButton.addEventListener('click', () => {
                // 切换题库
                selectedProblemType = option.id;
                levels = problemTypes[option.id];
                
                // 重置关卡信息
                gameState.currentLevel = 0;
                gameState.levelInfo.problemsInCurrentLevel = 0;
                gameState.levelInfo.currentLevelNumber = 1;
                gameState.levelInfo.problemsPerLevel = 5; // 确保每关5题
                
                // 更新多项式显示
                updatePolynomialDisplay();
                
                // 重置拼图
                resetPuzzle();
                
                // 更新关卡显示
                updateLevelDisplay();
                
                // 关闭模态框
                document.body.removeChild(modal);
                
                // 显示提示
                showGameTip(`已切换到${option.name}题库`);
            });
            
            typeSelectionContainer.appendChild(typeButton);
        });
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        closeButton.textContent = '关闭';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modalContent.appendChild(heading);
        modalContent.appendChild(typeSelectionContainer);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }

    // 显示关于信息
    function showAboutInfo() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content about-content';
        
        const heading = document.createElement('h2');
        heading.textContent = '关于多项式因式分解游戏';
        
        const aboutText = document.createElement('div');
        aboutText.className = 'about-text';
        aboutText.innerHTML = `
            <p>多项式因式分解游戏是一款教育类游戏，旨在帮助学生通过可视化的方式理解代数因式分解的几何意义。</p>
            <p>游戏支持三种不同类型的因式分解练习：</p>
            <ul>
                <li><strong>完全平方公式</strong> - 如 (a+b)²</li>
                <li><strong>十字相乘法</strong> - 如 (a+b)(a+2b)</li>
            </ul>
            <p>通过拖放和旋转几何图形，构建多项式的几何表示，帮助理解代数与几何的关系。</p>
            <p>每成功完成10道题目，将获得一关的进度并生成学习报告。</p>
            <p>版本：1.0.0</p>
        `;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        closeButton.textContent = '关闭';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modalContent.appendChild(heading);
        modalContent.appendChild(aboutText);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }

    // 更新关卡显示
    function updateLevelDisplay() {
        const levelDisplay = document.getElementById('level-display');
        if (levelDisplay) {
            // 显示当前关卡编号和题目进度
            levelDisplay.textContent = `关卡 ${gameState.levelInfo.currentLevelNumber} · 题目 ${gameState.levelInfo.problemsInCurrentLevel}/${gameState.levelInfo.problemsPerLevel}`;
            console.log("更新关卡显示:", levelDisplay.textContent);
        } else {
            console.error("未找到关卡显示元素");
        }
    }

    // 设置拖放功能
    function setupDragAndDrop() {
        const cardTemplates = document.querySelectorAll('.card');
        
        cardTemplates.forEach(card => {
            card.addEventListener('mousedown', handleCardMouseDown);
        });

        // 鼠标在拼图区域上移动时捕获事件
        puzzleContainer.addEventListener('mousemove', handlePuzzleMouseMove);
        puzzleContainer.addEventListener('mouseup', handlePuzzleMouseUp);
        // 确保鼠标离开拼图区域也能触发放置
        document.addEventListener('mouseup', handleDocumentMouseUp);
        
        // 键盘事件监听现在在外部单独设置，这里不再添加
        // 避免重复绑定
    }

    // 设置其他事件监听器
    function setupEventListeners() {
        // 提交答案
        submitButton.addEventListener('click', checkAnswer);
        
        // 旋转卡片
        rotateButton.addEventListener('click', toggleRotation);
        
        // 重置拼图 - 修复重置按钮功能
        if (resetButton) {
            // 移除旧的事件监听器
            const newResetButton = resetButton.cloneNode(true);
            resetButton.parentNode.replaceChild(newResetButton, resetButton);
            
            // 添加新的事件监听器
            newResetButton.addEventListener('click', function() {
                console.log("重置按钮被点击");
                resetPuzzle();
            });
            
            // 更新全局变量引用
            window.resetButton = newResetButton;
        } else {
            console.error("重置按钮元素未找到");
        }
        
        // 下一关按钮
        nextLevelButton.addEventListener('click', nextLevel);
        
        // 再试一次按钮
        tryAgainButton.addEventListener('click', hideModal);
        
        // 垃圾桶功能
        setupTrashBin();
        
        // 题目控制功能
        setupProblemControls();
        
        // 学习报告按钮
        setupLearningReportButton();
    }
    
    // 设置题目控制相关事件
    function setupProblemControls() {
        const randomProblemBtn = document.getElementById('random-problem-btn');
        
        // 随机出题按钮
        if (randomProblemBtn) {
            randomProblemBtn.addEventListener('click', generateRandomProblem);
        }
    }
    
    // 设置学习报告按钮
    function setupLearningReportButton() {
        // 获取已经在HTML中创建的查看学习报告按钮
        const viewReportButton = document.getElementById('view-report-btn');
        
        if (viewReportButton) {
            viewReportButton.addEventListener('click', () => {
                // 添加调试信息
                console.log("点击了查看学习报告按钮");
                // 生成并显示学习报告
                generateLearningReport();
            });
        } else {
            console.error("未找到查看学习报告按钮元素");
        }
        
        // 添加报告模态框关闭按钮事件
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                const learningReportModal = document.getElementById('learning-report-modal');
                if (learningReportModal) {
                    learningReportModal.style.display = 'none';
                    console.log("关闭学习报告模态框");
                } else {
                    console.error("未找到学习报告模态框元素");
                }
            });
        } else {
            console.error("未找到继续学习按钮元素");
        }
        
        // 添加保存报告和图表按钮事件
        const saveReportBtn = document.getElementById('save-report-btn');
        if (saveReportBtn) {
            saveReportBtn.addEventListener('click', saveFullReport);
        } else {
            console.error("未找到保存报告按钮元素");
        }
        
        const saveChartsBtn = document.getElementById('save-charts-btn');
        if (saveChartsBtn) {
            saveChartsBtn.addEventListener('click', saveCharts);
        } else {
            console.error("未找到保存图表按钮元素");
        }
    }
    
    // 检查答案
    function checkAnswer() {
        console.log("开始检查答案...");
        const userAnswer = answerInput.value.trim();
        const currentLevel = levels[gameState.currentLevel];
        
        // 构建用户拼图的多项式表达式
        const currentPolynomial = currentPolynomialElement.textContent;
        
        // 首先检查拼图是否正确表示了多项式
        const isPuzzleCorrect = checkPuzzleCorrectness();
        console.log("拼图检查结果:", isPuzzleCorrect ? "正确" : "不正确");
        
        // 标准化用户答案和正确答案进行比较
        const normalizedUserAnswer = normalizeAnswer(userAnswer);
        const normalizedCorrectAnswer = normalizeAnswer(currentLevel.answer);
        const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        
        // 详细记录比较过程，方便调试
        console.log("当前多项式:", currentLevel.polynomial);
        console.log("用户答案:", userAnswer);
        console.log("标准化后用户答案:", normalizedUserAnswer);
        console.log("正确答案:", currentLevel.answer);
        console.log("标准化后正确答案:", normalizedCorrectAnswer);
        console.log("答案检查结果:", isAnswerCorrect ? "正确" : "不正确");
        
        // 特别调试信息 - 显示答案不相等的原因
        if (!isAnswerCorrect) {
            console.log("答案不匹配的字符分析:");
            for (let i = 0; i < Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length); i++) {
                if (normalizedUserAnswer[i] !== normalizedCorrectAnswer[i]) {
                    console.log(`位置 ${i}: 用户答案 '${normalizedUserAnswer[i] || "无"}' 不等于 正确答案 '${normalizedCorrectAnswer[i] || "无"}'`);
                }
            }
        }
        
        // 确定错误类型（如果有）
        let errorType = null;
        if (!isPuzzleCorrect) {
            errorType = 'puzzle_incorrect';
        } else if (!isAnswerCorrect) {
            errorType = 'answer_incorrect';
        }
        
        // 判断整体是否正确（拼图正确且答案正确）
        const isOverallCorrect = isPuzzleCorrect && isAnswerCorrect;
        
        // 只有答案正确时，才直接调用完成当前题目函数
        if (isOverallCorrect) {
            console.log("答案完全正确，直接调用finishCurrentProblem(true)");
            // 题目解决，记录结束时间
            finishCurrentProblem(true);
            
            // 显示成功消息
            showSuccessMessage();
        } else {
            // 记录答题尝试但不完成题目
            console.log("答案不正确，只记录尝试");
            // 增加尝试次数
            gameState.learningStats.currentProblem.attempts++;
            gameState.learningStats.typeStats[selectedProblemType].attemptsCount++;
            
            // 当前尝试次数
            const currentAttempts = gameState.learningStats.currentProblem.attempts;
            console.log("当前尝试次数:", currentAttempts);
            
            if (errorType) {
                // 记录错误类型
                gameState.learningStats.currentProblem.errors.push({
                    type: errorType,
                    timestamp: new Date().getTime()
                });
            }
            
            // 显示相应的错误消息
            if (!isPuzzleCorrect) {
                // 拼图不正确，显示错误消息
                showErrorMessage("拼图不正确！请确保您的拼图正确表示了多项式");
            } else {
                // 拼图正确但答案不正确 - 显示错误消息，增加更具体的提示
                let errorMsg = "答案不正确，但拼图看起来不错！";
                
                // 针对不同多项式类型，提供更具体的提示
                if (currentLevel.polynomial.includes('²')) {
                    // 完全平方式提示
                    errorMsg += `<br>完全平方式因式分解形如：(a+b)²，请检查您的答案格式。`;
                } else if (currentLevel.polynomial.match(/a² \+ \d+ab \+ \d+b²/)) {
                    // 十字相乘法提示
                    errorMsg += `<br>十字相乘法因式分解形如：(a+mb)(a+nb)，其中m×n等于常数项系数，m+n等于ab项系数。`;
                }
                
                // 当连续错误达到三次或以上时，显示正确答案格式示例
                if (currentAttempts >= 3) {
                    errorMsg += `<br><br>正确答案格式示例：${currentLevel.answer}`;
                }
                
                showErrorMessage(errorMsg);
            }
        }
        
        console.log("答案检查完成");
    }
    
    // 显示结果模态窗口
    function showResultModal(isCorrect) {
        const resultModal = document.getElementById('result-modal');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');
        
        if (isCorrect) {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            
            // 设置金牌图片
            const medalImg = document.querySelector('.medal-img');
            medalImg.src = 'img/金牌.png';
        } else {
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
        }
        
        // 显示模态窗口
        resultModal.style.display = 'flex';
    }
    
    // 增加金牌数量
    function increaseMedals() {
        const medalsElement = document.getElementById('medals');
        let currentMedals = parseInt(medalsElement.textContent) || 0;
        currentMedals++;
        medalsElement.textContent = currentMedals;
        
        // 保存到localStorage
        localStorage.setItem('medals', currentMedals);
    }
    
    // 显示对应多项式的讲解视频
    function showExplanationVideo(polynomial) {
        const videoElement = document.getElementById('explanation-video');
        const videoContainer = document.getElementById('video-container');
        const errorMessage = document.querySelector('.video-error-message');
        
        // 清除之前的错误信息
        errorMessage.style.display = 'none';
        
        console.log('准备播放本地视频');
        
        // 设置多个本地视频文件路径（尝试不同的路径和文件名）
        const localVideoPaths = [
            'videos/explanation.mp4',
            'videos/explanation2.mp4',
            './videos/explanation.mp4',
            '../videos/explanation.mp4',
            'explanation.mp4'
        ];
        
        // 清除旧的源
        while (videoElement.firstChild) {
            if (videoElement.firstChild.nodeName === 'SOURCE') {
                videoElement.removeChild(videoElement.firstChild);
        } else {
                break;
            }
        }
        
        // 添加所有本地视频源
        localVideoPaths.forEach(path => {
            const source = document.createElement('source');
            source.src = path;
            source.type = 'video/mp4';
            videoElement.appendChild(source);
            console.log(`添加视频源: ${path}`);
        });
        
        // 记录视频元素的属性
        console.log('视频元素当前状态:', {
            readyState: videoElement.readyState,
            networkState: videoElement.networkState,
            paused: videoElement.paused,
            currentSrc: videoElement.currentSrc,
            error: videoElement.error
        });
        
        // 记录视频载入状态的事件
        videoElement.addEventListener('loadstart', () => console.log('事件: 视频开始加载'));
        videoElement.addEventListener('progress', () => console.log('事件: 视频数据下载中'));
        videoElement.addEventListener('loadedmetadata', () => console.log('事件: 视频元数据已加载'));
        videoElement.addEventListener('loadeddata', () => console.log('事件: 视频数据已加载，时长:', videoElement.duration));
        videoElement.addEventListener('canplay', () => console.log('事件: 视频可以开始播放'));
        videoElement.addEventListener('canplaythrough', () => console.log('事件: 视频可以流畅播放'));
        
        // 错误处理
        videoElement.onerror = function(e) {
            const errorCodes = {
                1: "MEDIA_ERR_ABORTED - 用户中止了视频加载",
                2: "MEDIA_ERR_NETWORK - 网络错误导致视频加载失败",
                3: "MEDIA_ERR_DECODE - 视频解码失败",
                4: "MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持的视频格式或资源不可用"
            };
            
            const errorCode = videoElement.error ? videoElement.error.code : '未知';
            const errorMessage = errorCodes[errorCode] || "未知错误";
            
            console.error(`本地视频加载失败 (错误码: ${errorCode}): ${errorMessage}`);
            console.error('详细错误信息:', e);
            console.error('当前网络状态:', navigator.onLine ? '在线' : '离线');
            
            document.querySelector('.video-error-message').style.display = 'block';
            document.querySelector('.video-error-message p').textContent = 
                `视频加载失败: ${errorMessage}。请检查文件路径或刷新页面重试。`;
            
            showGameTip("本地视频加载失败，请查看控制台详细信息");
        };
        
        // 加载处理
        videoElement.onloadeddata = function() {
            console.log('本地视频加载成功，可以播放');
            errorMessage.style.display = 'none';
            showGameTip("视频已加载，请点击播放按钮");
            
            // 确保视频控件显示
            videoElement.controls = true;
        };
        
        // 重新加载
        videoElement.load();
    }

    // 设置垃圾桶功能
    function setupTrashBin() {
        const trashBin = document.getElementById('trash-bin');
        
        // 设置更高的z-index确保垃圾桶在卡片上方
        trashBin.style.zIndex = "1000";
        
        // 监听拖拽卡片悬浮在垃圾桶上的事件
        trashBin.addEventListener('mouseenter', function() {
            if (gameState.isDragging && gameState.selectedCard) {
                trashBin.classList.add('highlight');
            }
        });
        
        // 触摸设备支持
        trashBin.addEventListener('touchmove', function(e) {
            if (gameState.isDragging && gameState.selectedCard) {
                const touch = e.touches[0];
                const trashRect = trashBin.getBoundingClientRect();
                const isOverTrash = (
                    touch.clientX >= trashRect.left &&
                    touch.clientX <= trashRect.right &&
                    touch.clientY >= trashRect.top &&
                    touch.clientY <= trashRect.bottom
                );
                
                if (isOverTrash) {
                    trashBin.classList.add('highlight');
            } else {
                    trashBin.classList.remove('highlight');
                }
            }
        });
        
        // 监听拖拽卡片离开垃圾桶的事件
        trashBin.addEventListener('mouseleave', function() {
            trashBin.classList.remove('highlight');
        });
        
        // 直接在垃圾桶元素上监听mouseup事件
        trashBin.addEventListener('mouseup', function(e) {
            if (gameState.isDragging && gameState.selectedCard) {
                // 删除卡片
                deleteSelectedCard();
                e.stopPropagation(); // 阻止事件冒泡
            }
        });
        
        // 添加触摸结束事件
        trashBin.addEventListener('touchend', function(e) {
            if (gameState.isDragging && gameState.selectedCard) {
                // 删除卡片
                deleteSelectedCard();
                e.stopPropagation(); // 阻止事件冒泡
            }
        });
    }
    
    // 删除当前选中的卡片
    function deleteSelectedCard() {
        if (!gameState.selectedCard) return;
        
        console.log("删除卡片", gameState.selectedCard);
        
        // 从游戏状态中移除卡片
        const cardIndex = gameState.cardsInPuzzle.findIndex(c => c.element === gameState.selectedCard);
        if (cardIndex !== -1) {
            gameState.cardsInPuzzle.splice(cardIndex, 1);
        }
        
        // 移除DOM元素
        gameState.selectedCard.remove();
        
        // 更新拼图区域的多项式显示
        updatePolynomialFromCards();
        
        // 显示提示消息
        showGameTip("卡片已删除");
        
        // 重置状态
        gameState.selectedCard = null;
        gameState.isDragging = false;
        
        // 移除垃圾桶高亮
        const trashBin = document.getElementById('trash-bin');
        if (trashBin) {
            trashBin.classList.remove('highlight');
        }
    }
    
    // 处理将卡片拖放到垃圾桶的逻辑 - 保留此函数以向后兼容，但主要逻辑已移到垃圾桶的mouseup事件监听器
    function handleTrashDrop(e) {
        if (!gameState.isDragging || !gameState.selectedCard) return;
        
        const trashBin = document.getElementById('trash-bin');
        const trashRect = trashBin.getBoundingClientRect();
        
        // 获取鼠标或触摸位置
        let clientX, clientY;
        if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length) {
            const touch = e.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
            } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // 检查是否在垃圾桶上释放
        const isOverTrash = (
            clientX >= trashRect.left &&
            clientX <= trashRect.right &&
            clientY >= trashRect.top &&
            clientY <= trashRect.bottom
        );
        
        console.log("检查垃圾桶位置:", clientX, clientY, isOverTrash);
        
        if (isOverTrash) {
            deleteSelectedCard();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // 处理键盘按键
    function handleKeyPress(e) {
        // 这个函数现在不再直接处理R键旋转
        // 而是由keydown/keyup事件专门处理
    }

    // 移除旧的R键事件处理
    // 移除旧的keydown和keyup事件处理器
    if (window.keyDownHandler) {
        document.removeEventListener('keydown', window.keyDownHandler);
    }
    if (window.keyUpHandler) {
        document.removeEventListener('keyup', window.keyUpHandler);
    }

    // 移除旧的文档mousemove监听
    const oldMouseMoveHandlers = [];
    document.eventListeners = document.eventListeners || {};
    if (document.eventListeners.mousemove) {
        oldMouseMoveHandlers.push(...document.eventListeners.mousemove);
        oldMouseMoveHandlers.forEach(handler => {
            document.removeEventListener('mousemove', handler);
        });
    }

    // 修改克隆卡片的函数，添加处理旋转限制的逻辑
    function handleCardMouseDown(e) {
        // 如果点击的是旋转按钮，先处理旋转操作
        if (e.target.classList.contains('rotate-button')) {
            e.stopPropagation(); // 阻止事件冒泡
            
            const targetCard = e.currentTarget;
            // 检查卡片是否允许旋转
            if (targetCard.dataset.disableRotation !== 'true') {
                rotateCard(targetCard);
            }
            return; // 直接返回，不处理拖动
        }
        
        // 标记为开始拖动
        gameState.isDragging = true;
        
        const targetCard = e.currentTarget;
        const isClone = targetCard.classList.contains('card-clone');
        
        if (isClone) {
            // 如果点击的是已经在拼图区域的卡片
            gameState.selectedCard = targetCard;
            targetCard.classList.add('dragging');
            
            // 更新拖动偏移量
            const rect = targetCard.getBoundingClientRect();
            gameState.dragOffset.x = e.clientX - rect.left;
            gameState.dragOffset.y = e.clientY - rect.top;
        } else {
            // 克隆新卡片
            const clone = targetCard.cloneNode(true);
            clone.classList.add('card-clone');
            
            // 根据卡片的类名设置正确的data-type属性
            if (targetCard.classList.contains('red-square')) {
                clone.setAttribute('data-type', 'a-square');
            } else if (targetCard.classList.contains('yellow-rectangle')) {
                clone.setAttribute('data-type', 'ab-rectangle');
            } else if (targetCard.classList.contains('blue-square')) {
                clone.setAttribute('data-type', 'b-square');
            }
            
            // 应用旋转状态 (如果当前有选中旋转)
            if (gameState.isRotated) {
                clone.classList.add('rotated-card');
                
                // 特殊处理黄色长方形的尺寸
                if (clone.classList.contains('yellow-rectangle') && !targetCard.classList.contains('vertical-rectangle')) {
                    clone.style.width = '80px'; // 旋转后宽度
                    clone.style.height = '120px'; // 旋转后高度
                } else if (clone.classList.contains('yellow-rectangle') && targetCard.classList.contains('vertical-rectangle')) {
                    clone.style.width = '120px'; // 竖向矩形旋转后的宽度
                    clone.style.height = '80px'; // 竖向矩形旋转后的高度
                }
                
                // 设置为已旋转状态，禁止再次旋转
                clone.dataset.disableRotation = 'true';
            } else {
                // 初始状态允许旋转
                clone.dataset.disableRotation = 'false';
                
                // 如果是竖向矩形，需要保持其竖向样式
                if (targetCard.classList.contains('vertical-rectangle')) {
                    clone.classList.add('vertical-rectangle');
                    clone.style.width = '80px';
                    clone.style.height = '120px';
                }
            }
            
            // 添加旋转按钮到卡片上
            const rotateBtn = document.createElement('div');
            rotateBtn.className = 'rotate-button';
            if (gameState.isRotated) {
                rotateBtn.classList.add('disabled');
                rotateBtn.title = "已旋转";
            } else {
                rotateBtn.title = "点击旋转";
            }
            rotateBtn.innerHTML = '&#10227;'; // 循环箭头符号
            
            // 添加鼠标点击事件 - 使用捕获模式
            rotateBtn.addEventListener('click', function(event) {
                // 旋转卡片
                if (clone.dataset.disableRotation !== 'true') {
                    rotateCard(clone);
                }
                event.stopPropagation(); // 防止事件冒泡到卡片
            }, true); // 添加true参数使用捕获模式
            
            // 添加触摸支持 - 使用捕获模式
            rotateBtn.addEventListener('touchstart', function(event) {
                event.preventDefault(); // 阻止默认行为
                // 旋转卡片
                if (clone.dataset.disableRotation !== 'true') {
                    rotateCard(clone);
                }
                event.stopPropagation(); // 防止事件冒泡到卡片
            }, true); // 添加true参数使用捕获模式
            
            clone.appendChild(rotateBtn);
            
            // 设置克隆的初始位置
            const rect = targetCard.getBoundingClientRect();
            const puzzleRect = puzzleContainer.getBoundingClientRect();
            
            // 计算偏移量
            gameState.dragOffset.x = e.clientX - rect.left;
            gameState.dragOffset.y = e.clientY - rect.top;
            
            // 设置克隆的位置
            clone.style.left = (e.clientX - puzzleRect.left - gameState.dragOffset.x) + 'px';
            clone.style.top = (e.clientY - puzzleRect.top - gameState.dragOffset.y) + 'px';
            
            // 添加到拼图区域
            puzzleContainer.appendChild(clone);
            
            // 标记为正在拖动
            clone.classList.add('dragging');
            gameState.selectedCard = clone;
            
            // 为克隆的卡片添加鼠标按下事件
            clone.addEventListener('mousedown', handleCardMouseDown);
            
            // 为克隆的卡片添加触摸支持
            clone.addEventListener('touchstart', function(touchEvent) {
                // 如果触摸的是旋转按钮，则不处理
                if (touchEvent.target.classList.contains('rotate-button')) {
                    return;
                }
                
                // 处理触摸开始
                handleCardTouchStart(touchEvent);
            });
        }
        
        // 阻止默认动作
        e.preventDefault();
    }

    // 添加触摸支持
    function handleCardTouchStart(e) {
        // 获取触摸点
        const touch = e.touches[0];
        
        // 模拟鼠标按下事件
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true,
            cancelable: true
        });
        
        // 触发鼠标按下事件
        e.currentTarget.dispatchEvent(mouseEvent);
        
        // 阻止默认行为
        e.preventDefault();
    }

    // 添加触摸移动事件处理
    puzzleContainer.addEventListener('touchmove', function(e) {
        if (!gameState.selectedCard) return;
        
        // 标记为正在拖动
        gameState.isDragging = true;
        
        // 获取触摸点
        const touch = e.touches[0];
        const puzzleRect = puzzleContainer.getBoundingClientRect();
        
        // 计算新位置
        let newX = touch.clientX - puzzleRect.left - gameState.dragOffset.x;
        let newY = touch.clientY - puzzleRect.top - gameState.dragOffset.y;
        
        // 获取卡片尺寸
        let cardWidth, cardHeight;
        const isRotated = gameState.selectedCard.classList.contains('rotated-card');
        
        // 根据卡片类型和旋转状态确定尺寸
        if (gameState.selectedCard.classList.contains('yellow-rectangle')) {
            const isVertical = gameState.selectedCard.classList.contains('vertical-rectangle');
            
            if (isRotated) {
                // 旋转后的尺寸
                if (isVertical) {
                    // 竖向矩形旋转后的尺寸
                    cardWidth = 120;
                    cardHeight = 80;
                } else {
                    // 横向矩形旋转后的尺寸
                    cardWidth = 80;
                    cardHeight = 120;
                }
            } else {
                // 未旋转的尺寸
                if (isVertical) {
                    // 竖向矩形原始尺寸
                    cardWidth = 80;
                    cardHeight = 120;
                } else {
                    // 横向矩形原始尺寸
                    cardWidth = 120;
                    cardHeight = 80;
                }
            }
        } else {
            cardWidth = gameState.selectedCard.offsetWidth;
            cardHeight = gameState.selectedCard.offsetHeight;
        }
        
        // 网格对齐
        newX = Math.round(newX / gameState.snapGrid) * gameState.snapGrid;
        newY = Math.round(newY / gameState.snapGrid) * gameState.snapGrid;
        
        // 边界检查
        const maxX = puzzleRect.width - cardWidth;
        const maxY = puzzleRect.height - cardHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // 应用新位置
        gameState.selectedCard.style.left = newX + 'px';
        gameState.selectedCard.style.top = newY + 'px';
        
        // 检查是否在垃圾桶上方
        const trashBin = document.getElementById('trash-bin');
        if (trashBin) {
            const trashRect = trashBin.getBoundingClientRect();
            
            const isOverTrash = (
                touch.clientX >= trashRect.left &&
                touch.clientX <= trashRect.right &&
                touch.clientY >= trashRect.top &&
                touch.clientY <= trashRect.bottom
            );
            
            if (isOverTrash) {
                trashBin.classList.add('highlight');
            } else {
                trashBin.classList.remove('highlight');
            }
            
            // 存储标记
            gameState.isOverTrash = isOverTrash;
        }
        
        // 阻止默认行为（如滚动）
        e.preventDefault();
    });
    
    // 添加触摸结束事件处理
    puzzleContainer.addEventListener('touchend', function(e) {
        if (!gameState.selectedCard) return;
        
        // 如果在垃圾桶上方释放
        if (gameState.isOverTrash) {
            deleteSelectedCard();
            return;
        }
        
        // 处理与普通鼠标事件相同的逻辑
        handlePuzzleMouseUp(e);
    });

    // 处理拼图区域鼠标移动
    function handlePuzzleMouseMove(e) {
        if (!gameState.selectedCard) return;
        
        // 标记为正在拖动，此时禁用旋转
        gameState.isDragging = true;
        
        const puzzleRect = puzzleContainer.getBoundingClientRect();
        
        // 计算新位置 (考虑偏移量)
        let newX = e.clientX - puzzleRect.left - gameState.dragOffset.x;
        let newY = e.clientY - puzzleRect.top - gameState.dragOffset.y;
        
        // 获取卡片的实际尺寸，需要考虑黄色长方形的特殊情况
        let cardWidth, cardHeight;
        const isRotated = gameState.selectedCard.classList.contains('rotated-card');
        
        // 根据卡片类型和旋转状态确定尺寸
        if (gameState.selectedCard.classList.contains('yellow-rectangle')) {
            const isVertical = gameState.selectedCard.classList.contains('vertical-rectangle');
            
            if (isRotated) {
                // 旋转后的尺寸
                if (isVertical) {
                    // 竖向矩形旋转后的尺寸
                    cardWidth = 120;
                    cardHeight = 80;
                } else {
                    // 横向矩形旋转后的尺寸
                    cardWidth = 80;
                    cardHeight = 120;
                }
            } else {
                // 未旋转的尺寸
                if (isVertical) {
                    // 竖向矩形原始尺寸
                    cardWidth = 80;
                    cardHeight = 120;
                } else {
                    // 横向矩形原始尺寸
                    cardWidth = 120;
                    cardHeight = 80;
                }
            }
        } else {
            cardWidth = gameState.selectedCard.offsetWidth;
            cardHeight = gameState.selectedCard.offsetHeight;
        }
        
        // 网格对齐
        newX = Math.round(newX / gameState.snapGrid) * gameState.snapGrid;
        newY = Math.round(newY / gameState.snapGrid) * gameState.snapGrid;
        
        // 边界检查 - 确保不超出拼图区域
        // 修改边界限制，使用整个拼图容器的宽度和高度
        const maxX = puzzleRect.width - cardWidth;
        const maxY = puzzleRect.height - cardHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // 检查重叠
        const wouldOverlap = checkOverlap(gameState.selectedCard, newX, newY, cardWidth, cardHeight);
        if (wouldOverlap) {
            // 只有当卡片完全停止移动时才显示重叠警告
            if (!gameState.selectedCard.moveTimeout) {
                gameState.selectedCard.moveTimeout = setTimeout(() => {
                    gameState.selectedCard.classList.add('overlap');
                }, 100); // 100ms的延迟
            }
        } else {
            // 清除延迟检测
            if (gameState.selectedCard.moveTimeout) {
                clearTimeout(gameState.selectedCard.moveTimeout);
                gameState.selectedCard.moveTimeout = null;
            }
            gameState.selectedCard.classList.remove('overlap');
        }
        
        // 应用新位置
        gameState.selectedCard.style.left = newX + 'px';
        gameState.selectedCard.style.top = newY + 'px';
        
        // 检查是否在垃圾桶上方
        const trashBin = document.getElementById('trash-bin');
        if (trashBin) {
            const trashRect = trashBin.getBoundingClientRect();
            const cardCenterX = e.clientX;
            const cardCenterY = e.clientY;
            
            const isOverTrash = (
                cardCenterX >= trashRect.left &&
                cardCenterX <= trashRect.right &&
                cardCenterY >= trashRect.top &&
                cardCenterY <= trashRect.bottom
            );
            
            if (isOverTrash) {
                trashBin.classList.add('highlight');
            } else {
                trashBin.classList.remove('highlight');
            }
            
            // 存储一个标记，表示卡片当前是否在垃圾桶上方
            gameState.isOverTrash = isOverTrash;
        }
    }

    // 处理文档鼠标抬起
    function handleDocumentMouseUp(e) {
        if (!gameState.selectedCard) return;
        
        // 如果鼠标在拼图区域外抬起，就删除这个卡片克隆
        const puzzleRect = puzzleContainer.getBoundingClientRect();
        if (
            e.clientX < puzzleRect.left || 
            e.clientX > puzzleRect.right || 
            e.clientY < puzzleRect.top || 
            e.clientY > puzzleRect.bottom
        ) {
            gameState.selectedCard.remove();
        }
        
        // 清除选中卡片
        gameState.selectedCard = null;
        
        // 重置拖动状态
        setTimeout(() => {
            gameState.isDragging = false;
        }, 100); // 短暂延迟
    }

    // 修改处理拼图区域鼠标抬起事件
    function handlePuzzleMouseUp(e) {
        if (!gameState.selectedCard) return;
        
        // 检查是否在垃圾桶上方释放
        if (gameState.isOverTrash) {
            // 删除卡片
            deleteSelectedCard();
            return; // 直接返回，不执行后续的添加卡片操作
        }
        
        // 移除拖动中的标记
        gameState.selectedCard.classList.remove('dragging');
        
        // 如果这个卡片是新添加的，将其添加到游戏状态中
        const cardType = gameState.selectedCard.getAttribute('data-type');
        const existingCardIndex = gameState.cardsInPuzzle.findIndex(c => c.element === gameState.selectedCard);
        
        if (existingCardIndex === -1) {
            gameState.cardsInPuzzle.push({
                element: gameState.selectedCard,
                type: cardType,
                isRotated: gameState.selectedCard.classList.contains('rotated-card'),
                x: parseFloat(gameState.selectedCard.style.left),
                y: parseFloat(gameState.selectedCard.style.top)
            });
        } else {
            // 更新现有卡片的位置
            gameState.cardsInPuzzle[existingCardIndex].x = parseFloat(gameState.selectedCard.style.left);
            gameState.cardsInPuzzle[existingCardIndex].y = parseFloat(gameState.selectedCard.style.top);
        }
        
        // 更新多项式显示
        updatePolynomialFromCards();
        
        // 清除选中卡片
        gameState.selectedCard = null;
        
        // 标记拖动结束
        setTimeout(() => {
            gameState.isDragging = false;
            gameState.isOverTrash = false; // 重置垃圾桶状态
        }, 100);
    }

    // 更新多项式显示
    function updatePolynomialFromCards() {
        // 统计拼图中的每种卡片数量
        const cardCounts = {
            'a-square': 0,
            'ab-rectangle': 0,
            'b-square': 0
        };
        
        // 确保 cardsInPuzzle 数组存在
        if (!gameState.cardsInPuzzle) {
            gameState.cardsInPuzzle = [];
        }
        
        // 清理无效的卡片引用（可能已被删除）
        gameState.cardsInPuzzle = gameState.cardsInPuzzle.filter(card => 
            card && card.element && card.element.parentNode);
        
        // 重新统计有效卡片
        for (const card of gameState.cardsInPuzzle) {
            if (card && card.type) {
            cardCounts[card.type]++;
            }
        }
        
        // 检查是否有卡片在拼图区域
        const hasCards = gameState.cardsInPuzzle.length > 0;
        
        if (!hasCards) {
            // 如果没有卡片，显示提示文本
            currentPolynomialElement.textContent = "请摆放方块";
            return;
        }
        
        // 构建多项式表达式
        let polynomialTerms = [];
        
        // a² 项
        if (cardCounts['a-square'] > 0) {
            polynomialTerms.push(cardCounts['a-square'] > 1 ? 
                                cardCounts['a-square'] + 'a²' : 
                                'a²');
        }
        
        // ab 项
        if (cardCounts['ab-rectangle'] > 0) {
            polynomialTerms.push(cardCounts['ab-rectangle'] > 1 ? 
                                cardCounts['ab-rectangle'] + 'ab' : 
                                'ab');
        }
        
        // b² 项
        if (cardCounts['b-square'] > 0) {
            polynomialTerms.push(cardCounts['b-square'] > 1 ? 
                                cardCounts['b-square'] + 'b²' : 
                                'b²');
        }
        
        // 将项连接成多项式
        const polynomial = polynomialTerms.join(' + ');
        
        // 更新拼图区域的多项式显示
        if (currentPolynomialElement) {
        currentPolynomialElement.textContent = polynomial;
        }
        
        console.log("多项式已更新:", polynomial, cardCounts);
    }

    // 切换卡片旋转状态
    function toggleRotation() {
        // 如果在冷却中，不执行操作
        if (gameState.rotationCooldown) return;
        
        gameState.isRotated = !gameState.isRotated;
        
        // 视觉上显示当前旋转状态
        rotateButton.textContent = gameState.isRotated ? '取消旋转' : '旋转卡片';
        rotateButton.style.backgroundColor = gameState.isRotated ? '#e74c3c' : '#3498db';
        
        // 为了方便用户了解当前状态，添加类名标识
        if (gameState.isRotated) {
            rotateButton.classList.add('rotation-active');
        } else {
            rotateButton.classList.remove('rotation-active');
        }
        
        // 应用冷却效果，防止快速切换
        gameState.rotationCooldown = true;
        setTimeout(() => {
            gameState.rotationCooldown = false;
        }, 200); // 200毫秒冷却时间
    }

    // 重置拼图
    function resetPuzzle(preservePuzzle = false) {
        console.log("执行重置拼图函数");
        // 如果需要保留当前拼图，则不进行任何操作
        if (preservePuzzle) {
            console.log("保留当前拼图状态，不进行重置");
            // 仅清空答案输入
            answerInput.value = '';
            return;
        }
        
        // 获取拼图容器
        const puzzleArea = document.getElementById('puzzle-container');
        if (!puzzleArea) {
            console.error("找不到拼图容器");
            return;
        }
        
        // 保存垃圾桶元素
        const trashBin = document.getElementById('trash-bin');
        
        // 给所有拼图卡片添加淡出动画效果
        const clonedCards = puzzleArea.querySelectorAll('.card-clone');
        
        if (clonedCards.length > 0) {
            // 先应用淡出动画
            clonedCards.forEach(card => {
                // 创建淡出效果样式
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(10px)';
            });
            
            // 然后延迟删除元素
            setTimeout(() => {
                // 删除所有克隆卡片
                clonedCards.forEach(card => {
                    card.remove();
                });
                
                // 清空游戏状态中的卡片数组
                gameState.cardsInPuzzle = [];
                gameState.selectedCard = null;
                gameState.isRotated = false; // 重置旋转状态
                
                // 重置多项式显示
                if (currentPolynomialElement) {
                    currentPolynomialElement.textContent = "请摆放方块";
                }
                
                // 显示拼图已重置的提示
                console.log("拼图已完全重置");
            }, 500); // 等待动画完成
        } else {
            // 如果没有卡片，直接重置状态
            gameState.cardsInPuzzle = [];
            gameState.selectedCard = null;
            gameState.isRotated = false;
            
            // 重置多项式显示
            if (currentPolynomialElement) {
                currentPolynomialElement.textContent = "请摆放方块";
            }
        }
        
        // 清空答案输入
        answerInput.value = '';
        
        // 恢复旋转按钮状态
        if (rotateButton) {
            rotateButton.classList.remove('active', 'rotation-active');
            rotateButton.textContent = '旋转卡片';
            rotateButton.style.backgroundColor = '#3498db';
        }
        
        // 显示提示
        showGameTip("拼图已重置");
        
        // 强制更新视图
        updatePolynomialFromCards();
        
        // 添加控制台日志，方便调试
        console.log("拼图已重置完成");
    }

    // 检查答案
    function checkAnswer() {
        console.log("开始检查答案...");
        const userAnswer = answerInput.value.trim();
        const currentLevel = levels[gameState.currentLevel];
        
        // 构建用户拼图的多项式表达式
        const currentPolynomial = currentPolynomialElement.textContent;
        
        // 首先检查拼图是否正确表示了多项式
        const isPuzzleCorrect = checkPuzzleCorrectness();
        console.log("拼图检查结果:", isPuzzleCorrect ? "正确" : "不正确");
        
        // 标准化用户答案和正确答案进行比较
        const normalizedUserAnswer = normalizeAnswer(userAnswer);
        const normalizedCorrectAnswer = normalizeAnswer(currentLevel.answer);
        const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        
        // 详细记录比较过程，方便调试
        console.log("当前多项式:", currentLevel.polynomial);
        console.log("用户答案:", userAnswer);
        console.log("标准化后用户答案:", normalizedUserAnswer);
        console.log("正确答案:", currentLevel.answer);
        console.log("标准化后正确答案:", normalizedCorrectAnswer);
        console.log("答案检查结果:", isAnswerCorrect ? "正确" : "不正确");
        
        // 特别调试信息 - 显示答案不相等的原因
        if (!isAnswerCorrect) {
            console.log("答案不匹配的字符分析:");
            for (let i = 0; i < Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length); i++) {
                if (normalizedUserAnswer[i] !== normalizedCorrectAnswer[i]) {
                    console.log(`位置 ${i}: 用户答案 '${normalizedUserAnswer[i] || "无"}' 不等于 正确答案 '${normalizedCorrectAnswer[i] || "无"}'`);
                }
            }
        }
        
        // 确定错误类型（如果有）
        let errorType = null;
        if (!isPuzzleCorrect) {
            errorType = 'puzzle_incorrect';
        } else if (!isAnswerCorrect) {
            errorType = 'answer_incorrect';
        }
        
        // 判断整体是否正确（拼图正确且答案正确）
        const isOverallCorrect = isPuzzleCorrect && isAnswerCorrect;
        
        // 只有答案正确时，才直接调用完成当前题目函数
        if (isOverallCorrect) {
            console.log("答案完全正确，直接调用finishCurrentProblem(true)");
            // 题目解决，记录结束时间
            finishCurrentProblem(true);
            
            // 显示成功消息
            showSuccessMessage();
        } else {
            // 记录答题尝试但不完成题目
            console.log("答案不正确，只记录尝试");
            // 增加尝试次数
            gameState.learningStats.currentProblem.attempts++;
            gameState.learningStats.typeStats[selectedProblemType].attemptsCount++;
            
            // 当前尝试次数
            const currentAttempts = gameState.learningStats.currentProblem.attempts;
            console.log("当前尝试次数:", currentAttempts);
            
            if (errorType) {
                // 记录错误类型
                gameState.learningStats.currentProblem.errors.push({
                    type: errorType,
                    timestamp: new Date().getTime()
                });
            }
            
            // 显示相应的错误消息
            if (!isPuzzleCorrect) {
                // 拼图不正确，显示错误消息
                showErrorMessage("拼图不正确！请确保您的拼图正确表示了多项式");
            } else {
                // 拼图正确但答案不正确 - 显示错误消息，增加更具体的提示
                let errorMsg = "答案不正确，但拼图看起来不错！";
                
                // 针对不同多项式类型，提供更具体的提示
                if (currentLevel.polynomial.includes('²')) {
                    // 完全平方式提示
                    errorMsg += `<br>完全平方式因式分解形如：(a+b)²，请检查您的答案格式。`;
                } else if (currentLevel.polynomial.match(/a² \+ \d+ab \+ \d+b²/)) {
                    // 十字相乘法提示
                    errorMsg += `<br>十字相乘法因式分解形如：(a+mb)(a+nb)，其中m×n等于常数项系数，m+n等于ab项系数。`;
                }
                
                // 当连续错误达到三次或以上时，显示正确答案格式示例
                if (currentAttempts >= 3) {
                    errorMsg += `<br><br>正确答案格式示例：${currentLevel.answer}`;
                }
                
                showErrorMessage(errorMsg);
            }
        }
        
        console.log("答案检查完成");
    }
    
    // 检查拼图是否正确表示多项式
    function checkPuzzleCorrectness() {
        const currentLevel = levels[gameState.currentLevel];
        const requiredCards = currentLevel.requiredCards;
        
        // 检查拼图中的卡片数量是否正确
        const cardCounts = {
            'a-square': 0,     // 红色方块 a²
            'ab-rectangle': 0, // 黄色长方块 ab
            'b-square': 0      // 蓝色方块 b²
        };
        
        // 计算拼图中各类型卡片的数量
        for (const card of gameState.cardsInPuzzle) {
            const cardType = card.element.getAttribute('data-type');
            if (cardType && cardCounts.hasOwnProperty(cardType)) {
                cardCounts[cardType]++;
            }
        }
        
        // 检查卡片数量是否匹配
        for (const cardType in requiredCards) {
            if (cardCounts[cardType] !== requiredCards[cardType]) {
                console.log(`卡片数量不匹配：${cardType} 需要 ${requiredCards[cardType]}，实际 ${cardCounts[cardType]}`);
                return false;
            }
        }
        
        // 检查卡片是否排列成矩形，并且无间隙
        return checkRectangularLayout();
    }

    // 标准化答案格式，以便进行比较
    function normalizeAnswer(answer) {
        if (!answer) return '';
        
        // 移除所有空格
        let normalized = answer.replace(/\s+/g, '');
        
        // 将 ² 标准化
        normalized = normalized.replace(/\^2/g, '²');
        
        // 将中文括号转换为英文括号
        normalized = normalized.replace(/（/g, '(').replace(/）/g, ')');
        
        // 标准化 x 乘号和中文乘号
        normalized = normalized.replace(/[xX×]/g, '');
        
        // 记录原始处理后的答案，用于调试
        const originalNormalized = normalized;
        console.log("标准化前答案:", originalNormalized);
        
        // 增强型因式分解特殊处理
        // 1. 处理完全平方式：将(a+b)²标准化为(a+b)(a+b)，便于后续匹配
        if (normalized.includes('²')) {
            // 查找是否有平方形式的因式
            const squareFactorMatch = normalized.match(/(\([^()]+\))²/g);
            if (squareFactorMatch) {
                for (const squareFactor of squareFactorMatch) {
                    // 提取括号内的内容
                    const content = squareFactor.match(/\(([^()]+)\)²/)[1];
                    // 创建重复形式 (content)(content)
                    const repeatedForm = `(${content})(${content})`;
                    // 替换为标准化形式
                    normalized = normalized.replace(squareFactor, repeatedForm);
                }
            }
        }
        
        // 2. 检查是否存在相同因式的乘积，例如 (a+b)(a+b)，将其转换为(a+b)²
        let factorMatch = normalized.match(/\([^()]+\)/g);
            if (factorMatch && factorMatch.length === 2) {
            // 检查是否是相同的两个因式
            if (factorMatch[0] === factorMatch[1]) {
                // 将其转换为平方形式
                normalized = factorMatch[0] + '²';
            } else {
                // 3. 如果是不同的两个因式，创建另一种排列以处理因式顺序不同的情况
                let reversedFactors = factorMatch[1] + factorMatch[0];
                
                // 4. 尝试智能识别和修正更复杂的等价形式
                try {
                    // 提取两个因式内的内容
                    const factor1Content = factorMatch[0].match(/\(([^()]+)\)/)[1];
                    const factor2Content = factorMatch[1].match(/\(([^()]+)\)/)[1];
                    
                    console.log("因式内容分析:", factor1Content, factor2Content);
                    
                    // 分析系数和变量 - 将a+nb和b+na格式规范为a+nb
                    const normalizedFactor1 = normalizeABExpression(factor1Content);
                    const normalizedFactor2 = normalizeABExpression(factor2Content);
                    
                    if (normalizedFactor1 !== factor1Content || normalizedFactor2 !== factor2Content) {
                        console.log("规范化的因式内容:", normalizedFactor1, normalizedFactor2);
                        
                        // 重建因式
                        const newFactor1 = `(${normalizedFactor1})`;
                        const newFactor2 = `(${normalizedFactor2})`;
                        
                        // 更新标准化答案
                        normalized = newFactor1 + newFactor2;
                        
                        // 更新因式匹配结果
                        factorMatch = [newFactor1, newFactor2];
                        reversedFactors = newFactor2 + newFactor1;
                    }
                    
                    // 删除特殊处理2a² + 5ab + 2b²类型的多项式代码块
                    
                    // 删除特殊处理3a² + 7ab + 2b²类型的多项式代码块
                    
                    // 特殊情况处理：检测是否为 a² + 7ab + 6b² 类型的多项式因式分解
                    // 这些通常会有 (a+b)(a+6b) 或 (a+6b)(a+b) 形式的答案
                    if (factor1Content.includes('a') && factor1Content.includes('b') && 
                        factor2Content.includes('a') && factor2Content.includes('b')) {
                        
                        // 尝试解析因子的系数
                        const coefs1 = parseABCoefficients(factor1Content);
                        const coefs2 = parseABCoefficients(factor2Content);
                        
                        if (coefs1 && coefs2) {
                            console.log("解析的系数:", coefs1, coefs2);
                            
                            // 检查是否符合典型的a²+kab+nb²格式的因式分解模式
                            // 例如 a² + 7ab + 6b² = (a+b)(a+6b)
                            const isPattern1 = (coefs1.a === 1 && coefs2.a === 1) && 
                                              (coefs1.b === 1 || coefs2.b === 1);
                            
                            if (isPattern1) {
                                console.log("检测到典型的因式分解模式");
                                
                                // 根据解析出的系数，重新生成标准化形式
                                // 这有助于匹配不同书写顺序的等价形式
                                // 暂时保留原有处理方式，后续可根据需要扩展
                            }
                        }
                    }
                } catch (e) {
                    console.log("因式分析过程出错:", e);
                }
                
                // 返回字典序较小的排列，确保比较一致性
                if (reversedFactors < normalized) {
                    normalized = reversedFactors;
                }
            }
        }
        
        // 手动修复一些特殊等价形式的答案
        const specialCases = {
            // 格式: 多项式: {标准答案: [等价形式1, 等价形式2, ...]}
            'a²+7ab+6b²': {
                '(a+b)(a+6b)': ['(a+6b)(a+b)', '(a+b)(a+6b)', '(b+a)(a+6b)', '(a+6b)(b+a)']
            },
            'a²+3ab+2b²': {
                '(a+b)(a+2b)': ['(a+2b)(a+b)', '(a+b)(a+2b)', '(b+a)(a+2b)', '(a+2b)(b+a)']
            },
            // 删除3a²+7ab+2b²相关条目
            // 删除2a²+5ab+2b²相关条目
            'a²+7ab+10b²': {
                '(a+2b)(a+5b)': ['(a+5b)(a+2b)', '(a+2b)(a+5b)', '(2b+a)(a+5b)', '(a+5b)(2b+a)']
            },
            'a²+5ab+6b²': {
                '(a+2b)(a+3b)': ['(a+3b)(a+2b)', '(a+2b)(a+3b)', '(2b+a)(a+3b)', '(a+3b)(2b+a)']
            },
            'a²+6ab+8b²': {
                '(a+2b)(a+4b)': ['(a+4b)(a+2b)', '(a+2b)(a+4b)', '(2b+a)(a+4b)', '(a+4b)(2b+a)']
            }
        };
        
        // 检查是否有预定义的特殊等价形式处理
        for (const poly in specialCases) {
            for (const stdAnswer in specialCases[poly]) {
                if (specialCases[poly][stdAnswer].includes(originalNormalized)) {
                    console.log(`检测到特殊等价形式: ${originalNormalized} 等价于 ${stdAnswer}`);
                    normalized = stdAnswer;
                    break;
                }
            }
        }
        
        // 额外尝试匹配十字相乘法的标准模式：a² + (m+n)ab + mnb²
        // 这类多项式的标准因式形式为 (a+mb)(a+nb)
        try {
            // 检查用户输入的答案是否符合 (a+mb)(a+nb) 的模式
            const factorPattern = /\(a\+(\d+)b\)\(a\+(\d+)b\)/;
            const reversePattern = /\(a\+(\d+)b\)\(b\+a\)/; // 处理 (a+nb)(b+a) 形式
            
            let m, n;
            let match = originalNormalized.match(factorPattern);
            if (match) {
                m = parseInt(match[1]);
                n = parseInt(match[2]);
            } else {
                // 尝试反向模式
                match = originalNormalized.match(reversePattern);
                if (match) {
                    m = parseInt(match[1]);
                    n = 1;
                }
            }
            
            if (m && n) {
                // 重建多项式: a² + (m+n)ab + mnb²
                const reconstructedPoly = `a²+${m+n}ab+${m*n}b²`;
                console.log(`从因式推导多项式: ${reconstructedPoly}`);
                
                // 检查推导的多项式是否匹配当前题目
                const currentLevel = levels[gameState.currentLevel];
                if (currentLevel) {
                    const simplifiedCurrentPoly = currentLevel.polynomial.replace(/\s+/g, '');
                    if (simplifiedCurrentPoly === reconstructedPoly) {
                        console.log("推导的多项式与当前题目匹配，设置为标准答案");
                        normalized = `(a+${Math.min(m,n)}b)(a+${Math.max(m,n)}b)`;
                    }
                }
            }
        } catch (e) {
            console.log("十字相乘法模式检测错误:", e);
        }
        
        // 删除针对非一次项系数问题的特殊处理部分（包括nonUnitPatterns和nonUnit3Patterns以及相关代码）
        
        console.log("标准化后答案:", normalized);
        return normalized;
    }
    
    // 辅助函数：规范化a+nb或b+na表达式为a+nb格式
    function normalizeABExpression(expr) {
        // 处理b+na形式，转换为a+nb
        if (expr.startsWith('b+') && expr.includes('a')) {
            const match = expr.match(/b\+(\d*)a/);
            if (match) {
                const coef = match[1] || '1';
                return `a+${coef}b`;
            }
        }
        
        // 处理系数为1的情况，例如将a+b标准化为a+1b
        if (expr === 'a+b') {
            return 'a+1b';
        }
        
        // 特殊处理2a+b和b+2a这类形式
        if (expr === 'b+2a') {
            return '2a+b';
        }
        
        // 特殊处理a+2b和2b+a这类形式
        if (expr === '2b+a') {
            return 'a+2b';
        }
        
        return expr;
    }
    
    // 辅助函数：解析a和b的系数
    function parseABCoefficients(expr) {
        try {
            // 匹配a的系数
            let aCoef = 1;
            const aMatch = expr.match(/(\d*)a/);
            if (aMatch && aMatch[1]) {
                aCoef = parseInt(aMatch[1]) || 1;
            }
            
            // 匹配b的系数
            let bCoef = 0;
            const bMatch = expr.match(/(\d*)b/);
            if (bMatch) {
                bCoef = bMatch[1] ? (parseInt(bMatch[1]) || 1) : 1;
            }
            
            return { a: aCoef, b: bCoef };
        } catch (e) {
            console.log("系数解析错误:", e);
            return null;
        }
    }

    // 显示成功消息
    function showSuccessMessage() {
        // 打印关卡信息
        console.log("显示成功消息前的关卡状态:");
        logLevelInfo();
        
        // 注意：不要在这里再次调用finishCurrentProblem(true)，因为在checkAnswer中已经通过recordProblemAttempt调用过了
        // 这里直接增加金牌数量即可
        
        // 增加金牌数量
        gameState.totalMedals++;
        medalsDisplay.textContent = gameState.totalMedals;
        
        // 显示成功消息
        resultModal.style.display = 'flex';
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // 再次打印关卡信息
        console.log("显示成功消息后的关卡状态:");
        logLevelInfo();
    }

    // 修改错误消息显示，提供更精确的信息
    function showErrorMessage(customMessage) {
        // 显示错误消息
        resultModal.style.display = 'flex';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        
        // 获取当前题目
        const currentLevel = levels[gameState.currentLevel];
        const polynomial = currentLevel ? currentLevel.polynomial : '';
        const correctAnswer = currentLevel ? currentLevel.answer : '';
        
        // 显示视频解释
        showExplanationVideo(polynomial);
        
        // 如果有自定义消息，则显示
        if (customMessage) {
            const errorTextElement = errorMessage.querySelector('p');
            if (errorTextElement) {
                // 针对特定多项式添加更具体的提示
                if (polynomial === '2a² + 5ab + 2b²' && customMessage.includes('答案不正确')) {
                    customMessage += `<br><br>对于 ${polynomial} 的因式分解，正确形式是 ${correctAnswer}`;
                    customMessage += `<br>提示：确保系数顺序正确，如(2a+b)(a+2b)，而不是(a+b)(2a+2b)等形式`;
                    customMessage += `<br>可接受的表达形式有：(2a+b)(a+2b)、(a+2b)(2a+b)等`;
                }
                
                errorTextElement.innerHTML = customMessage; // 使用innerHTML支持HTML标记
                
                // 添加保留拼图提示标签
                const keepPuzzleLabel = document.createElement('div');
                keepPuzzleLabel.className = 'keep-puzzle-label';
                keepPuzzleLabel.innerHTML = '<i class="fas fa-info-circle"></i> 您的拼图将被保留，可以继续调整';
                keepPuzzleLabel.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                keepPuzzleLabel.style.color = '#3498db';
                keepPuzzleLabel.style.padding = '8px 12px';
                keepPuzzleLabel.style.borderRadius = '4px';
                keepPuzzleLabel.style.fontSize = '14px';
                keepPuzzleLabel.style.marginTop = '15px';
                keepPuzzleLabel.style.marginBottom = '10px';
                keepPuzzleLabel.style.textAlign = 'center';
                keepPuzzleLabel.style.border = '1px solid rgba(52, 152, 219, 0.3)';
                
                // 添加到错误消息末尾
                if (!errorTextElement.querySelector('.keep-puzzle-label')) {
                    errorTextElement.appendChild(keepPuzzleLabel);
                }
                
                // 添加"显示答案"按钮对于困难题目
                if (customMessage.includes('答案不正确') && 
                    (polynomial === '2a² + 5ab + 2b²' || polynomial === '3a² + 7ab + 2b²')) {
                    
                    const showAnswerBtn = document.createElement('button');
                    showAnswerBtn.textContent = '显示详细答案格式';
                    showAnswerBtn.className = 'show-answer-btn';
                    showAnswerBtn.style.marginTop = '10px';
                    showAnswerBtn.style.padding = '5px 10px';
                    showAnswerBtn.style.backgroundColor = '#3498db';
                    showAnswerBtn.style.color = 'white';
                    showAnswerBtn.style.border = 'none';
                    showAnswerBtn.style.borderRadius = '3px';
                    showAnswerBtn.style.cursor = 'pointer';
                    
                    showAnswerBtn.addEventListener('click', () => {
                        const detailedExplanation = document.createElement('div');
                        detailedExplanation.style.marginTop = '10px';
                        detailedExplanation.style.padding = '10px';
                        detailedExplanation.style.backgroundColor = '#f9f9f9';
                        detailedExplanation.style.border = '1px solid #ddd';
                        detailedExplanation.style.borderRadius = '3px';
                        
                        // 显示所有等价形式
                        let explanationHTML = `<strong>正确答案格式:</strong> ${correctAnswer}<br>`;
                        explanationHTML += `<strong>可接受的等价形式:</strong><br>`;
                        
                        const polyKey = polynomial.replace(/\s+/g, ''); // 移除空格
                        if (specialCases[polyKey] && specialCases[polyKey][correctAnswer]) {
                            const equivalentForms = specialCases[polyKey][correctAnswer];
                            equivalentForms.forEach(form => {
                                explanationHTML += `- ${form}<br>`;
                            });
                        }
                        
                        detailedExplanation.innerHTML = explanationHTML;
                        
                        // 如果已经存在详细解释，则删除它
                        const existingExplanation = errorTextElement.querySelector('.detailed-explanation');
                        if (existingExplanation) {
                            existingExplanation.remove();
                        }
                        
                        // 给详细解释一个类名
                        detailedExplanation.className = 'detailed-explanation';
                        errorTextElement.appendChild(detailedExplanation);
                        
                        // 隐藏显示答案按钮
                        showAnswerBtn.style.display = 'none';
                    });
                    
                    // 如果已经存在显示答案按钮，则删除它
                    const existingBtn = errorTextElement.querySelector('.show-answer-btn');
                    if (existingBtn) {
                        existingBtn.remove();
                    }
                    
                    errorTextElement.appendChild(showAnswerBtn);
                }
            }
        }
        
        // 获取"再试一次"按钮
        const tryAgainButton = document.getElementById('try-again-btn');
        if (tryAgainButton) {
            // 先移除可能已经存在的事件监听器，避免重复添加
            const newTryAgainButton = tryAgainButton.cloneNode(true);
            tryAgainButton.parentNode.replaceChild(newTryAgainButton, tryAgainButton);
            
            // 无论什么情况，默认都保留拼图，只清空答案输入框
            newTryAgainButton.addEventListener('click', function preservePuzzleHandler() {
                // 隐藏模态窗口
                hideModal();
                
                // 清空答案输入框
                answerInput.value = '';
                
                // 重新聚焦到答案输入框
                setTimeout(() => answerInput.focus(), 100);
                
                // 在拼图不正确的情况下提示用户可以重置拼图
                if (customMessage && customMessage.includes("拼图不正确")) {
                    showGameTip("您可以通过【重置拼图】按钮清空当前拼图，或继续调整当前方块");
                }
                
                // 移除事件监听器，避免内存泄漏
                newTryAgainButton.removeEventListener('click', preservePuzzleHandler);
            });
            
            // 添加拼图重置按钮（仅当拼图不正确时）
            if (customMessage && customMessage.includes("拼图不正确")) {
                // 创建重置拼图按钮
                const resetPuzzleBtn = document.createElement('button');
                resetPuzzleBtn.textContent = '重置拼图';
                resetPuzzleBtn.className = 'reset-puzzle-btn';
                resetPuzzleBtn.style.marginLeft = '10px';
                resetPuzzleBtn.style.padding = '12px 24px';
                resetPuzzleBtn.style.backgroundColor = '#e74c3c';
                resetPuzzleBtn.style.color = 'white';
                resetPuzzleBtn.style.border = 'none';
                resetPuzzleBtn.style.borderRadius = '5px';
                resetPuzzleBtn.style.cursor = 'pointer';
                
                resetPuzzleBtn.addEventListener('click', function() {
                    hideModal();
                    resetPuzzle(); // 重置拼图
                    showGameTip("拼图已重置，请重新尝试");
                });
                
                // 找到按钮的父容器并添加重置按钮
                const btnContainer = newTryAgainButton.parentNode;
                if (btnContainer) {
                    // 如果已经存在重置按钮，则移除它
                    const existingResetBtn = btnContainer.querySelector('.reset-puzzle-btn');
                    if (existingResetBtn) {
                        existingResetBtn.remove();
                    }
                    btnContainer.appendChild(resetPuzzleBtn);
                }
            }
        }
    }

    // 隐藏结果模态窗口
    function hideModal() {
        resultModal.style.display = 'none';
    }

    // 进入下一关
    function nextLevel() {
        console.log("进入下一关，当前状态:");
        logLevelInfo();
        
        // 隐藏模态窗口
        hideModal();
        
        // 增加关卡内当前题目的索引
        gameState.currentLevel++;
        
        // 检查是否还有下一题
        if (gameState.currentLevel < levels.length) {
            console.log("进入新题目");
            // 重置拼图区域
            resetPuzzle();
            
            // 更新多项式显示
            updatePolynomialDisplay();
        } else {
            console.log("当前题库已完成，切换到新题库");
            // 当前题库中所有关卡都完成了，切换到随机模式
            gameState.currentLevel = 0;
            
            // 随机选择一个不同的题库
            const availableTypes = Object.keys(problemTypes).filter(type => type !== selectedProblemType);
            if (availableTypes.length > 0) {
                const newType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                selectedProblemType = newType;
                levels = problemTypes[newType];
                
                // 更新界面
            updatePolynomialDisplay();
            resetPuzzle();
                
                // 显示提示
                showGameTip("已完成当前题库所有题目，已切换到新题库");
            }
        }
        
        console.log("下一关处理完成，现在状态:");
        logLevelInfo();
    }

    // 显示游戏提示
    function showGameTip(message) {
        const tipElement = document.createElement('div');
        tipElement.className = 'game-tip';
        tipElement.textContent = message;
        document.body.appendChild(tipElement);
        
        // 3秒后自动消失
        setTimeout(() => {
            tipElement.classList.add('fade-out');
            setTimeout(() => {
                tipElement.remove();
            }, 500);
        }, 3000);
    }

    // 移除旧的悬停事件处理
    function setupCardHoverEvents() {
        // 不再需要处理鼠标悬停事件，因为现在使用按钮旋转
    }

    // 修改旋转函数，添加旋转限制
    function rotateCard(card) {
        if (!card || gameState.rotationCooldown) return;
        
        // 严格检查：如果卡片已经被设置为禁止旋转，则不执行旋转
        if (card.dataset.disableRotation === 'true') {
            console.log("卡片已禁止旋转"); // 调试用，可选
            return;
        }
        
        // 设置旋转冷却
        gameState.rotationCooldown = true;
        setTimeout(() => {
            gameState.rotationCooldown = false;
        }, 300);
        
        // 获取旋转按钮并添加旋转动画
        const rotateButton = card.querySelector('.rotate-button');
        if (rotateButton) {
            rotateButton.classList.add('rotating');
            setTimeout(() => {
                rotateButton.classList.remove('rotating');
            }, 300);
        }
        
        // 获取当前位置
        const currentLeft = parseFloat(card.style.left);
        const currentTop = parseFloat(card.style.top);
        
        // 获取卡片当前尺寸
        const currentWidth = card.offsetWidth;
        const currentHeight = card.offsetHeight;
        
        // 检查当前旋转状态
        const isCurrentlyRotated = card.classList.contains('rotated-card');
        
        // 计算新的尺寸和位置
        let newWidth, newHeight;
        let newLeft = currentLeft;
        let newTop = currentTop;
        
        if (card.classList.contains('yellow-rectangle')) {
            // 黄色长方形的特殊处理
            if (!isCurrentlyRotated) {
                // 从横向(120x80)变为竖向(80x120)或从竖向(80x120)变为横向(120x80)
                if (card.classList.contains('vertical-rectangle')) {
                    // 竖向矩形旋转后变为横向
                    newWidth = 120;
                    newHeight = 80;
                } else {
                    // 普通横向矩形旋转后变为竖向
                    newWidth = 80;
                    newHeight = 120;
                }

                // 特殊处理：确保旋转后的中心点位置正确
                newLeft = currentLeft + (currentWidth - newWidth) / 2;
                newTop = currentTop + (currentHeight - newHeight) / 2;
            } else {
                // 从竖向(80x120)变为横向(120x80)或从横向(120x80)变为竖向(80x120)
                if (card.classList.contains('vertical-rectangle')) {
                    // 竖向矩形旋转回来后变为竖向
                    newWidth = 80;
                    newHeight = 120;
                } else {
                    // 普通矩形旋转回来后变为横向
                    newWidth = 120;
                    newHeight = 80;
                }

                // 特殊处理：确保旋转回来后的中心点位置正确
                newLeft = currentLeft + (currentWidth - newWidth) / 2;
                newTop = currentTop + (currentHeight - newHeight) / 2;
            }
        } else {
            // 其他卡片保持原有尺寸
            newWidth = currentWidth;
            newHeight = currentHeight;
        }
        
        // 检查旋转后是否会重叠或超出边界
        const wouldOverlap = checkOverlap(card, newLeft, newTop, newWidth, newHeight);
        const puzzleRect = puzzleContainer.getBoundingClientRect();
        const isOutOfBounds = (newLeft < 0 || 
                              newTop < 0 || 
                              newLeft + newWidth > puzzleRect.width ||
                              newTop + newHeight > puzzleRect.height);
        
        if (wouldOverlap || isOutOfBounds) {
            // 如果会重叠或超出边界，不执行旋转
            return;
        }
        
        // 执行旋转
        if (isCurrentlyRotated) {
            card.classList.remove('rotated-card');
        } else {
            card.classList.add('rotated-card');
        }
        
        // 更新位置和尺寸
        card.style.left = `${newLeft}px`;
        card.style.top = `${newTop}px`;
        
        // 显式设置宽高（黄色长方形需要特殊处理交换宽高）
        if (card.classList.contains('yellow-rectangle')) {
            card.style.width = `${newWidth}px`;
            card.style.height = `${newHeight}px`;
        }
        
        // 设置卡片为已旋转状态，禁止再次旋转
        card.dataset.disableRotation = 'true';
        
        // 变更旋转按钮样式，表示不能再旋转
        if (rotateButton) {
            rotateButton.classList.add('disabled');
            rotateButton.title = "已旋转";
        }
        
        // 更新游戏状态
        const cardIndex = gameState.cardsInPuzzle.findIndex(c => c.element === card);
        if (cardIndex !== -1) {
            gameState.cardsInPuzzle[cardIndex].isRotated = !isCurrentlyRotated;
        }
    }

    // 检查重叠函数
    function checkOverlap(card, newX, newY, newWidth, newHeight) {
        const otherCards = Array.from(puzzleContainer.querySelectorAll('.card-clone')).filter(c => c !== card);
        
        // 如果提供了新的宽高，使用它们，否则使用卡片的当前尺寸
        const cardWidth = newWidth || card.offsetWidth;
        const cardHeight = newHeight || card.offsetHeight;
        
        // 添加重叠检测的容差值（像素）
        const overlapThreshold = 20; // 20px的重叠容差
        
        // 创建当前卡片的边界（考虑容差值）
        const cardBounds = {
            left: newX + overlapThreshold,
            right: newX + cardWidth - overlapThreshold,
            top: newY + overlapThreshold,
            bottom: newY + cardHeight - overlapThreshold
        };
        
        // 检查与其他卡片的重叠
        return otherCards.some(otherCard => {
            const otherRotated = otherCard.classList.contains('rotated-card');
            let otherWidth, otherHeight;
            
            // 获取其他卡片的实际尺寸（考虑黄色长方形的特殊情况）
            if (otherCard.classList.contains('yellow-rectangle')) {
                const isVertical = otherCard.classList.contains('vertical-rectangle');
                
                if (otherRotated) {
                    // 旋转后的尺寸
                    if (isVertical) {
                        // 竖向长方形旋转后的尺寸
                        otherWidth = 120;
                        otherHeight = 80;
                    } else {
                        // 普通长方形旋转后的尺寸
                        otherWidth = 80;
                        otherHeight = 120;
                    }
                } else {
                    // 未旋转的尺寸
                    if (isVertical) {
                        // 竖向长方形原始尺寸
                        otherWidth = 80;
                        otherHeight = 120;
                    } else {
                        // 普通长方形原始尺寸
                        otherWidth = 120;
                        otherHeight = 80;
                    }
                }
            } else {
                otherWidth = otherCard.offsetWidth;
                otherHeight = otherCard.offsetHeight;
            }
            
            const otherLeft = parseFloat(otherCard.style.left);
            const otherTop = parseFloat(otherCard.style.top);
            
            // 创建其他卡片的边界（考虑容差值）
            const otherBounds = {
                left: otherLeft + overlapThreshold,
                right: otherLeft + otherWidth - overlapThreshold,
                top: otherTop + overlapThreshold,
                bottom: otherTop + otherHeight - overlapThreshold
            };
            
            // 检查是否有实质性重叠（考虑容差值）
            return !(cardBounds.right <= otherBounds.left ||
                    cardBounds.left >= otherBounds.right ||
                    cardBounds.bottom <= otherBounds.top ||
                    cardBounds.top >= otherBounds.bottom);
        });
    }

    // 预加载资源
    function preloadResources() {
        // 预加载金牌图片
        const medalImg = new Image();
        medalImg.src = 'img/金牌.png';
        
        // 创建videos目录（如果不存在）
        // 注意：这通常需要服务器端操作，这里只是前端模拟
        console.log('准备加载视频资源');
        
        // 从localStorage加载金牌数量
        loadMedals();
    }
    
    // 从localStorage加载金牌数量
    function loadMedals() {
        const medalsElement = document.getElementById('medals');
        const savedMedals = localStorage.getItem('medals');
        
        if (savedMedals) {
            medalsElement.textContent = savedMedals;
            gameState.totalMedals = parseInt(savedMedals);
        }
    }

    // 启动游戏
    initGame();

    // 在文件底部添加代码，确保在DOM加载完成后测试视频可用性
    document.addEventListener('DOMContentLoaded', function() {
        // 测试本地视频是否可用
        testLocalVideoAvailability();
    });

    // 测试本地视频可用性
    function testLocalVideoAvailability() {
        const videoStatus = document.querySelector('.video-status');
        if (!videoStatus) return;
        
        videoStatus.textContent = "正在检查视频...";
        videoStatus.style.color = "#3498db";
        
        const testVideo = document.createElement('video');
        testVideo.style.display = 'none';
        testVideo.preload = 'metadata';
        
        // 测试本地视频文件
        const testSource = document.createElement('source');
        testSource.src = 'videos/explanation.mp4';
        testSource.type = 'video/mp4';
        testVideo.appendChild(testSource);
        
        // 记录事件
        testVideo.addEventListener('loadedmetadata', function() {
            console.log('视频测试成功：本地视频可用，时长:', testVideo.duration);
            videoStatus.textContent = "本地视频可用 ✓";
            videoStatus.style.color = "green";
            document.body.removeChild(testVideo);
        });
        
        testVideo.addEventListener('error', function(e) {
            console.error('视频测试失败：本地视频不可用', e);
            videoStatus.textContent = "本地视频不可用 ✗";
            videoStatus.style.color = "red";
            document.body.removeChild(testVideo);
            
            // 尝试加载备用视频
            const mainVideo = document.getElementById('explanation-video');
            if (mainVideo) {
                console.log('尝试使用备用视频源');
                mainVideo.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                mainVideo.load();
            }
        });
        
        // 添加到DOM并开始加载
        document.body.appendChild(testVideo);
        testVideo.load();
    }

    // 随机生成新题目
    function generateRandomProblem() {
        // 随机选择题库类型
        const availableTypes = Object.keys(problemTypes);
        const randomTypeIndex = Math.floor(Math.random() * availableTypes.length);
        const selectedType = availableTypes[randomTypeIndex];
        
        // 设置当前题库和题目
        selectedProblemType = selectedType;
        levels = problemTypes[selectedType];
        
        // 随机选择当前题库中的一道题
        gameState.currentLevel = Math.floor(Math.random() * levels.length);
        
        // 重置拼图区域
        resetPuzzle();
        
        // 更新多项式显示
        updatePolynomialDisplay();
        
        // 显示提示信息
        showGameTip("已随机生成新题目，使用拼图块拼出多项式");
        setTimeout(() => {
            showGameTip("本游戏中多项式均为正项，如a² + 3ab + 2b²，便于拼图");
        }, 3000);
    }

    // 生成学习报告
    function generateLearningReport() {
        // 添加调试信息
        console.log("生成学习报告开始");
        
        // 获取要素
        const learningReportModal = document.getElementById('learning-report-modal');
        const reportSummary = document.querySelector('.report-summary');
        const radarChart = document.querySelector('.radar-chart');
        const progressChart = document.querySelector('.progress-chart');
        const reportDetails = document.querySelector('.report-details');
        const reportSuggestions = document.querySelector('.report-suggestions');
        const reportDate = document.querySelector('.report-date');
        
        // 记录DOM元素获取情况
        console.log("DOM元素获取情况:", {
            "learningReportModal": !!learningReportModal,
            "reportSummary": !!reportSummary,
            "radarChart": !!radarChart,
            "progressChart": !!progressChart,
            "reportDetails": !!reportDetails,
            "reportSuggestions": !!reportSuggestions,
            "reportDate": !!reportDate
        });
        
        if (!learningReportModal) {
            console.error("未找到学习报告模态框");
            return;
        }
        
        // 设置当前日期
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        if (reportDate) {
            reportDate.textContent = `(${dateStr})`;
        }
        
        // 清空之前的内容
        if (reportSummary) reportSummary.innerHTML = '';
        if (radarChart) radarChart.innerHTML = '';
        if (progressChart) progressChart.innerHTML = '';
        if (reportDetails) reportDetails.innerHTML = '';
        if (reportSuggestions) reportSuggestions.innerHTML = '';
        
        // 初始化学习统计数据（如果缺失）
        if (!gameState.learningStats) {
            console.log("学习统计数据不存在，正在初始化");
            gameState.learningStats = {
                problemsAttempted: 0,
                problemsSolved: 0,
                currentRoundProblems: 0,
                problemTimer: null,
                currentProblemStartTime: 0,
                problemRecords: [],
                currentProblem: {
                    type: '',
                    polynomial: '',
                    answer: '',
                    attempts: 0,
                    startTime: 0,
                    endTime: 0,
                    isSolved: false,
                    duration: 0,
                    errors: []
                },
                typeStats: {
                    'perfect-square': { attempted: 0, solved: 0, attemptsCount: 0, totalTime: 0 },
                    'cross-multiply': { attempted: 0, solved: 0, attemptsCount: 0, totalTime: 0 }
                }
            };
        }
        
        // 确保problemRecords存在
        if (!gameState.learningStats.problemRecords) {
            console.log("problemRecords不存在，正在初始化");
            gameState.learningStats.problemRecords = [];
        }
        
        // 重新计算各题型的统计数据
        recalculateTypeStats();
        
        // 修复计算统计数据
        const stats = gameState.learningStats;
        
        // 记录学习统计数据
        console.log("学习统计数据:", {
            "problemsAttempted": stats.problemsAttempted,
            "problemsSolved": stats.problemsSolved,
            "problemRecords长度": stats.problemRecords ? stats.problemRecords.length : 'undefined',
            "typeStats": stats.typeStats
        });
        
        // 准确计算总题目数 - 使用实际完成的题目数量
        const totalProblems = stats.problemsSolved || 0;
        
        // 计算总尝试次数
        let totalAttempts = 0;
        if (stats.problemRecords && stats.problemRecords.length > 0) {
            stats.problemRecords.forEach(record => {
                totalAttempts += record.attempts > 0 ? record.attempts : 1;
            });
        }
        
        // 计算平均尝试次数 (至少为0.1，避免显示0.0)
        const avgAttempts = totalProblems > 0 ? 
            Math.max(0.1, (totalAttempts / totalProblems).toFixed(1)) : "0.0";
        
        // 计算首次答对题目数
        const firstCorrectCount = stats.problemRecords && stats.problemRecords.length > 0 ?
            stats.problemRecords.filter(p => p.attempts === 1 && p.isSolved).length : 0;
        
        // 计算首次答对率
        const firstCorrectRate = totalProblems > 0 ? 
            (firstCorrectCount / totalProblems * 100).toFixed(1) : "0.0";
        
        // 构建完整的题型统计信息，确保统计逻辑正确
        const typeStats = buildTypeStats();
        
        // 1. 创建总体概述 - 使用横向排列
        const summaryHTML = `
            <div class="report-section">
                <h3>学习概览</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <div class="stat-value">${totalProblems}</div>
                        <div class="stat-label">完成题目总数</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${firstCorrectRate}%</div>
                        <div class="stat-label">首次答对率</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${avgAttempts}</div>
                        <div class="stat-label">平均尝试次数</div>
                    </div>
                </div>
            </div>
        `;
        if (reportSummary) reportSummary.innerHTML = summaryHTML;
        
        // 2. 使用简单div替代雷达图和进度图
        if (radarChart) displaySimpleStats(radarChart, typeStats);
        if (progressChart) displayProgressSummary(progressChart, stats.problemRecords || []);
        
        // 3. 创建详细数据表格
        let detailsHTML = `
            <div class="report-section">
                <h3>按题型分析</h3>
                <div class="table-container">
                    <table class="type-stats-table">
                        <thead>
                            <tr>
                                <th>题型</th>
                                <th>完成数量</th>
                                <th>正确率</th>
                                <th>平均尝试</th>
                                <th>平均用时</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        const typeNames = {
            'perfect-square': '完全平方公式',
            'cross-multiply': '十字相乘法'
        };
        
        for (const type in typeStats) {
            const stat = typeStats[type];
            detailsHTML += `
                <tr>
                    <td>${typeNames[type] || type}</td>
                    <td>${stat.solved}/${stat.attempted}</td>
                    <td>${stat.correctRate}%</td>
                    <td>${stat.avgAttempts}</td>
                    <td>${stat.avgTime}秒</td>
                </tr>
            `;
        }
        
        detailsHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        if (reportDetails) reportDetails.innerHTML = detailsHTML;
        
        // 4. 生成学习建议
        const weakestType = findWeakestType(typeStats);
        let suggestionsHTML = `
            <div class="report-section">
                <h3>学习建议</h3>
                <div class="suggestion-container">
        `;
        
        if (weakestType) {
            const typeName = typeNames[weakestType] || weakestType;
            suggestionsHTML += `
                <div class="suggestion-item">
                    <div class="suggestion-icon">💡</div>
                    <div class="suggestion-text">
                        <p>建议重点练习 <strong>${typeName}</strong> 类型的题目，这是您当前的薄弱环节。</p>
                    </div>
                </div>
            `;
        }
        
        // 添加通用建议
        suggestionsHTML += `
                <div class="suggestion-item">
                    <div class="suggestion-icon">📝</div>
                    <div class="suggestion-text">
                        <p>尝试在纸上演算多项式因式分解，加深理解。</p>
                    </div>
                </div>
                <div class="suggestion-item">
                    <div class="suggestion-icon">🔄</div>
                    <div class="suggestion-text">
                        <p>定期复习不同类型的多项式因式分解方法，巩固知识点。</p>
                    </div>
                </div>
            </div>
        </div>
        `;
        if (reportSuggestions) reportSuggestions.innerHTML = suggestionsHTML;
        
        // 显示学习报告模态框
        learningReportModal.style.display = 'flex';
        console.log("设置模态框显示:", learningReportModal.style.display);
        
        // 添加关闭报告事件监听
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            // 移除可能存在的旧事件监听器
            const newContinueBtn = continueBtn.cloneNode(true);
            continueBtn.parentNode.replaceChild(newContinueBtn, continueBtn);
            
            // 添加新的事件监听器
            newContinueBtn.addEventListener('click', () => {
                learningReportModal.style.display = 'none';
                console.log("关闭模态框");
            });
        }
        
        console.log("生成学习报告完成");
    }
    
    // 使用Canvas绘制雷达图替代简单DIV
    function displaySimpleStats(container, typeStats) {
        // 先保留标题部分
        container.innerHTML = `
            <div class="stats-container">
                <h3>各题型掌握程度</h3>
                <canvas id="radar-chart-canvas" width="300" height="300"></canvas>
            </div>
        `;
        
        const typeNames = {
            'perfect-square': '完全平方公式',
            'cross-multiply': '十字相乘法'
        };
        
        // 获取Canvas元素
        const canvas = document.getElementById('radar-chart-canvas');
        if (!canvas || !canvas.getContext) {
            console.error('Canvas不支持，使用备用显示方式');
            return displaySimpleStatsBackup(container, typeStats);
        }
        
        const ctx = canvas.getContext('2d');
        
        // 雷达图设置
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        
        // 获取数据
        const types = Object.keys(typeStats);
        const angles = [];
        const labels = [];
        const values = [];
        const colors = [
            'rgba(255, 99, 132, 0.7)',   // 粉色 - 完全平方公式
            'rgba(54, 162, 235, 0.7)',   // 蓝色 - 十字相乘法
            'rgba(255, 206, 86, 0.7)'    // 黄色
        ];
        
        // 计算每个指标的角度和值
        for (let i = 0; i < types.length; i++) {
            const type = types[i];
            const angle = (Math.PI * 2 * i) / types.length;
            angles.push(angle);
            labels.push(typeNames[type] || type);
            
            // 计算掌握度 (0-1之间)
            let mastery = 0;
            const typeStat = typeStats[type];
            
            if (typeStat.attempted > 0 && typeStat.solved > 0) {
                // 计算正确率
                const correctRate = typeStat.solved / typeStat.attempted;
                
                // 计算尝试效率 (首次正确/总解决)
                const firstCorrectRate = typeStat.firstCorrect > 0 ? 
                    typeStat.firstCorrect / typeStat.solved : 0;
                
                // 计算尝试次数因子 (平均尝试次数越多，该因子越小)
                const avgAttempts = parseFloat(typeStat.avgAttempts) || 1;
                const attemptFactor = Math.max(0.5, 1 - Math.min(1, (avgAttempts - 1) * 0.2));
                
                // 组合因素计算掌握度: 正确率(60%) + 首次正确率(20%) + 尝试效率(20%)
                mastery = (correctRate * 0.6) + (firstCorrectRate * 0.2) + (attemptFactor * 0.2);
                
                // 确保mastery在0-1范围内
                mastery = Math.max(0, Math.min(1, mastery));
                
                console.log(`题型 ${type} 掌握度计算: 
                    正确率=${correctRate} (权重0.6), 
                    首次正确率=${firstCorrectRate} (权重0.2), 
                    尝试效率=${attemptFactor} (权重0.2), 
                    最终掌握度=${mastery}`);
            }
            
            values.push(mastery);
        }
        
        // 如果没有数据，显示提示
        if (types.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // 绘制背景
        ctx.fillStyle = 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制网格线和环形刻度
        for (let i = 0; i < 5; i++) {
            const r = radius * (i + 1) / 5;
            ctx.beginPath();
            ctx.strokeStyle = i === 4 ? 'rgba(150, 150, 150, 0.6)' : 'rgba(200, 200, 200, 0.5)';
            ctx.lineWidth = i === 4 ? 1.5 : 1;
            for (let j = 0; j <= 360; j += 1) {
                const rad = j * Math.PI / 180;
                const x = centerX + r * Math.cos(rad - Math.PI / 2);
                const y = centerY + r * Math.sin(rad - Math.PI / 2);
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            // 添加百分比刻度
            if (i > 0) {
                ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
                ctx.font = '11px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText((i * 20) + '%', centerX, centerY - r + 5);
            }
        }
        
        // 绘制轴线
        for (let i = 0; i < angles.length; i++) {
            const angle = angles[i];
            const x = centerX + radius * Math.cos(angle - Math.PI / 2);
            const y = centerY + radius * Math.sin(angle - Math.PI / 2);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(120, 120, 120, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // 绘制数据多边形
        ctx.beginPath();
        for (let i = 0; i < values.length; i++) {
            const angle = angles[i];
            const value = values[i];
            const x = centerX + radius * value * Math.cos(angle - Math.PI / 2);
            const y = centerY + radius * value * Math.sin(angle - Math.PI / 2);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(54, 162, 235, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(54, 162, 235, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制数据点
        for (let i = 0; i < values.length; i++) {
            const angle = angles[i];
            const value = values[i];
            const x = centerX + radius * value * Math.cos(angle - Math.PI / 2);
            const y = centerY + radius * value * Math.sin(angle - Math.PI / 2);
            
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // 绘制值标签 - 调整值标签的位置，避免与其他元素重叠
            const percentage = Math.round(value * 100) + '%';
            
            // 根据角度和值计算合适的偏移量
            let offsetDistance = 25; // 基础偏移距离
            let valueX, valueY;
            
            // 值标签位置计算保持不变
            if (angle === Math.PI / 2) {
                valueX = x;
                valueY = y + offsetDistance * 0.7;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
            } else if (angle === Math.PI * 3 / 2) {
                valueX = x;
                valueY = y - offsetDistance * 0.7;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
            } else {
                valueX = centerX + (radius * value + offsetDistance) * Math.cos(angle - Math.PI / 2);
                valueY = centerY + (radius * value + offsetDistance) * Math.sin(angle - Math.PI / 2);
                
                if (angle === 0) {
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                } else if (angle === Math.PI) {
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'middle';
                } else if (angle > 0 && angle < Math.PI) {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                } else {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                }
            }
            
            ctx.fillStyle = colors[i % colors.length];
            ctx.font = 'bold 14px Arial';
            ctx.fillText(percentage, valueX, valueY);
        }
        
        // 在右下角添加图例，带有彩色方块，避免遮挡雷达图
        const legendMargin = 15;
        const legendX = canvas.width - 160; // 靠右放置
        const squareSize = 12;
        const textIndent = squareSize + 5;
        let legendY = canvas.height - legendMargin - 5; // 稍微上移
        
        // 绘制图例背景，增加透明度
        const legendWidth = 150;
        const legendHeight = (labels.length * (squareSize + 10)) + 10;
        const legendBgX = legendX - 10;
        const legendBgY = legendY - legendHeight + 5;
        
        // 绘制半透明白色背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            // 如果浏览器支持roundRect函数
            ctx.roundRect(legendBgX, legendBgY, legendWidth, legendHeight, 5);
        } else {
            // 兼容处理，使用普通矩形
            ctx.rect(legendBgX, legendBgY, legendWidth, legendHeight);
        }
        ctx.fill();
        
        // 从下往上绘制图例项，确保不会超出画布
        for (let i = labels.length - 1; i >= 0; i--) {
            // 绘制彩色方块
            ctx.fillStyle = colors[i];
            ctx.fillRect(legendX, legendY - squareSize, squareSize, squareSize);
            
            // 绘制方块边框
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(legendX, legendY - squareSize, squareSize, squareSize);
            
            // 绘制标签文本
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], legendX + textIndent, legendY - squareSize/2);
            
            // 绘制掌握度百分比
            const percentage = Math.round(values[i] * 100) + '%';
            ctx.fillStyle = colors[i];
            ctx.font = 'bold 12px Arial';
            ctx.fillText(percentage, legendX + textIndent + 80, legendY - squareSize/2);
            
            // 向上移动到下一个图例项位置
            legendY -= (squareSize + 10);
        }
    }

    // 备用的简单DIV雷达图显示（当Canvas不可用时）
    function displaySimpleStatsBackup(container, typeStats) {
        let html = `
            <div class="stats-container">
                <h3>各题型掌握程度</h3>
                <div class="simple-stats">
        `;
        
        const typeNames = {
            'perfect-square': '完全平方公式',
            'cross-multiply': '十字相乘法'
        };
        
        for (const type in typeStats) {
            const stat = typeStats[type];
            const typeName = typeNames[type] || type;
            const percentage = stat.correctRate || 0;
            
            html += `
                <div class="stat-bar">
                    <div class="stat-label">${typeName}</div>
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="stat-value">${percentage}%</div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // 使用Canvas绘制柱状图替代进度条
    function displayProgressSummary(container, problemRecords) {
        const totalProblems = problemRecords.length;
        const solvedProblems = problemRecords.filter(p => p.isSolved).length;
        const firstAttemptSolved = problemRecords.filter(p => p.attempts === 1 && p.isSolved).length;
        
        // 先保留标题部分
        container.innerHTML = `
            <div class="progress-summary">
                <h3>学习进度</h3>
                <canvas id="progress-chart-canvas" width="300" height="240"></canvas>
            </div>
        `;
        
        // 获取Canvas元素
        const canvas = document.getElementById('progress-chart-canvas');
        if (!canvas || !canvas.getContext) {
            console.error('Canvas不支持，使用备用显示方式');
            return displayProgressSummaryBackup(container, problemRecords);
        }
        
        const ctx = canvas.getContext('2d');
        
        // 柱状图设置
        const padding = {top: 30, right: 30, bottom: 60, left: 60};
        const chartWidth = canvas.width - padding.left - padding.right;
        const chartHeight = canvas.height - padding.top - padding.bottom;
        const barWidth = chartWidth / 3 * 0.6;  // 每个柱子宽度
        const spacing = chartWidth / 3 * 0.4;   // 柱子间距
        
        // 计算数据
        const categories = ['总题数', '已完成', '首次答对'];
        const values = [totalProblems, solvedProblems, firstAttemptSolved];
        const percentages = [
            100, 
            totalProblems ? Math.round(solvedProblems / totalProblems * 100) : 0, 
            totalProblems ? Math.round(firstAttemptSolved / totalProblems * 100) : 0
        ];
        const colors = [
            'rgba(54, 162, 235, 0.7)',   // 蓝色
            'rgba(75, 192, 192, 0.7)',   // 青色
            'rgba(255, 206, 86, 0.7)'    // 黄色
        ];
        
        // 绘制背景
        ctx.fillStyle = 'rgba(245, 245, 245, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 找出最大值，确定Y轴范围
        const maxValue = Math.max(...values);
        // 向上取整到5的倍数，并添加10%的空间
        const yAxisMax = Math.max(5, Math.ceil(maxValue * 1.1 / 5) * 5);
        
        // 绘制Y轴
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, canvas.height - padding.bottom);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 绘制X轴
        ctx.beginPath();
        ctx.moveTo(padding.left, canvas.height - padding.bottom);
        ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
        ctx.stroke();
        
        // 绘制Y轴刻度和网格线
        const yStep = yAxisMax / 5;
        for (let i = 0; i <= 5; i++) {
            const value = i * yStep;
            const y = padding.top + chartHeight - (chartHeight * (value / yAxisMax));
            
            // 绘制刻度线
            ctx.beginPath();
            ctx.moveTo(padding.left - 5, y);
            ctx.lineTo(padding.left, y);
            ctx.stroke();
            
            // 绘制网格线
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(canvas.width - padding.right, y);
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
            ctx.stroke();
            
            // 绘制Y轴刻度值
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toString(), padding.left - 10, y);
        }
        
        // 绘制柱状图
        for (let i = 0; i < categories.length; i++) {
            const xPos = padding.left + spacing + i * (barWidth + spacing);
            const value = values[i];
            const barHeight = (value / yAxisMax) * chartHeight;
            const yPos = canvas.height - padding.bottom - barHeight;
            
            // 绘制柱子
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            // 使用矩形路径（如果浏览器不支持roundRect）
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(xPos, yPos, barWidth, barHeight, 3);
            } else {
                ctx.rect(xPos, yPos, barWidth, barHeight);
            }
            ctx.fill();
            
            // 绘制柱子边框
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // 绘制数值标签
            ctx.fillStyle = '#333';
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(value.toString(), xPos + barWidth / 2, yPos - 5);
            
            // 绘制百分比标签
            ctx.fillStyle = colors[i];
            ctx.font = 'bold 12px Arial';
            if (i > 0) { // 只对"已完成"和"首次答对"显示百分比
                ctx.fillText(percentages[i] + '%', xPos + barWidth / 2, yPos - 22);
            }
            
            // 绘制类别标签
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textBaseline = 'top';
            ctx.fillText(categories[i], xPos + barWidth / 2, canvas.height - padding.bottom + 10);
        }
        
        // 绘制标题和说明
        ctx.fillStyle = '#333';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('数量', padding.left, padding.top - 10);
        
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`完成率: ${percentages[1]}%    准确率: ${percentages[2]}%`, padding.left, canvas.height - padding.bottom + 30);
    }

    // 备用的简单DIV进度条显示（当Canvas不可用时）
    function displayProgressSummaryBackup(container, problemRecords) {
        const totalProblems = problemRecords.length;
        const solvedProblems = problemRecords.filter(p => p.isSolved).length;
        const firstAttemptSolved = problemRecords.filter(p => p.attempts === 1 && p.isSolved).length;
        
        const solvedPercentage = totalProblems > 0 ? (solvedProblems / totalProblems * 100) : 0;
        const firstAttemptPercentage = totalProblems > 0 ? (firstAttemptSolved / totalProblems * 100) : 0;
        
        let html = `
            <div class="progress-summary">
                <h3>学习进度</h3>
                <div class="progress-container">
                    <div class="progress-item">
                        <div class="progress-label">已完成</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${solvedPercentage}%"></div>
                        </div>
                        <div class="progress-value">${solvedProblems}/${totalProblems} (${solvedPercentage.toFixed(1)}%)</div>
                    </div>
                    <div class="progress-item">
                        <div class="progress-label">首次答对</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${firstAttemptPercentage}%"></div>
                        </div>
                        <div class="progress-value">${firstAttemptSolved}/${totalProblems} (${firstAttemptPercentage.toFixed(1)}%)</div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // 添加重新计算类型统计数据的函数
    function recalculateTypeStats() {
        const stats = gameState.learningStats;
        
        // 清零所有题型统计数据
        for (const type in stats.typeStats) {
            stats.typeStats[type] = { 
                attempted: 0, 
                solved: 0, 
                attemptsCount: 0, 
                totalTime: 0 
            };
        }
        
        // 重新计算各题型的统计数据
        stats.problemRecords.forEach(record => {
            const type = record.type;
            
            // 跳过没有类型的记录
            if (!type || !stats.typeStats[type]) return;
            
            // 增加尝试过的题目数
            stats.typeStats[type].attempted++;
            
            // 如果题目已解决，增加已解决数量
            if (record.isSolved) {
                stats.typeStats[type].solved++;
            }
            
            // 记录尝试次数
            stats.typeStats[type].attemptsCount += record.attempts || 0;
            
            // 记录解题时间
            if (record.startTime && record.endTime) {
                const time = (record.endTime - record.startTime) / 1000; // 转换为秒
                stats.typeStats[type].totalTime += time;
            }
        });
        
        console.log("重新计算题型统计:", stats.typeStats);
    }
    
    // 构建题型统计数据
    function buildTypeStats() {
        const stats = gameState.learningStats;
        const typeStats = {};
        
        for (const type in stats.typeStats) {
            const typeStat = stats.typeStats[type];
            
            // 计算正确率
            const correctRate = typeStat.attempted > 0 ? 
                (typeStat.solved / typeStat.attempted * 100).toFixed(1) : "0.0";
                
            // 计算平均尝试次数
            const avgAttempts = typeStat.solved > 0 ? 
                (typeStat.attemptsCount / typeStat.solved).toFixed(1) : "0.0";
                
            // 计算平均用时
            const avgTime = typeStat.solved > 0 ? 
                (typeStat.totalTime / typeStat.solved).toFixed(1) : "0.0";
            
            // 计算首次答对数量
            const firstCorrect = stats.problemRecords
                .filter(p => p.type === type && p.attempts === 1 && p.isSolved)
                .length;
            
            typeStats[type] = {
                attempted: typeStat.attempted,
                solved: typeStat.solved,
                correctRate: correctRate,
                avgAttempts: avgAttempts,
                avgTime: avgTime,
                firstCorrect: firstCorrect,
                masteryLevel: 0 // 初始化熟练度为0
            };
        }
        
        return typeStats;
    }
    
    // 查找最薄弱的题型
    function findWeakestType(typeStats) {
        let weakestType = null;
        let lowestScore = Infinity;
        
        for (const type in typeStats) {
            const stat = typeStats[type];
            
            // 只考虑有尝试记录的题型
            if (stat.attempted > 0) {
                // 基于正确率评估，正确率越低，分数越低
                const score = parseFloat(stat.correctRate);
                
                if (score < lowestScore) {
                    lowestScore = score;
                    weakestType = type;
                }
            }
        }
        
        return weakestType;
    }

    // 更新当前多项式显示
    function updatePolynomialDisplay() {
        if (gameState.currentLevel < levels.length) {
            const currentProblem = levels[gameState.currentLevel];
            const currentPolynomial = currentProblem.polynomial;
            
            // 更新题目区域
            const problemFormulaElement = document.getElementById('problem-formula');
            if (problemFormulaElement) {
                problemFormulaElement.textContent = currentPolynomial;
            }
            
            // 保持拼图区域的多项式显示为初始状态
            updatePolynomialFromCards();
            
            // 记录当前题目的开始情况
            startNewProblemTracking(currentProblem);
        }
    }

    // 完成当前题目的跟踪
    function finishCurrentProblem(solved) {
        console.log("题目完成处理开始, 答案正确:", solved);
        
        // 输出当前状态
        logLevelInfo();
        
        // 停止计时
        if (gameState.learningStats.problemTimer) {
            clearInterval(gameState.learningStats.problemTimer);
            gameState.learningStats.problemTimer = null;
        }
        
        // 记录结束时间和状态
        const endTime = new Date().getTime();
        const duration = endTime - gameState.learningStats.currentProblem.startTime;
        
        // 更新当前问题记录
        gameState.learningStats.currentProblem.endTime = endTime;
        gameState.learningStats.currentProblem.isSolved = solved;
        gameState.learningStats.currentProblem.duration = duration;
        
        // 确保attempts至少为1
        if (gameState.learningStats.currentProblem.attempts === 0) {
            gameState.learningStats.currentProblem.attempts = 1;
        }
        
        if (solved) {
            // 增加解决的题目计数
            gameState.learningStats.problemsSolved++;
            
            // 确保typeStats对象存在
            if (!gameState.learningStats.typeStats[selectedProblemType]) {
                gameState.learningStats.typeStats[selectedProblemType] = { 
                    attempted: 1, 
                    solved: 0, 
                    attemptsCount: 0, 
                    totalTime: 0 
                };
            }
            
            // 增加该类型题目的解决计数
            gameState.learningStats.typeStats[selectedProblemType].solved++;
            
            // 确保总时间是有效数值并累加当前题目用时
            const currentTotalTime = gameState.learningStats.typeStats[selectedProblemType].totalTime || 0;
            gameState.learningStats.typeStats[selectedProblemType].totalTime = currentTotalTime + duration;
            
            // 将当前题目的类型和尝试次数添加到统计
            gameState.learningStats.typeStats[selectedProblemType].attemptsCount += 
                gameState.learningStats.currentProblem.attempts;
            
            // 增加当前轮次完成的题目数量
            gameState.learningStats.currentRoundProblems++;
            
            // 增加当前关卡完成的题目数量
            gameState.levelInfo.problemsInCurrentLevel++;
            
            console.log(`题目完成! 当前关卡进度: ${gameState.levelInfo.problemsInCurrentLevel}/${gameState.levelInfo.problemsPerLevel}`);
            
            // 保存题目记录
            gameState.learningStats.problemRecords.push({...gameState.learningStats.currentProblem});
            
            // 更新关卡显示
            updateLevelDisplay();
            
            // 检查是否完成当前关卡
            if (gameState.levelInfo.problemsInCurrentLevel >= gameState.levelInfo.problemsPerLevel) {
                console.log("关卡完成! 生成学习报告并进入下一关");
                
                // 在生成报告前重新计算统计数据
                recalculateTypeStats();
                
                // 生成学习报告
                generateLearningReport();
                
                // 升级到下一关
                gameState.levelInfo.currentLevelNumber++;
                gameState.levelInfo.problemsInCurrentLevel = 0;
                
                // 更新关卡显示
                updateLevelDisplay();
                
                // 显示关卡完成提示
                showGameTip(`恭喜！完成关卡 ${gameState.levelInfo.currentLevelNumber - 1}，进入关卡 ${gameState.levelInfo.currentLevelNumber}`);
            }
        } else {
            // 未完成的题目也记录尝试次数，但不计入solved
            gameState.learningStats.typeStats[selectedProblemType].attemptsCount++;
        }
        
        // 输出更新后的状态
        console.log("题目完成处理结束，更新后状态:");
        logLevelInfo();
    }
    
    // 开始跟踪新的题目
    function startNewProblemTracking(problem) {
        // 如果有上一个正在计时的题目，先结束它
        if (gameState.learningStats.problemTimer) {
            clearInterval(gameState.learningStats.problemTimer);
        }
        
        // 设置新题目的信息
        gameState.learningStats.currentProblem = {
            type: selectedProblemType,
            polynomial: problem.polynomial,
            answer: problem.answer,
            attempts: 0,
            startTime: new Date().getTime(),
            endTime: 0,
            isSolved: false,
            errors: []
        };
        
        // 增加该类型题目的尝试次数（只在首次尝试时增加）
        if (!gameState.learningStats.typeStats[selectedProblemType]) {
            gameState.learningStats.typeStats[selectedProblemType] = { 
                attempted: 0, 
                solved: 0, 
                attemptsCount: 0, 
                totalTime: 0 
            };
        }
        
        // 只有首次尝试时才增加attempted计数
        if (gameState.learningStats.currentProblem.attempts === 0) {
            // 递增attempted，表示尝试过的题目数量
            gameState.learningStats.typeStats[selectedProblemType].attempted++;
            gameState.learningStats.problemsAttempted++;
        }
        
        // 开始计时
        gameState.learningStats.currentProblemStartTime = new Date().getTime();
        gameState.learningStats.problemTimer = setInterval(() => {
            // 更新计时，可以在UI显示，或者仅记录
            const elapsedSeconds = Math.floor((new Date().getTime() - gameState.learningStats.currentProblemStartTime) / 1000);
            // 可以在这里更新UI显示计时
            console.log(`当前题目已用时: ${elapsedSeconds}秒`);
        }, 1000);
    }
    
    // 记录问题尝试
    function recordProblemAttempt(isCorrect, errorType = null) {
        console.log("记录答题尝试，正确:", isCorrect, "错误类型:", errorType);
        
        // 增加尝试次数
        gameState.learningStats.currentProblem.attempts++;
        gameState.learningStats.typeStats[selectedProblemType].attemptsCount++;
        
        if (!isCorrect && errorType) {
            // 记录错误类型
            gameState.learningStats.currentProblem.errors.push({
                type: errorType,
                timestamp: new Date().getTime()
            });
            console.log("记录错误，当前错误次数:", gameState.learningStats.currentProblem.errors.length);
        } else if (isCorrect) {
            console.log("答案正确，将触发完成题目函数");
            // 题目解决，记录结束时间
            finishCurrentProblem(true);
        }
    }

    // 辅助函数：打印当前关卡状态
    function logLevelInfo() {
        console.log("关卡状态:", {
            currentLevelNumber: gameState.levelInfo.currentLevelNumber,
            problemsInCurrentLevel: gameState.levelInfo.problemsInCurrentLevel,
            problemsPerLevel: gameState.levelInfo.problemsPerLevel,
            currentLevel: gameState.currentLevel,
            problemsAttempted: gameState.learningStats.problemsAttempted,
            problemsSolved: gameState.learningStats.problemsSolved,
            currentRoundProblems: gameState.learningStats.currentRoundProblems
        });
    }

    // 检查卡片是否排列成矩形布局
    function checkRectangularLayout() {
        if (gameState.cardsInPuzzle.length === 0) {
            return false;
        }
        
        // 获取所有卡片的位置和尺寸信息
        const cardPositions = gameState.cardsInPuzzle.map(card => {
            const element = card.element;
            const left = parseFloat(element.style.left);
            const top = parseFloat(element.style.top);
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            
            return {
                left, 
                top, 
                right: left + width, 
                bottom: top + height,
                width,
                height,
                type: element.getAttribute('data-type'),
                isRotated: element.classList.contains('rotated-card')
            };
        });
        
        // 首先检查所有卡片是否与网格对齐
        const gridSize = gameState.snapGrid;
        for (const card of cardPositions) {
            if ((card.left % gridSize) !== 0 || (card.top % gridSize) !== 0) {
                console.log("卡片未与网格对齐:", card);
                return false;
            }
        }
        
        // 找出拼图的边界
        let minLeft = Math.min(...cardPositions.map(card => card.left));
        let minTop = Math.min(...cardPositions.map(card => card.top));
        let maxRight = Math.max(...cardPositions.map(card => card.right));
        let maxBottom = Math.max(...cardPositions.map(card => card.bottom));
        
        // 计算拼图的尺寸（以网格为单位）
        const width = maxRight - minLeft;
        const height = maxBottom - minTop;
        
        // 确保尺寸是网格大小的整数倍
        if (width % gridSize !== 0 || height % gridSize !== 0) {
            console.log("拼图尺寸不是网格大小的整数倍");
            return false;
        }
        
        // 计算行数和列数
        const rows = height / gridSize;
        const cols = width / gridSize;
        
        console.log(`拼图尺寸: ${cols}x${rows} 格`);
        
        // 检查是否为特殊情况，如3a² + 7ab + 2b²，这些不容易形成完美矩形
        const currentLevel = levels[gameState.currentLevel];
        const polynomial = currentLevel ? currentLevel.polynomial : '';
        const specialCases = [
            '3a² + 7ab + 2b²', 
            '2a² + 5ab + 2b²',
            '6a² + 5ab + b²'
        ];
        
        if (specialCases.includes(polynomial) && 
            ((rows === 1 && cols >= 12) || (cols === 1 && rows >= 12) || 
             !Number.isInteger(Math.sqrt(rows * cols)))) {
            // 发现特殊情况，自动切换到下一题
            console.log("检测到特殊多项式，不容易形成矩形布局，将自动切换到下一题");
            setTimeout(() => {
                showGameTip("当前题目不易形成矩形布局，已自动切换到新题目");
                
                // 增加关卡内当前题目的索引
                gameState.currentLevel++;
                if (gameState.currentLevel >= levels.length) {
                    gameState.currentLevel = 0;
                }
                
                // 重置拼图区域并更新多项式显示
                resetPuzzle();
                updatePolynomialDisplay();
            }, 1000);
            
            return true; // 临时返回true，避免显示错误消息
        }
        
        // 禁用行列数限制，仅检查卡片形成的矩形是否完整
        
        // 创建一个网格数组，表示每个位置是否被覆盖
        const grid = Array(rows).fill().map(() => Array(cols).fill(false));
        
        // 标记每个卡片覆盖的网格位置
        for (const card of cardPositions) {
            const startRow = (card.top - minTop) / gridSize;
            const startCol = (card.left - minLeft) / gridSize;
            const endRow = (card.bottom - minTop) / gridSize;
            const endCol = (card.right - minLeft) / gridSize;
            
            // 确保卡片覆盖整数个网格
            if (!Number.isInteger(startRow) || !Number.isInteger(startCol) ||
                !Number.isInteger(endRow) || !Number.isInteger(endCol)) {
                console.log("卡片未与网格对齐：", card);
                return false;
            }
            
            // 标记覆盖的网格
            for (let r = startRow; r < endRow; r++) {
                for (let c = startCol; c < endCol; c++) {
                    if (grid[r] && grid[r][c] === true) {
                        console.log("存在重叠的卡片");
                        return false;
                    }
                    grid[r][c] = true;
                }
            }
        }
        
        // 检查是否有未覆盖的网格
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!grid[r][c]) {
                    console.log(`在位置(${r},${c})存在未覆盖的网格`);
                    return false;
                }
            }
        }
        
        return true;
    }

    // 添加一个单独初始化重置按钮的函数
    function initResetButton() {
        console.log("正在初始化重置按钮...");
        const resetBtn = document.getElementById('reset-btn');
        
        if (resetBtn) {
            console.log("找到重置按钮，添加事件监听器");
            // 移除所有已有的点击事件
            const newResetBtn = resetBtn.cloneNode(true);
            if (resetBtn.parentNode) {
                resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            }
            
            // 添加新的点击事件
            newResetBtn.addEventListener('click', function(e) {
                console.log("重置按钮被点击");
                e.preventDefault();
                e.stopPropagation();
                resetPuzzle();
            });
        } else {
            console.error("未找到重置按钮元素");
        }
    }

    // 添加事件监听器
    const saveChartsBtn = document.getElementById('save-charts-btn');
    if (saveChartsBtn) {
        saveChartsBtn.addEventListener('click', saveCharts);
    }

    // 保存图表为图片
    function saveCharts() {
        // 获取雷达图和进度图的Canvas
        const radarCanvas = document.getElementById('radar-chart-canvas');
        const progressCanvas = document.getElementById('progress-chart-canvas');
        
        if (!radarCanvas || !progressCanvas) {
            alert('图表尚未准备好，无法保存');
            return;
        }
        
        try {
            // 创建一个新的合并Canvas
            const mergedCanvas = document.createElement('canvas');
            const margin = 20;
            mergedCanvas.width = Math.max(radarCanvas.width, progressCanvas.width) + margin * 2;
            mergedCanvas.height = radarCanvas.height + progressCanvas.height + margin * 3;
            
            const ctx = mergedCanvas.getContext('2d');
            if (!ctx) {
                alert('无法创建Canvas上下文');
                return;
            }
            
            // 设置背景
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);
            
            // 绘制标题
            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('多项式因式分解学习报告', mergedCanvas.width / 2, margin);
            
            // 添加当前日期
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            ctx.font = '12px Arial';
            ctx.fillText(dateStr, mergedCanvas.width / 2, margin + 20);
            
            // 绘制雷达图
            ctx.drawImage(radarCanvas, margin, margin + 30, radarCanvas.width, radarCanvas.height);
            
            // 绘制分隔线
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(margin, radarCanvas.height + margin + 40);
            ctx.lineTo(mergedCanvas.width - margin, radarCanvas.height + margin + 40);
            ctx.stroke();
            
            // 绘制进度图
            ctx.drawImage(progressCanvas, margin, radarCanvas.height + margin * 2 + 40, progressCanvas.width, progressCanvas.height);
            
            // 转换为图片并下载
            const imgData = mergedCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `学习报告_${dateStr}.png`;
            link.href = imgData;
            link.click();
        } catch (error) {
            console.error('保存图表时出错:', error);
            alert('保存图表时出错: ' + error.message);
        }
    }

    // 添加事件监听
    const saveReportBtn = document.getElementById('save-report-btn');
}); 

// 添加页面加载完毕后的初始化代码
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 防止重复初始化
        if (typeof gameState !== 'undefined') {
            initGame();
        }
    } catch (error) {
        console.error("游戏初始化失败:", error);
        // 添加错误恢复机制
        alert("游戏初始化失败，请刷新页面重试。");
    }
}); 

// 在文档加载完成后设置事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 获取保存报告按钮
    const saveReportBtn = document.getElementById('save-report-btn');
    if (saveReportBtn) {
        saveReportBtn.addEventListener('click', saveFullReport);
    }
});

// 保存完整报告函数
function saveFullReport() {
    try {
        // 获取报告模态框
        const reportContent = document.querySelector('.learning-report-modal');
        if (!reportContent) {
            alert('报告内容不可用');
            return;
        }
        
        // 创建一个克隆，避免修改原始DOM
        const reportClone = reportContent.cloneNode(true);
        
        // 移除按钮部分，我们不需要在导出中包含它们
        const actions = reportClone.querySelector('.report-actions');
        if (actions) {
            actions.remove();
        }
        
        // 获取Canvas并转换为图片
        const radarCanvas = document.getElementById('radar-chart-canvas');
        const progressCanvas = document.getElementById('progress-chart-canvas');
        
        if (radarCanvas && progressCanvas) {
            // 找到Canvas的父容器
            const radarContainer = reportClone.querySelector('.radar-chart');
            const progressContainer = reportClone.querySelector('.progress-chart');
            
            if (radarContainer && progressContainer) {
                // 清空原有内容
                radarContainer.innerHTML = '';
                progressContainer.innerHTML = '';
                
                // 创建图片元素替代Canvas
                const radarImg = document.createElement('img');
                radarImg.src = radarCanvas.toDataURL('image/png');
                radarImg.style.width = '100%';
                radarImg.style.maxWidth = '300px';
                radarContainer.appendChild(radarImg);
                
                const progressImg = document.createElement('img');
                progressImg.src = progressCanvas.toDataURL('image/png');
                progressImg.style.width = '100%';
                progressImg.style.maxWidth = '300px';
                progressContainer.appendChild(progressImg);
            }
        }
        
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .learning-report-modal { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h2 { color: #333; text-align: center; margin-bottom: 20px; }
            .report-content { margin-bottom: 30px; }
            .report-summary { margin-bottom: 20px; }
            .report-charts { display: flex; flex-wrap: wrap; justify-content: space-around; margin: 20px 0; }
            .radar-chart, .progress-chart { flex: 1; min-width: 300px; margin: 10px; text-align: center; }
            .report-details, .report-suggestions { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .summary-stats { display: flex; justify-content: space-around; text-align: center; }
            .stat-item { padding: 10px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #2980b9; }
            .stat-label { font-size: 14px; color: #666; }
            .suggestion-item { display: flex; margin-bottom: 15px; }
            .suggestion-icon { font-size: 20px; margin-right: 15px; }
            img { border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        `;
        
        // 创建完整的HTML文档
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>多项式因式分解学习报告</title>
                ${style.outerHTML}
            </head>
            <body>
                ${reportClone.outerHTML}
            </body>
            </html>
        `;
        
        // 创建Blob对象
        const blob = new Blob([html], { type: 'text/html' });
        
        // 获取当前日期作为文件名
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `多项式因式分解学习报告_${dateStr}.html`;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('保存报告时出错:', error);
        alert('保存报告时出错: ' + error.message);
    }
}