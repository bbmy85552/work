-- 创建学校科技墙设计方案存储表
-- PostgreSQL 16 兼容

-- 创建扩展（如果不存在）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建表
CREATE TABLE IF NOT EXISTS wall_design_tasks (
    -- 主键
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 所属用户（后期使用）
    user_id UUID,

    -- 用户参数（JSON格式，包含学校名称、风格等）
    user_params JSONB NOT NULL,

    -- API返回的JSON结果
    json_result JSONB,

    -- 搜索资料结果
    search_info JSONB,

    -- URL结果数组（支持多个URL）
    urls TEXT[],

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_wall_design_tasks_user_id ON wall_design_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_wall_design_tasks_created_at ON wall_design_tasks(created_at);

-- GIN索引用于JSON字段的文本搜索（需要pg_trgm扩展）
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_wall_design_tasks_user_params_school_name ON wall_design_tasks USING GIN ((user_params->>'school_name') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wall_design_tasks_user_params_style ON wall_design_tasks USING GIN ((user_params->>'style') gin_trgm_ops);

-- GIN索引用于数组字段
CREATE INDEX IF NOT EXISTS idx_wall_design_tasks_urls ON wall_design_tasks USING GIN (urls);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_wall_design_tasks_updated_at
    BEFORE UPDATE ON wall_design_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加表注释
COMMENT ON TABLE wall_design_tasks IS '学校科技墙设计方案任务表';
COMMENT ON COLUMN wall_design_tasks.id IS '主键ID';
COMMENT ON COLUMN wall_design_tasks.user_id IS '所属用户ID（后期使用）';
COMMENT ON COLUMN wall_design_tasks.user_params IS '用户输入参数（JSON格式，包含学校名称、设计风格等）';
COMMENT ON COLUMN wall_design_tasks.json_result IS 'DashScope API返回的JSON结果';
COMMENT ON COLUMN wall_design_tasks.search_info IS '联网搜索获取的资料信息';
COMMENT ON COLUMN wall_design_tasks.urls IS '相关资料来源URL数组';
COMMENT ON COLUMN wall_design_tasks.created_at IS '创建时间';
COMMENT ON COLUMN wall_design_tasks.updated_at IS '更新时间';
