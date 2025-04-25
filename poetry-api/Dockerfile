FROM node:18.20.2-alpine3.19

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY . .

# 设置数据目录环境变量
ENV DATA_DIR=/app/data

# 暴露端口
EXPOSE 3030

# 启动命令
CMD ["npm", "start"]
