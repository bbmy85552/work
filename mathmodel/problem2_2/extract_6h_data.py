#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
6H-SiC数据提取脚本
从附件文件中提取所有6H晶型数据并保存为xlsx格式
"""

import pandas as pd
import numpy as np
import os

def extract_6h_data(attachment_dir):
    """提取所有6H-SiC晶型数据并保存为xlsx格式"""

    print("=" * 60)
    print("6H-SiC晶型数据提取工具")
    print("=" * 60)

    # 定义数据文件信息
    data_files = {
        '附件1.csv': {
            'description': '10°入射角6H-SiC反射率数据',
            'incident_angle': 10,
            'sheet_name': '10度入射角'
        },
        '附件2.csv': {
            'description': '15°入射角6H-SiC反射率数据',
            'incident_angle': 15,
            'sheet_name': '15度入射角'
        },
        '附件3.csv': {
            'description': '6H-SiC反射率数据 - 条件3',
            'incident_angle': None,
            'sheet_name': '数据文件3'
        },
        '附件4.csv': {
            'description': '6H-SiC反射率数据 - 条件4',
            'incident_angle': None,
            'sheet_name': '数据文件4'
        }
    }

    # 创建Excel写入器
    output_file = os.path.join(current_dir, '6H_SiC_数据汇总.xlsx')
    writer = pd.ExcelWriter(output_file, engine='openpyxl')

    # 存储所有数据用于创建汇总表
    all_data = {}

    try:
        # 处理每个数据文件
        for filename, info in data_files.items():
            file_path = os.path.join(attachment_dir, filename)

            if not os.path.exists(file_path):
                print(f"⚠️ 文件不存在: {file_path}")
                continue

            print(f"\n📂 处理文件: {filename}")
            print(f"   描述: {info['description']}")

            # 读取CSV数据
            df = pd.read_csv(file_path)

            # 添加元数据列
            df['晶型'] = '6H-SiC'
            df['材料'] = 'SiC'
            df['入射角(度)'] = info['incident_angle']
            df['数据描述'] = info['description']

            # 重新排列列顺序
            columns_order = ['晶型', '材料', '入射角(度)', '数据描述', '波数 (cm-1)', '反射率 (%)']
            df = df[columns_order]

            # 保存到Excel工作表
            df.to_excel(writer, sheet_name=info['sheet_name'], index=False)

            # 存储数据用于汇总
            all_data[info['sheet_name']] = df

            # 显示数据统计信息
            print(f"   数据点数: {len(df)}")
            print(f"   波数范围: {df['波数 (cm-1)'].min():.1f} - {df['波数 (cm-1)'].max():.1f} cm⁻¹")
            print(f"   反射率范围: {df['反射率 (%)'].min():.2f} - {df['反射率 (%)'].max():.2f}%")

            if info['incident_angle']:
                print(f"   入射角: {info['incident_angle']}°")

        # 创建数据汇总表
        print(f"\n📊 创建数据汇总表...")
        summary_data = []

        for sheet_name, df in all_data.items():
            summary_row = {
                '工作表名称': sheet_name,
                '数据描述': df['数据描述'].iloc[0],
                '晶型': df['晶型'].iloc[0],
                '材料': df['材料'].iloc[0],
                '入射角(度)': df['入射角(度)'].iloc[0] if pd.notna(df['入射角(度)'].iloc[0]) else '未指定',
                '数据点数量': len(df),
                '波数最小值(cm⁻¹)': df['波数 (cm-1)'].min(),
                '波数最大值(cm⁻¹)': df['波数 (cm-1)'].max(),
                '波数范围(cm⁻¹)': df['波数 (cm-1)'].max() - df['波数 (cm-1)'].min(),
                '反射率最小值(%)': df['反射率 (%)'].min(),
                '反射率最大值(%)': df['反射率 (%)'].max(),
                '反射率平均值(%)': df['反射率 (%)'].mean(),
                '反射率标准差(%)': df['反射率 (%)'].std()
            }
            summary_data.append(summary_row)

        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='数据汇总', index=False)

        # 创建6H-SiC技术参数表
        print(f"🔬 创建6H-SiC技术参数表...")
        tech_params = {
            '参数名称': ['晶型', '材料', 'Sellmeier系数B1', 'Sellmeier系数B2', 'Sellmeier系数B3',
                       'Sellmeier系数C1', 'Sellmeier系数C2', 'Sellmeier系数C3',
                       '典型厚度范围', '典型波数间隔范围', '测量方法'],
            '参数值': ['6H-SiC', '碳化硅', '6.6406', '0.4530', '2.9161',
                      '0.0174', '1.2480', '279.920',
                      '5-20 μm', '400-800 cm⁻¹', '红外反射光谱法'],
            '单位': ['-', '-', '-', '-', '-',
                    'μm²', 'μm²', 'μm²',
                    'μm', 'cm⁻¹', '-'],
            '说明': ['六方碳化硅6H晶型', '半导体材料', 'Sellmeier方程系数', 'Sellmeier方程系数', 'Sellmeier方程系数',
                    'Sellmeier方程系数', 'Sellmeier方程系数', 'Sellmeier方程系数',
                    '外延层典型厚度', '干涉峰典型间隔', '非接触式测量']
        }

        tech_df = pd.DataFrame(tech_params)
        tech_df.to_excel(writer, sheet_name='6H-SiC技术参数', index=False)

        # 保存Excel文件
        writer.close()

        print(f"\n✅ 数据提取完成!")
        print(f"📁 输出文件: {output_file}")
        print(f"📊 包含工作表:")

        for sheet_name in all_data.keys():
            print(f"   - {sheet_name}")
        print(f"   - 数据汇总")
        print(f"   - 6H-SiC技术参数")

        # 显示汇总统计
        print(f"\n📈 数据统计汇总:")
        total_points = sum(len(df) for df in all_data.values())
        print(f"   总数据点数: {total_points:,}")
        print(f"   数据文件数: {len(all_data)}")
        print(f"   晶型: 6H-SiC (100%)")

        return output_file

    except Exception as e:
        print(f"❌ 处理过程中发生错误: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    # 设置正确的路径
    current_dir = os.getcwd()
    print(f"当前目录: {current_dir}")

    # 检查附件目录
    attachment_dir = '../附件'
    if not os.path.exists(attachment_dir):
        attachment_dir = os.path.join(current_dir, 'mathmodel', '附件')
    if not os.path.exists(attachment_dir):
        attachment_dir = os.path.join(current_dir, '..', 'mathmodel', '附件')

    if not os.path.exists(attachment_dir):
        print(f"找不到附件目录: {attachment_dir}")
        exit(1)

    print(f"使用附件目录: {attachment_dir}")

    # 执行数据提取
    result = extract_6h_data(attachment_dir)

    if result:
        print(f"\n🎯 6H-SiC数据已成功提取并保存为: {result}")
    else:
        print(f"\n❌ 数据提取失败")