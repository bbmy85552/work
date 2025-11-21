# 金课问卷数据分析系统

## 项目简介

这是一个基于Python开发的金课程问卷调查数据分析系统，能够处理学生参与度、学习感知、满意度等多维度调查数据，提供完整的数据清洗、统计分析、可视化等功能。

## 数据概况

- **调查样本**: 579名学生
- **题目数量**: 42个题目项目
- **潜变量维度**: 11个核心维度
- **数据字段**: 47个分析字段

### 主要数据维度

1. **人口统计学变量**: 性别、年级、专业、政治身份、学生干部
2. **满意度维度**: 教学方式、学习内容、学习环境等5个方面
3. **学习期望维度**: 专业技能、专业知识、实践机会等5个方面
4. **学习感知维度**: 内容充实、学习负担、资源丰富等6个方面
5. **学习表现维度**: 参与讨论、完成任务、掌握内容等5个方面
6. **量表维度**: 15个题目，分属5个潜变量

## 快速开始

### 环境要求

- Python 3.8+
- 内存: 最低4GB，推荐8GB+

### 安装依赖

```bash
# 激活虚拟环境
cd /Users/2dqy003/Projects/work
source .venv/bin/activate

# 安装依赖
cd questionnaire
pip install pandas numpy matplotlib seaborn scipy scikit-learn openpyxl
```

### 基本使用

```python
# 运行完整分析
python main.py

# 或者使用交互式分析
from main import QuestionnaireAnalyzer

analyzer = QuestionnaireAnalyzer(
    data_path='数据(1).csv',
    variables_path='变量表.csv'
)

results = analyzer.run_full_analysis(output_dir='my_results')
```

## 项目结构

```
questionnaire/
├── README.md                    # 项目说明
├── 技术文档_问卷数据分析系统.md  # 详细技术文档
├── main.py                     # 主程序入口
├── convert_excel_to_csv.py     # Excel转CSV工具
├── 数据(1).csv                 # 原始调查数据
├── 变量表.csv                   # 变量定义表
├── src/                        # 源代码目录
│   ├── core/                   # 核心模块
│   │   ├── data_loader.py      # 数据加载器
│   │   ├── data_cleaner.py     # 数据清洗器
│   │   ├── analyzer.py         # 数据分析器
│   │   └── visualizer.py       # 可视化器
│   ├── models/                 # 分析模型
│   │   ├── reliability.py      # 信度分析
│   │   ├── validity.py         # 效度分析
│   │   └── statistics.py       # 统计分析
│   └── utils/                  # 工具模块
│       ├── config.py           # 配置管理
│       └── helpers.py          # 辅助函数
├── analysis_results/           # 分析结果输出目录
│   ├── descriptive_statistics.csv  # 描述性统计
│   ├── correlation_matrix.csv      # 相关性矩阵
│   ├── reliability_analysis.json   # 信度分析
│   ├── analysis_results.json       # 完整结果
│   └── visualizations/             # 可视化图表
└── tests/                      # 测试代码
```

## 核心功能

### 1. 数据处理
- ✅ Excel文件自动转换为CSV
- ✅ 合并单元格处理
- ✅ 缺失值检测与处理
- ✅ 异常值识别
- ✅ 数据质量验证

### 2. 统计分析
- ✅ 描述性统计分析
- ✅ 相关性分析
- ✅ 分组比较分析
- ✅ 信度分析 (Cronbach's Alpha)
- ✅ 项目分析

### 3. 可视化
- ✅ 分布图
- ✅ 相关性热力图
- ✅ 分组比较图
- ✅ 信度分析结果图

### 4. 结果输出
- ✅ CSV格式统计结果
- ✅ JSON格式详细结果
- ✅ PNG格式图表
- ✅ 分析报告

## 分析方法

### 信度分析
使用Cronbach's Alpha系数评估量表内部一致性：
- α ≥ 0.9: 极佳
- 0.8 ≤ α < 0.9: 良好
- 0.7 ≤ α < 0.8: 可接受
- 0.6 ≤ α < 0.7: 勉强接受
- α < 0.6: 不可接受

### 统计检验
- **相关性分析**: Pearson相关系数
- **显著性水平**: p < 0.05
- **分组比较**: t检验/方差分析

## 技术特色

1. **模块化设计**: 清晰的代码结构，易于维护和扩展
2. **异常处理**: 完善的错误处理和日志记录
3. **配置灵活**: 支持自定义分析参数
4. **内存优化**: 高效的数据处理算法
5. **结果完整**: 多种格式的分析结果输出

## 使用示例

### 示例1: 基本分析
```python
from main import QuestionnaireAnalyzer

# 初始化
analyzer = QuestionnaireAnalyzer('数据(1).csv', '变量表.csv')

# 运行分析
results = analyzer.run_full_analysis()

# 查看信度分析结果
for scale, info in results['reliability'].items():
    print(f"{scale}: α = {info['cronbach_alpha']:.3f}")
```

### 示例2: 自定义分析
```python
# 只进行信度分析
analyzer.load_data()
analyzer.clean_data()
analyzer.run_statistical_analysis()

# 获取特定量表信度
scales = ['实践环节强度1', '实践环节强度2', '实践环节强度3']
alpha = analyzer.reliability_analyzer.cronbach_alpha(scales)
print(f"实践环节强度信度: {alpha:.3f}")
```

### 示例3: 可视化
```python
# 生成满意度分布图
analyzer.visualizer.plot_distribution(
    analyzer.data['满意度—教学方式'],
    title="教学方式满意度分布"
)
```

## 输出文件说明

### 统计结果文件
- `descriptive_statistics.csv`: 包含所有变量的描述性统计
- `correlation_matrix.csv`: 变量间相关系数矩阵
- `reliability_analysis.json`: 各量表的信度分析结果

### 可视化图表
- `satisfaction_distribution.png`: 满意度分布图
- `correlation_heatmap.png`: 相关性热力图
- `group_comparison_*.png`: 分组比较图

### 完整结果
- `analysis_results.json`: 包含所有分析结果的JSON文件

## 扩展功能

### 机器学习分析
```python
# 聚类分析识别学生群体
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(scaled_data)
```

### 高级统计
```python
# 主成分分析
from sklearn.decomposition import PCA
pca = PCA(n_components=5)
principal_components = pca.fit_transform(data)
```

## 常见问题

### Q: 如何处理缺失值？
A: 系统提供多种缺失值处理策略，包括均值填充、中位数填充、众数填充等，可在配置文件中设置。

### Q: 信度系数过低怎么办？
A: 检查题目表述是否清晰，删除区分度较低的题目，或考虑重新设计量表。

### Q: 如何添加新的分析方法？
A: 在相应模块中添加新的分析方法，或继承现有类进行扩展。

## 技术支持

- **文档**: 查看 `技术文档_问卷数据分析系统.md` 获取详细技术说明
- **示例代码**: 参考 `main.py` 中的完整使用示例
- **问题反馈**: 通过项目Issues提交问题和建议

## 更新日志

### v1.0.0 (2024-11-20)
- ✅ 完成基础数据分析框架
- ✅ 实现信度分析功能
- ✅ 添加可视化支持
- ✅ 完善文档和示例

---

**开发团队**: 数据分析团队
**最后更新**: 2024年11月20日
**版本**: v1.0.0