#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
问题一测试：碳化硅外延层厚度计算
"""

import pandas as pd
import numpy as np

class ThicknessCalculator:
    """厚度计算器"""

    def __init__(self):
        # 6H-SiC Sellmeier方程系数
        self.B = [6.6406, 0.4530, 2.9161]
        self.C = [0.0174, 1.2480, 279.920]

    def sellmeier_n(self, wavelength_um):
        """计算碳化硅折射率"""
        n_squared = 1.0
        for i in range(3):
            n_squared += self.B[i] * wavelength_um**2 / (wavelength_um**2 - self.C[i])
        return np.sqrt(n_squared)

    def detect_peaks(self, wavenumbers, reflectances, threshold=0.6):
        """检测干涉条纹峰值"""
        r = np.array(reflectances)
        r = r / np.max(r)  # 归一化

        peaks = []
        for i in range(1, len(r)-1):
            if r[i] > r[i-1] and r[i] > r[i+1] and r[i] > threshold:
                peaks.append(i)

        return peaks

    def calculate_thickness(self, wavenumbers, reflectances, angle_deg):
        """计算外延层厚度"""
        try:
            # 1. 峰值检测
            peaks = self.detect_peaks(wavenumbers, reflectances)
            if len(peaks) < 2:
                return None, len(peaks)

            # 2. 计算峰值间隔
            peak_wavenumbers = wavenumbers[peaks]
            intervals = np.diff(peak_wavenumbers)

            # 过滤异常值
            median_interval = np.median(intervals)
            valid_intervals = intervals[intervals < 3 * median_interval]

            if len(valid_intervals) == 0:
                return None, len(peaks)

            avg_interval = np.mean(valid_intervals)

            # 3. 计算平均折射率
            mean_wavenumber = np.mean(wavenumbers)
            mean_wavelength = 1.0 / mean_wavenumber * 1e4  # μm
            mean_n = self.sellmeier_n(mean_wavelength)

            # 4. 计算折射角
            angle_rad = np.radians(angle_deg)
            sin_refract = np.sin(angle_rad) / mean_n

            if sin_refract > 1.0:
                return None, len(peaks)

            cos_refract = np.sqrt(1 - sin_refract**2)

            # 5. 计算厚度
            thickness = 1.0 / (2 * mean_n * cos_refract * avg_interval)

            return thickness, len(peaks)

        except Exception as e:
            print(f"计算错误: {e}")
            return None, 0

def main():
    """主函数"""
    print("=" * 60)
    print("问题一：碳化硅外延层厚度测量")
    print("=" * 60)

    calculator = ThicknessCalculator()

    # 文件信息
    files_info = [
        ('附件1.csv', '附件1-碳化硅10°', 10.0),
        ('附件2.csv', '附件2-碳化硅15°', 15.0),
        ('附件3.csv', '附件3-硅10°', 10.0),
        ('附件4.csv', '附件4-硅15°', 15.0)
    ]

    results = []

    for filename, description, angle in files_info:
        print(f"\n处理 {description}:")
        print("-" * 40)

        try:
            # 读取数据
            df = pd.read_csv(f'附件/{filename}')
            wavenumbers = df['波数 (cm-1)'].values
            reflectances = df['反射率 (%)'].values / 100.0

            print(f"数据点数: {len(wavenumbers)}")
            print(f"波数范围: {wavenumbers.min():.1f} - {wavenumbers.max():.1f} cm⁻¹")
            print(f"反射率范围: {reflectances.min():.3f} - {reflectances.max():.3f}")

            # 计算厚度
            thickness, peak_count = calculator.calculate_thickness(wavenumbers, reflectances, angle)

            if thickness is not None:
                results.append({
                    'file': description,
                    'angle': angle,
                    'thickness': thickness,
                    'peak_count': peak_count,
                    'success': True
                })
                print(f"检测到峰值数: {peak_count}")
                print(f"✓ 计算厚度: {thickness:.2f} μm")
            else:
                results.append({
                    'file': description,
                    'angle': angle,
                    'thickness': None,
                    'peak_count': peak_count,
                    'success': False
                })
                print(f"检测到峰值数: {peak_count}")
                print("✗ 计算失败")

        except Exception as e:
            print(f"✗ 文件读取错误: {e}")
            results.append({
                'file': description,
                'angle': angle,
                'thickness': None,
                'peak_count': 0,
                'success': False
            })

    # 结果汇总
    print("\n" + "=" * 60)
    print("结果汇总")
    print("=" * 60)

    successful_results = [r for r in results if r['success']]
    print(f"\n成功计算: {len(successful_results)}/{len(results)} 个样品")

    for r in successful_results:
        print(f"{r['file']:20s}: {r['thickness']:6.2f} μm (峰值: {r['peak_count']})")

    # 碳化硅分析
    sic_results = [r for r in successful_results if '碳化硅' in r['file']]
    if len(sic_results) == 2:
        thickness1, thickness2 = sic_results[0]['thickness'], sic_results[1]['thickness']
        avg_sic = (thickness1 + thickness2) / 2
        diff_sic = abs(thickness1 - thickness2)
        rel_diff_sic = diff_sic / avg_sic * 100

        print(f"\n碳化硅样品分析:")
        print(f"  10° 入射角: {thickness1:.2f} μm")
        print(f"  15° 入射角: {thickness2:.2f} μm")
        print(f"  平均厚度: {avg_sic:.2f} μm")
        print(f"  差异: {diff_sic:.2f} μm ({rel_diff_sic:.1f}%)")

        if rel_diff_sic < 5:
            print("  ✓ 两个角度的结果一致性良好")
        else:
            print("  ⚠ 两个角度的结果差异较大，可能存在多光束干涉影响")

    return results

if __name__ == "__main__":
    results = main()