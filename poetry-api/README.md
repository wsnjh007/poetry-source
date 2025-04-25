# 古诗词随机API服务

这是一个基于Docker的古诗词随机API服务，提供了随机获取古诗词的功能。数据源来自[snowtraces/poetry-source](https://github.com/snowtraces/poetry-source)项目。

## 功能特点

- 随机获取古诗词
- 支持按分类、朝代筛选
- 支持按ID查询特定诗词
- 支持关键词和作者搜索
- 提供分类统计信息
- Docker容器化部署，方便迁移和扩展

## API接口

### 1. 随机获取诗词

```
GET /api/random
```

查询参数:
- `category`: (可选) 分类，如"诗"、"词"、"曲"
- `dynasty`: (可选) 朝代，如"唐"、"宋"

示例:
```
GET /api/random?category=诗&dynasty=唐
```

### 2. 根据ID获取诗词

```
GET /api/poetry/:id
```

示例:
```
GET /api/poetry/4cf43776293040fc04bd64e72e48f935
```

### 3. 搜索诗词

```
GET /api/search
```

查询参数:
- `keyword`: (可选) 关键词
- `author`: (可选) 作者名
- `category`: (可选) 分类
- `dynasty`: (可选) 朝代
- `limit`: (可选) 返回结果数量限制，默认10

示例:
```
GET /api/search?keyword=明月&category=诗&dynasty=唐&limit=5
```

### 4. 获取分类信息

```
GET /api/categories
```

### 5. 健康检查

```
GET /health
```

## 部署方法

### 使用Docker Compose部署

1. 克隆本仓库:

```bash
git clone <仓库地址>
cd poetry-api
```

2. 启动服务:

```bash
docker-compose up -d
```

服务将在 http://localhost:3000 上运行。

### 手动构建Docker镜像

1. 构建Docker镜像:

```bash
docker build -t poetry-api .
```

2. 运行容器:

```bash
docker run -d -p 3000:3000 -v /path/to/poetry-source:/app/data --name poetry-api poetry-api
```

## 环境变量

- `PORT`: API服务端口，默认3000
- `DATA_DIR`: 数据目录路径，默认'/app/data'
- `NODE_ENV`: 运行环境，生产环境设置为'production'

## 开发

### 安装依赖

```bash
npm install
```

### 本地运行

```bash
npm run dev
```

### 运行测试

```bash
npm test
```

## 许可证

MIT
