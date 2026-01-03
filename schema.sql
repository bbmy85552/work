-- PostgreSQL 16 建表脚本

-- 删除已存在的表（如果需要）
-- DROP TABLE IF EXISTS photographers CASCADE;
-- DROP TABLE IF EXISTS schools CASCADE;

-- 摄影师表
CREATE TABLE IF NOT EXISTS photographers (
    id INTEGER PRIMARY KEY,
    type INTEGER,
    name VARCHAR(100),
    nick_name VARCHAR(100),
    img_url TEXT,
    age INTEGER,
    sex INTEGER,
    wx_user_id VARCHAR(50),
    wx_user TEXT,
    mobile VARCHAR(200),
    card_no VARCHAR(50),
    card_img TEXT,
    card_img2 TEXT,
    e_mail VARCHAR(100),
    area VARCHAR(50),
    area_name VARCHAR(100),
    addr TEXT,
    device_model TEXT,
    good TEXT,
    industry_experience VARCHAR(50),
    attribute TEXT,
    support_hp INTEGER,
    level INTEGER,
    level_point INTEGER,
    ps_class VARCHAR(50),
    state INTEGER,
    realname_cert INTEGER,
    works_link TEXT,
    create_time TIMESTAMP,
    intro TEXT,
    remark TEXT,
    price NUMERIC(10, 2),
    half_price NUMERIC(10, 2),
    last_price NUMERIC(10, 2),
    pay_flag VARCHAR(50),
    share_img TEXT,
    reference VARCHAR(50),
    reference_reward NUMERIC(10, 2),
    photographer_imgs TEXT,
    token TEXT,
    is_sign INTEGER,
    jd_max_num INTEGER,
    is_group INTEGER,
    bank_name VARCHAR(100),
    bank_user VARCHAR(100),
    bank_acct VARCHAR(100),
    work_sys_month VARCHAR(50),
    week_no_settle_price NUMERIC(10, 2),
    week_settle_price NUMERIC(10, 2),
    districts TEXT,
    common TEXT,
    work_order_sys_list TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_photographers_mobile ON photographers(mobile);
CREATE INDEX IF NOT EXISTS idx_photographers_name ON photographers(name);
CREATE INDEX IF NOT EXISTS idx_photographers_area ON photographers(area_name);

-- 添加注释
COMMENT ON TABLE photographers IS '摄影师信息表';
COMMENT ON COLUMN photographers.id IS '摄影师ID';
COMMENT ON COLUMN photographers.name IS '姓名';
COMMENT ON COLUMN photographers.mobile IS '手机号';
COMMENT ON COLUMN photographers.device_model IS '设备型号';
COMMENT ON COLUMN photographers.level IS '等级';


-- 学校表
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name);
CREATE INDEX IF NOT EXISTS idx_schools_mobile ON schools(mobile);
CREATE INDEX IF NOT EXISTS idx_schools_area ON schools(area_name);
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);

-- 添加注释
COMMENT ON TABLE schools IS '学校信息表';
COMMENT ON COLUMN schools.id IS '学校ID';
COMMENT ON COLUMN schools.name IS '学校名称';
COMMENT ON COLUMN schools.mobile IS '联系电话';
COMMENT ON COLUMN schools.addr IS '地址';
COMMENT ON COLUMN schools.area_name IS '区域名称';
COMMENT ON COLUMN schools.owner IS '负责人';
COMMENT ON COLUMN schools.director IS '园长/校长';
