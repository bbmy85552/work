#!/bin/bash

# 学智AI前端 PM2 管理脚本

case "$1" in
    start)
        echo "🚀 启动服务..."
        pm2 start ecosystem.config.cjs
        ;;
    stop)
        echo "⏹️ 停止服务..."
        pm2 stop xuezhi-ai-frontend
        ;;
    restart)
        echo "🔄 重启服务..."
        pm2 restart xuezhi-ai-frontend
        ;;
    delete)
        echo "🗑️ 删除服务..."
        pm2 delete xuezhi-ai-frontend
        ;;
    status)
        echo "📊 服务状态:"
        pm2 status
        ;;
    logs)
        echo "📝 查看日志:"
        pm2 logs xuezhi-ai-frontend
        ;;
    monitor)
        echo "📈 监控面板:"
        pm2 monit
        ;;
    rebuild)
        echo "🔧 重新构建并启动..."
        pnpm build && pm2 restart xuezhi-ai-frontend
        ;;
    *)
        echo "学智AI前端 PM2 管理脚本"
        echo ""
        echo "用法: $0 {start|stop|restart|delete|status|logs|monitor|rebuild}"
        echo ""
        echo "命令说明:"
        echo "  start    - 启动服务"
        echo "  stop     - 停止服务"
        echo "  restart  - 重启服务"
        echo "  delete   - 删除服务"
        echo "  status   - 查看状态"
        echo "  logs     - 查看日志"
        echo "  monitor  - 打开监控面板"
        echo "  rebuild  - 重新构建并重启"
        ;;
esac