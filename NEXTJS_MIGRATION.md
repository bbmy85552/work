# Next.js 迁移文档 - 客户管理模块

## 概述

已将客户管理模块从 Vite + React 迁移到 **Next.js 14.2.35**，使用 **React Server Components** 直接连接 PostgreSQL 16 数据库。

## 技术栈

- **Next.js**: 14.2.35 (App Router)
- **React**: 18.2.0 (Server Components)
- **PostgreSQL**: 16
- **Node.js**: pg@8.11.3
- **UI**: Ant Design 5.12.8
- **图表**: Recharts 3.5.1

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── layout.jsx               # 根布局
│   ├── page.jsx                 # 首页
│   ├── globals.css              # 全局样式
│   ├── api/                     # API 路由
│   │   └── schools/
│   │       ├── route.js         # GET /api/schools
│   │       └── [id]/
│   │           └── route.js     # GET /api/schools/:id
│   └── customer-management/     # 客户管理页面
│       ├── page.jsx             # Server Component (服务器组件)
│       └── CustomerManagementClient.jsx  # Client Component (客户端组件)
├── lib/
│   └── db.js                    # PostgreSQL 连接池和查询函数
├── pages/                       # 旧的 Vite 页面 (保留)
└── mock/                        # Mock 数据 (保留)
```

## 核心特性

### 1. React Server Components
- 客户管理页面 (`/customer-management/page.jsx`) 是一个 Server Component
- 直接在服务器端从 PostgreSQL 数据库获取数据
- 无需额外的 API 服务器，数据库查询在服务器端执行

### 2. 数据库连接
- 使用 `pg` 库创建连接池
- 支持环境变量配置 `DATABASE_URL`
- 生产环境自动启用 SSL 连接

### 3. 性能优化
- 服务器端数据获取，首屏渲染更快
- 减少客户端 JavaScript 代码量
- 数据在服务器端处理后再发送到客户端

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库连接

复制环境变量模板：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，设置数据库连接 URL：

```env
# 本地开发示例
DATABASE_URL=postgresql://username:password@localhost:5432/xuezhiai

# 远程数据库示例
DATABASE_URL=postgresql://username:password@150.158.153.243:5432/xuezhiai
```

### 3. 确保数据库表存在

确保 PostgreSQL 数据库中已创建 `schools` 表，参考 `schema.sql`：

```sql
CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY,
    distance NUMERIC(10, 2),
    name VARCHAR(200),
    mobile VARCHAR(200),
    addr TEXT,
    area VARCHAR(50),
    area_name VARCHAR(100),
    img_url TEXT,
    lat NUMERIC(15, 8),
    lng NUMERIC(15, 8),
    type INTEGER,
    status INTEGER,
    create_time TIMESTAMP,
    update_time TIMESTAMP,
    content TEXT,
    is_public INTEGER,
    license VARCHAR(50),
    owner VARCHAR(100),
    director VARCHAR(100),
    street VARCHAR(200),
    phone VARCHAR(200),
    other_link TEXT,
    plan_step VARCHAR(100),
    uid VARCHAR(50),
    user_name VARCHAR(100),
    total_stu INTEGER,
    biye_stu INTEGER,
    customer_type VARCHAR(50)
);
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问：
- 首页：http://localhost:3000
- 客户管理：http://localhost:3000/customer-management

## 数据字段映射

### 数据库字段 → 前端字段

| 数据库字段 | 前端字段 | 说明 |
|-----------|---------|------|
| `id` | `id` | 学校 ID |
| `name` | `schoolName` | 学校名称 |
| `type` | `schoolType` | 学校类型 (1=幼儿园, 2=小学, 3=初中, 等) |
| `area_name` | `region` | 区域名称 |
| `owner` | `contactPerson` | 联系人 |
| `mobile` | `contactPhone` | 联系电话 |
| `director` | `salesman` | 市场经理 |
| `customer_type` | `customerType` | 客户类型 |
| `status` | `status` | 对接状态 (1=已对接, 0=待对接) |

## API 接口

### GET /api/schools

获取学校列表

**Query Parameters:**
- `region`: 区域筛选
- `schoolType`: 学校类型筛选
- `search`: 搜索关键词
- `limit`: 返回数量 (默认: 100)
- `offset`: 偏移量 (默认: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "schools": [...],
    "statistics": {...}
  }
}
```

### GET /api/schools/:id

获取单个学校详情

## 从 Vite 迁移的注意事项

### 1. 路由差异

- **Vite**: 使用 `react-router-dom`，配置在 `App.jsx`
- **Next.js**: 使用文件系统路由，`src/app/` 目录自动映射为路由

### 2. 组件类型

- **Server Component**: 默认，可以访问服务器资源（数据库、文件系统）
- **Client Component**: 需要添加 `'use client'` 指令，用于处理用户交互

### 3. 数据获取

- **Vite**: 使用 `useEffect` + `axios` 在客户端获取数据
- **Next.js**: 在 Server Component 中直接获取数据，或使用 API Routes

### 4. 样式

- 继续使用 Ant Design 组件库
- 全局样式在 `src/app/globals.css`

## 兼容性

原有的 Vite 项目代码仍然保留在以下目录：
- `src/pages/` - 旧的页面组件
- `src/mock/` - Mock 数据
- `vite.config.js` - Vite 配置

可以通过以下命令运行旧的 Vite 版本：

```bash
npm run dev:vite
```

## 故障排查

### 数据库连接失败

1. 检查 `.env.local` 中的 `DATABASE_URL` 是否正确
2. 确保数据库服务器正在运行
3. 检查数据库用户权限
4. 查看控制台日志中的错误信息

### 页面无法访问

1. 确保已安装所有依赖：`npm install`
2. 检查端口 3000 是否被占用
3. 查看终端中的错误信息

### 数据显示不正确

1. 检查数据库表 `schools` 是否有数据
2. 查看浏览器控制台的网络请求
3. 检查数据库字段映射是否正确

## 性能对比

### Vite + React (客户端渲染)
- 首屏需要等待 JavaScript 加载和执行
- 数据在客户端获取，需要额外的 API 请求
- 客户端处理所有逻辑

### Next.js (服务器渲染)
- 首屏 HTML 在服务器生成
- 数据在服务器获取，减少客户端请求
- 更快的首屏加载速度
- 更好的 SEO

## 下一步

1. ✅ 客户管理页面已迁移到 Next.js
2. 🔄 其他页面可以按需逐步迁移
3. 📈 可以添加更多 Server Component 优化性能

## 支持

如有问题，请查看：
- [Next.js 文档](https://nextjs.org/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Ant Design 文档](https://ant.design/)
