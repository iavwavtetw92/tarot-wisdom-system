# 塔罗牌可视化系统 - 使用说明

## 📁 项目结构

```
tarot-system/
├── index.html              # 索引导航页
├── card.html               # 通用卡牌模板
├── css/
│   ├── main.css           # 主样式
│   ├── effects.css        # 22种卡牌特效
│   └── responsive.css     # 响应式设计
├── js/
│   └── loader.js          # 动态加载器
└── data/
    └── cards-major.json   # 22张大阿卡纳数据
```

## 🚀 快速开始

### 方法1：本地运行

1. **使用本地服务器**（推荐）

```powershell
# 在 tarot-system 目录下运行
cd d:\inai\in-ai\ai-learning\ideas\塔罗牌项目\tarot-system

# 使用 Python 启动服务器
python -m http.server 8000

# 或使用 Node.js
npx serve
```

2. **打开浏览器**
   - 访问: `http://localhost:8000`

### 方法2：直接打开

直接双击 `index.html` 文件（但可能无法加载JSON数据）

---

## 🎴 当前功能

### ✅ 已实现

1. **索引导航页** (`index.html`)
   - 卡牌网格展示
   - 随机抽牌功能
   - 响应式布局

2. **卡牌详情页** (`card.html`)
   - 动态加载卡牌数据
   - 点击翻转卡牌（查看牌面）
   - 键盘导航（左右箭头切换卡牌）
   - 22种独特视觉效果

3. **交互功能**
   - 上一张/下一张导航
   - 随机抽牌
   - 移动端触摸支持
   - 键盘快捷键

4. **视觉效果**
   - 星空背景动画
   - 卡牌翻转3D效果
   - 每张牌的独特动画
   - 响应式设计

### 📊 数据完成度

**大阿卡纳**: 22% (5/22张)

**已完成**:
- 0. 愚者 ✅
- 1. 魔术师 ✅
- 2. 女祭司 ✅
- 3. 皇后 ✅
- 4. 皇帝 ✅

**待添加**: 17张 (5-21号牌)

---

## 📝 如何添加更多卡牌数据

### 编辑 `data/cards-major.json`

按照以下格式添加新卡牌：

```json
{
  "id": "hierophant",
  "number": 5,
  "name": {
    "zh": "教皇",
    "en": "The Hierophant"
  },
  "emoji": "⛪",
  "color": "#FFA000",
  "visualEffect": "holy-light",
  "symbolism": "传统、教导、精神指引",
  "keywords": ["传统", "教导", "信仰", "精神导师"],
  "upright": {
    "meaning": "教皇代表传统智慧和精神指引...",
    "love": "传统恋爱观、正式关系、婚姻承诺",
    "career": "导师角色、教育工作、遵循传统",
    "wealth": "稳健投资、传统理财",
    "advice": "寻求智慧的引导，尊重传统价值..."
  },
  "reversed": {
    "meaning": "逆位教皇表示..."
  },
  "meditation": [
    "我需要什么样的精神指引？",
    "传统对我意味着什么？"
  ]
}
```

### 卡牌ID命名规范

使用小写英文名，单词用连字符连接：
- `hierophant` (教皇)
- `lovers` (恋人)
- `wheel-of-fortune` (命运之轮)
- `hanged-man` (倒吊人)

---

## 🎨 卡牌特效映射

每张牌的 `visualEffect` 对应 `css/effects.css` 中的动画：

| 卡牌ID | visualEffect | 效果 |
|--------|--------------|------|
| fool | float | 漂浮 |
| magician | rotate-glow | 旋转光环 |
| high-priestess | veil | 神秘面纱 |
| empress | bloom | 花朵绽放 |
| emperor | steady | 稳固微震 |
| ... | ... | ... |

特效CSS类名格式：`.card-{id}`

---

## ⚡ 性能优化

系统已包含以下优化：

- ✅ CSS GPU加速 (transform, opacity)
- ✅ 触摸设备检测
- ✅ 移动端禁用复杂动画
- ✅ 懒加载数据
- ✅ `prefers-reduced-motion` 支持

---

## 📱 兼容性

**支持的浏览器**:
- Chrome (推荐)
- Firefox
- Safari
- Edge

**支持的设备**:
- 桌面电脑
- 平板
- 手机

---

## 🔥 下一步扩展

### Phase 1完善
1. 补充剩余17张大阿卡纳数据
2. 优化移动端体验
3. 添加更多冥想问题

### Phase 2: 小阿卡纳
1. 权杖14张
2. 圣杯14张
3. 宝剑14张
4. 星币14张

### Phase 3: 高级功能
1. 抽牌记录
2. 分享功能
3. 牌阵系统
4. 主题切换

---

## 🐛 常见问题

### Q: 为什么卡牌数据加载失败？
A: 需要使用本地服务器运行，浏览器的CORS政策不允许直接从文件系统加载JSON。

### Q: 如何修改卡牌颜色？
A: 在JSON中修改 `color` 字段，或在 `css/effects.css` 中修改 `--card-theme` 变量。

### Q: 移动端动画卡顿？
A: 系统已针对性能优化，如仍然卡顿，可以在 `css/effects.css` 中简化动画。

---

## 📧 技术支持

基于 RCTFO 提示词开发，详见：
`塔罗牌系统_RCTFO提示词.md`

---

**版本**: Phase 1 v1.0  
**最后更新**: 2025-12-30  
**开发状态**: 核心系统完成，数据待补充
