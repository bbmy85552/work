#!/bin/bash

# 学智AI前端 PM2 启动脚本

echo "🚀 开始构建生产版本..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "🔄 启动 PM2 服务..."

    # 停止旧进程（如果存在）
    pm2 stop xuezhi-ai-frontend 2>/dev/null
    pm2 delete xuezhi-ai-frontend 2>/dev/null

    # 启动新进程
    pm2 start ecosystem.config.cjs

    echo "✅ PM2 服务已启动！"
    echo "📊 查看状态: pm2 status"
    echo "📝 查看日志: pm2 logs xuezhi-ai-frontend"
    echo "🌐 访问地址: http://localhost:4173"
else
    echo "❌ 构建失败！请检查代码错误。"
    exit 1
fi