# 学智AI平台 - 前端项目

基于 React + Vite + Ant Design 的前端应用项目。

## 开发环境

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`

## 生产模式

生产模式不会有域名限制，适合正式部署或测试。

### 1. 构建生产版本
```bash
pnpm build
```

构建完成后，静态文件会生成在 `dist` 目录中。

### 2. 启动生产预览服务器
```bash
pnpm preview
```

生产预览服务器默认运行在 `http://localhost:4173`

### 3. 配置生产服务器（可选）

如果需要自定义生产预览服务器的配置，可以修改 `vite.config.js`：

```js
export default defineConfig({
  // ...其他配置
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
```

## 使用 PM2 持久运行

使用 PM2 可以实现生产服务的自动重启和持久运行，适合正式部署。

### 快速启动（推荐）

```bash
# 一键构建并启动 PM2 服务
./pm2-start.sh
```

### PM2 管理命令

```bash
# 使用管理脚本
./pm2-manage.sh start     # 启动服务
./pm2-manage.sh stop      # 停止服务
./pm2-manage.sh restart   # 重启服务
./pm2-manage.sh status    # 查看状态
./pm2-manage.sh logs      # 查看日志
./pm2-manage.sh monitor   # 打开监控面板
./pm2-manage.sh rebuild   # 重新构建并重启

# 直接使用 PM2 命令
pm2 start ecosystem.config.cjs     # 启动
pm2 stop xuezhi-ai-frontend       # 停止
pm2 restart xuezhi-ai-frontend    # 重启
pm2 status                        # 查看状态
pm2 logs xuezhi-ai-frontend       # 查看日志
pm2 monit                         # 监控面板
```

### PM2 配置说明

项目已配置 `ecosystem.config.js` 文件，包含：

- **自动重启**: 服务崩溃时自动重启
- **内存监控**: 超过 1GB 内存时自动重启
- **日志管理**: 所有日志保存在 `logs/` 目录
- **外部访问**: 支持通过 `http://0.0.0.0:4173` 访问

### 开机自启

```bash
# 保存当前 PM2 进程列表
pm2 save

# 生成开机自启脚本
pm2 startup
```

## 域名访问问题解决

如果在开发模式下使用域名访问时出现 "This host is not allowed" 错误，是因为 Vite 5+ 的安全限制。本项目已经配置了允许的域名：

```js
// vite.config.js
server: {
  host: '0.0.0.0',
  allowedHosts: ['www.xuezhiai.cn', 'xuezhiai.cn'],
}
```

## 其他命令

- **代码检查**: `pnpm lint`
- **重新安装依赖**: `rm -rf node_modules && pnpm install`

## 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **UI库**: Ant Design 5
- **路由**: React Router 6
- **图表**: ECharts, Recharts
- **HTTP客户端**: Axios

## 项目结构

```
├── public/          # 静态资源
├── src/             # 源代码
│   ├── components/  # 组件
│   ├── pages/       # 页面
│   ├── services/    # API服务
│   └── utils/       # 工具函数
├── dist/            # 构建输出
├── vite.config.js   # Vite配置
└── package.json     # 项目依赖
```