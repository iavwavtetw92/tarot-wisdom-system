# Claude AI 集成指南

## 🎯 概述

本文档说明如何将Claude AI集成到塔罗牌系统，实现AI驱动的深度解读。

---

## 📋 前置准备

### 1. 获取Claude API Key

1. 访问 https://console.anthropic.com/
2. 注册/登录账号
3. 创建API Key
4. 保存Key（格式：`sk-ant-...`）

### 2. 安全配置

**重要**：永远不要在前端代码中硬编码API Key！

**推荐方案**：
- 使用后端代理（Node.js/Python）
- 或使用Cloudflare Workers
- 或使用Vercel Serverless Functions

---

## 🔧 实施方案

### 方案A：Vercel Serverless（推荐）

#### 1. 创建API路由

创建 `api/chat.js`：

```javascript
// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cards, questionType } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: generatePrompt(cards, questionType)
        }]
      })
    });

    const data = await response.json();
    res.status(200).json({ reading: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function generatePrompt(cards, questionType) {
  const [past, present, future] = cards;
  
  const systemPrompt = `你是一位经验丰富的塔罗师，精通韦特塔罗。
你的解读需要：
1. 基于塔罗牌的传统含义
2. 结合牌阵的时间线结构（过去-现在-未来）
3. 提供具体、实用的建议
4. 语言温暖、有洞察力
5. 字数控制在500字左右`;

  return `${systemPrompt}

问题类型：${questionType}

抽到的牌：
- 过去：${past.name.zh}（${past.name.en}）- ${past.symbolism}
- 现在：${present.name.zh}（${present.name.en}）- ${present.symbolism}
- 未来：${future.name.zh}（${future.name.en}）- ${future.symbolism}

请为这个牌阵提供完整的解读，包括：
1. 整体概况
2. 时间线分析
3. 核心洞察
4. 行动建议`;
}
```

#### 2. 配置环境变量

在Vercel项目设置中：
```
CLAUDE_API_KEY=sk-ant-your-key-here
```

#### 3. 前端调用

修改 `js/spread.js`：

```javascript
async generateReading() {
    const readingEl = document.getElementById('reading-content');
    readingEl.innerHTML = '<p style="text-align: center;">🔮 AI正在生成解读...</p>';
    document.getElementById('reading-section').classList.add('show');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cards: this.drawnCards,
                questionType: this.questionType
            })
        });

        const data = await response.json();
        readingEl.innerHTML = `<div>${data.reading.replace(/\n/g, '<br><br>')}</div>`;
    } catch (error) {
        readingEl.innerHTML = '<p style="color: #ff6b6b;">AI解读生成失败，使用备用解读</p>';
        // 回退到原有的简单解读
        readingEl.innerHTML = this.createReading(...this.drawnCards);
    }
}
```

---

### 方案B：Cloudflare Workers

#### 1. 创建Worker

```javascript
// worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return handleCORS();
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { cards, questionType } = await request.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY, // 在Worker环境变量中配置
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: generatePrompt(cards, questionType)
        }]
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      reading: data.content[0].text
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

function generatePrompt(cards, questionType) {
  // 同方案A
}
```

---

### 方案C：简单后端（Node.js Express）

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { cards, questionType } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: generatePrompt(cards, questionType)
        }]
      })
    });

    const data = await response.json();
    res.json({ reading: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 🎨 提示词优化

### 塔罗师System Prompt

```javascript
const TAROT_SYSTEM_PROMPT = `你是"慧明"，一位拥有30年经验的专业塔罗师。

【角色定位】
- 性格：温暖、有洞察力、不做绝对预言
- 风格：结合传统塔罗智慧与现代心理学
- 语言：优雅、富有诗意，但不晦涩

【解读原则】
1. 尊重传统牌义，但避免教条
2. 强调自由意志，牌只是指引
3. 提供具体可行的建议
4. 鼓励积极行动

【解读结构】
1. 整体能量（50字）
2. 时间线叙事（150字）
   - 过去如何影响现在
   - 现在的核心状态
   - 未来的可能方向
3. 核心洞察（100字）
4. 行动建议（100字）

【禁止】
- 做绝对预言
- 使用恐吓性语言
- 过度神秘化
- 超出牌义范围的推测`;
```

---

## 📊 成本估算

### Claude API 定价（截至2024年）

- Claude 3 Sonnet:
  - 输入：$3 / 1M tokens
  - 输出：$15 / 1M tokens

### 估算
- 每次解读约500 tokens输入 + 500 tokens输出
- 成本：~$0.009 / 次
- 1000次解读：~$9

---

## 🔐 安全最佳实践

1. **API Key管理**
   - 使用环境变量
   - 定期轮换
   - 设置使用限制

2. **速率限制**
   ```javascript
   // 简单的客户端限流
   let lastCall = 0;
   async function callAI() {
     const now = Date.now();
     if (now - lastCall < 3000) {
       throw new Error('请稍后再试');
     }
     lastCall = now;
     // ... API调用
   }
   ```

3. **错误处理**
   ```javascript
   try {
     const response = await callClaude();
   } catch (error) {
     // 回退к简单解读
     console.error('AI调用失败，使用本地解读');
     return localReading();
   }
   ```

---

## 🚀 部署步骤

### Vercel部署

1. **推送代码到GitHub**
```bash
git add api/
git commit -m "添加Claude AI集成"
git push
```

2. **在Vercel配置**
   - 导入GitHub仓库
   - 添加环境变量 `CLAUDE_API_KEY`
   - 部署

3. **测试**
   - 访问你的Vercel域名
   - 进行抽卡测试

---

## 🎯 后续优化方向

1. **多维解释系统**
   - 集成其他System Prompts（八卦、MBTI等）
   - 用户选择解释风格

2. **历史记录**
   - 保存抽卡历史
   - 回顾过往解读

3. **高级功能**
   - 语音解读（TTS）
   - 多语言支持
   - 更多牌阵

---

**创建时间**: 2025-12-30  
**状态**: 实施指南
