#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
金课问卷数据分析系统 - 主程序入口

作者: 数据分析团队
创建时间: 2024年11月20日
"""

import os
import sys
import logging
from pathlib import Path
from typing import Optional

# 添加项目根目录到Python路径
project_root = Path(__file__).parent
sys.path.append(str(project_root))

from src.core.data_loader import DataLoader
from src.core.data_cleaner import DataCleaner
from src.core.analyzer import StatisticalAnalyzer, ReliabilityAnalyzer
from src.core.visualizer import Visualizer
from src.utils.config import AnalysisConfig
from src.utils.helpers import setup_logging, create_directory


class QuestionnaireAnalyzer:
    """问卷分析主接口类"""

    def __init__(self, data_path: str, variables_path: str, config: Optional[dict] = None):
        """
        初始化问卷分析器

        Args:
            data_path: 数据文件路径
            variables_path: 变量表文件路径
            config: 自定义配置参数
        """
        self.config = AnalysisConfig()
        if config:
            self.config.update(config)

        # 设置日志
        setup_logging(self.config.LOG_LEVEL)
        self.logger = logging.getLogger(__name__)

        # 初始化组件
        self.loader = DataLoader(data_path, variables_path)
        self.cleaner = None
        self.statistical_analyzer = None
        self.reliability_analyzer = None
        self.visualizer = Visualizer(style=self.config.VISUALIZATION_STYLE)

        # 数据存储
        self.data = None
        self.variables = None
        self.results = {}

        self.logger.info("问卷分析器初始化完成")

    def load_data(self) -> bool:
        """
        加载和验证数据

        Returns:
            bool: 加载是否成功
        """
        try:
            self.logger.info("开始加载数据...")

            # 加载数据
            self.data, self.variables = self.loader.load_data()

            # 验证数据
            if not self.loader.validate_data():
                raise ValueError("数据验证失败")

            self.logger.info(f"数据加载成功: 数据表{self.data.shape}, 变量表{self.variables.shape}")
            return True

        except Exception as e:
            self.logger.error(f"数据加载失败: {e}")
            return False

    def clean_data(self) -> bool:
        """
        数据清洗

        Returns:
            bool: 清洗是否成功
        """
        try:
            self.logger.info("开始数据清洗...")

            self.cleaner = DataCleaner(self.data)

            # 处理缺失值
            self.data = self.cleaner.handle_missing_values(
                strategy=self.config.MISSING_VALUE_STRATEGY
            )

            # 检测和处理异常值
            outlier_mask = self.cleaner.detect_outliers(
                method=self.config.OUTLIER_DETECTION_METHOD
            )
            self.data = self.data[~outlier_mask]

            # 验证量表一致性
            consistency_results = self.cleaner.validate_scale_consistency()
            self.results['data_quality'] = consistency_results

            self.logger.info(f"数据清洗完成: 处理后数据{self.data.shape}")
            return True

        except Exception as e:
            self.logger.error(f"数据清洗失败: {e}")
            return False

    def run_statistical_analysis(self):
        """运行统计分析"""
        try:
            self.logger.info("开始统计分析...")

            # 初始化分析器
            self.statistical_analyzer = StatisticalAnalyzer(self.data)
            self.reliability_analyzer = ReliabilityAnalyzer(self.data)

            # 描述性统计
            self.results['descriptive_stats'] = self.statistical_analyzer.descriptive_statistics()

            # 相关性分析
            self.results['correlation'], self.results['correlation_p_values'] = \
                self.statistical_analyzer.correlation_analysis()

            # 分组比较
            for group_var in ['性别', '年级', '专业']:
                if group_var in self.data.columns:
                    self.results[f'group_comparison_{group_var}'] = \
                        self.statistical_analyzer.group_comparison(group_var)

            # 信度分析
            self.results['reliability'] = self._analyze_reliability()

            self.logger.info("统计分析完成")

        except Exception as e:
            self.logger.error(f"统计分析失败: {e}")

    def _analyze_reliability(self):
        """分析各量表的信度"""
        reliability_results = {}

        # 定义量表维度
        scales = {
            '实践环节强度': ['实践环节强度1', '实践环节强度2', '实践环节强度3'],
            '考核方式合理性': ['考核方式合理性1', '考核方式合理性2', '考核方式合理性3'],
            '数字技术融合度': ['数字技术融合度1', '数字技术融合度2', '数字技术融合度3'],
            '数字技术接受度': ['数字技术接受度1', '数字技术接受度2', '数字技术接受度3'],
            '学习参与度': ['学习参与度1', '学习参与度2', '学习参与度3']
        }

        for scale_name, items in scales.items():
            # 检查题目是否存在于数据中
            available_items = [item for item in items if item in self.data.columns]
            if len(available_items) >= 2:
                alpha = self.reliability_analyzer.cronbach_alpha(available_items)
                item_analysis = self.reliability_analyzer.item_analysis(available_items)

                reliability_results[scale_name] = {
                    'cronbach_alpha': alpha,
                    'item_count': len(available_items),
                    'item_analysis': item_analysis,
                    'reliability_level': self._interpret_alpha(alpha)
                }

        return reliability_results

    def _interpret_alpha(self, alpha: float) -> str:
        """解释信度水平"""
        if alpha >= 0.9:
            return "极佳"
        elif alpha >= 0.8:
            return "良好"
        elif alpha >= 0.7:
            return "可接受"
        elif alpha >= 0.6:
            return "勉强接受"
        else:
            return "不可接受"

    def generate_visualizations(self, output_dir: str):
        """生成可视化图表"""
        try:
            self.logger.info("开始生成可视化图表...")

            viz_dir = os.path.join(output_dir, 'visualizations')
            create_directory(viz_dir)

            # 满意度分布图
            satisfaction_cols = [col for col in self.data.columns if '满意度' in col]
            if satisfaction_cols:
                self.visualizer.plot_distribution(
                    self.data[satisfaction_cols].mean(axis=1),
                    "总体满意度分布",
                    save_path=os.path.join(viz_dir, 'satisfaction_distribution.png')
                )

            # 相关性热力图
            if 'correlation' in self.results:
                self.visualizer.plot_correlation_heatmap(
                    self.results['correlation'],
                    save_path=os.path.join(viz_dir, 'correlation_heatmap.png')
                )

            # 分组比较图
            for group_var in ['性别', '年级']:
                if group_var in self.data.columns and f'group_comparison_{group_var}' in self.results:
                    self.visualizer.plot_group_comparison(
                        self.results[f'group_comparison_{group_var}'],
                        group_var,
                        save_path=os.path.join(viz_dir, f'group_comparison_{group_var}.png')
                    )

            self.logger.info(f"可视化图表已保存到: {viz_dir}")

        except Exception as e:
            self.logger.error(f"生成可视化图表失败: {e}")

    def run_full_analysis(self, output_dir: str = 'output') -> dict:
        """
        运行完整分析流程

        Args:
            output_dir: 输出目录

        Returns:
            dict: 分析结果
        """
        try:
            self.logger.info("开始完整分析流程...")

            # 创建输出目录
            create_directory(output_dir)

            # 1. 数据加载
            if not self.load_data():
                raise RuntimeError("数据加载失败")

            # 2. 数据清洗
            if not self.clean_data():
                raise RuntimeError("数据清洗失败")

            # 3. 统计分析
            self.run_statistical_analysis()

            # 4. 生成可视化
            self.generate_visualizations(output_dir)

            # 5. 保存结果
            self._save_results(output_dir)

            self.logger.info(f"完整分析流程完成，结果已保存到: {output_dir}")
            return self.results

        except Exception as e:
            self.logger.error(f"分析流程失败: {e}")
            raise

    def _save_results(self, output_dir: str):
        """保存分析结果"""
        import json
        import pandas as pd

        # 保存统计结果
        if 'descriptive_stats' in self.results:
            self.results['descriptive_stats'].to_csv(
                os.path.join(output_dir, 'descriptive_statistics.csv'),
                encoding='utf-8-sig'
            )

        if 'correlation' in self.results:
            self.results['correlation'].to_csv(
                os.path.join(output_dir, 'correlation_matrix.csv'),
                encoding='utf-8-sig'
            )

        # 保存信度分析结果
        if 'reliability' in self.results:
            with open(os.path.join(output_dir, 'reliability_analysis.json'),
                     'w', encoding='utf-8') as f:
                json.dump(self.results['reliability'], f, ensure_ascii=False, indent=2)

        # 保存完整结果字典
        with open(os.path.join(output_dir, 'analysis_results.json'),
                 'w', encoding='utf-8') as f:
            # 转换numpy类型为Python原生类型以便JSON序列化
            serializable_results = self._make_serializable(self.results.copy())
            json.dump(serializable_results, f, ensure_ascii=False, indent=2)

    def _make_serializable(self, obj):
        """将对象转换为JSON可序列化格式"""
        import numpy as np
        import pandas as pd

        if isinstance(obj, dict):
            return {k: self._make_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._make_serializable(item) for item in obj]
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.int64, np.int32, np.int16, np.int8)):
            return int(obj)
        elif isinstance(obj, (np.float64, np.float32)):
            return float(obj)
        elif isinstance(obj, pd.DataFrame):
            return obj.to_dict()
        elif isinstance(obj, pd.Series):
            return obj.to_dict()
        else:
            return obj


def main():
    """主函数"""
    # 文件路径
    data_path = "数据(1).csv"
    variables_path = "变量表.csv"

    try:
        # 初始化分析器
        analyzer = QuestionnaireAnalyzer(data_path, variables_path)

        # 运行完整分析
        results = analyzer.run_full_analysis(output_dir='analysis_results')

        print("✅ 问卷数据分析完成！")
        print(f"📊 结果已保存到 'analysis_results' 目录")
        print(f"📈 共处理 {analyzer.data.shape[0]} 条调查记录")

        # 显示关键结果
        if 'reliability' in results:
            print("\n📋 量表信度分析结果:")
            for scale, info in results['reliability'].items():
                alpha = info['cronbach_alpha']
                level = info['reliability_level']
                print(f"  {scale}: α = {alpha:.3f} ({level})")

    except Exception as e:
        print(f"❌ 分析失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()