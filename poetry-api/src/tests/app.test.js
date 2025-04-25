const request = require('supertest');
const fs = require('fs');
const path = require('path');

// 模拟fs模块
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  readFileSync: jest.fn()
}));

// 在测试前设置环境变量
process.env.DATA_DIR = '/test/data';
process.env.NODE_ENV = 'test';

describe('Poetry API 测试', () => {
  let app;
  
  beforeEach(() => {
    // 清除所有模块缓存
    jest.resetModules();
    
    // 模拟文件系统
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ isDirectory: () => true });
    fs.readdirSync.mockImplementation((dirPath) => {
      if (dirPath.includes('source/诗')) {
        return ['唐', '宋'];
      } else if (dirPath.includes('source/词')) {
        return ['宋'];
      } else if (dirPath.includes('source/曲')) {
        return ['元'];
      } else if (dirPath.includes('source/其他')) {
        return [];
      } else if (dirPath.includes('唐')) {
        return ['poetry.唐.0000.json'];
      } else if (dirPath.includes('宋')) {
        return ['poetry.宋.0000.json'];
      } else if (dirPath.includes('元')) {
        return ['poetry.元.0000.json'];
      }
      return [];
    });
    
    // 模拟JSON数据
    fs.readFileSync.mockImplementation((filePath) => {
      if (filePath.includes('唐')) {
        return JSON.stringify([
          {
            id: 'tang001',
            title: '静夜思',
            authorName: '李白',
            dynasty: '唐',
            content: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。']
          }
        ]);
      } else if (filePath.includes('宋')) {
        return JSON.stringify([
          {
            id: 'song001',
            title: '江城子',
            authorName: '苏轼',
            dynasty: '宋',
            content: ['十年生死两茫茫，不思量，自难忘。']
          }
        ]);
      } else if (filePath.includes('元')) {
        return JSON.stringify([
          {
            id: 'yuan001',
            title: '天净沙·秋思',
            authorName: '马致远',
            dynasty: '元',
            content: ['枯藤老树昏鸦，小桥流水人家，古道西风瘦马。']
          }
        ]);
      }
      return '[]';
    });
    
    // 导入应用
    app = require('../app');
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('健康检查接口应返回状态ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
  
  test('随机诗歌接口应返回一首诗', async () => {
    const response = await request(app).get('/api/random');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('content');
  });
  
  test('根据ID获取诗歌接口应返回正确的诗', async () => {
    const response = await request(app).get('/api/poetry/tang001');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 'tang001');
    expect(response.body).toHaveProperty('title', '静夜思');
  });
  
  test('搜索接口应返回匹配的诗歌', async () => {
    const response = await request(app).get('/api/search?keyword=%E6%98%8E%E6%9C%88');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', '静夜思');
  });
  
  test('分类接口应返回所有分类', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('dynasties');
  });
});
