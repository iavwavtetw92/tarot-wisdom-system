// 三张牌抽卡系�?
class ThreeCardSpread {
    constructor() {
        this.cards = [];
        this.drawnCards = [];
        this.questionType = 'general';
        this.positions = ['past', 'present', 'future'];
        this.flippedCount = 0; // 追踪已翻开的牌�?
    }

    async init() {
        await this.loadCards();
        this.setupEventListeners();
    }

    async loadCards() {
        try {
            const response = await fetch('data/cards-major.json');
            const data = await response.json();
            this.cards = data.cards;
        } catch (error) {
            console.error('加载卡牌失败:', error);
            alert('加载卡牌数据失败，请刷新页面重试');
        }
    }

    setupEventListeners() {
        // 问题类型选择
        document.querySelectorAll('.question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.question-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.questionType = btn.dataset.type;
            });
        });

        // 抽卡按钮
        document.getElementById('draw-button').addEventListener('click', () => {
            this.drawCards();
        });
    }

    drawCards() {
        // 禁用按钮
        const button = document.getElementById('draw-button');
        button.disabled = true;
        button.textContent = '抽卡�?..';

        // 清空之前的结�?
        document.getElementById('cards-spread').innerHTML = '';
        document.getElementById('reading-section').classList.remove('show');

        // 重置翻牌计数
        this.flippedCount = 0;

        // 随机抽取3张不重复的牌
        const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
        this.drawnCards = shuffled.slice(0, 3).map(card => ({
            ...card,
            isReversed: Math.random() < 0.5 // 50%概率逆位
        }));

        // 依次显示3张牌
        this.revealCards();
    }

    revealCards() {
        const positionNames = {
            past: '过去',
            present: '现在',
            future: '未来'
        };

        const spreadEl = document.getElementById('cards-spread');

        this.drawnCards.forEach((card, index) => {
            setTimeout(() => {
                const position = this.positions[index];
                const cardEl = this.createCardElement(card, position, positionNames[position]);
                spreadEl.appendChild(cardEl);

                // 触发显示动画
                setTimeout(() => {
                    cardEl.classList.add('revealed');
                }, 50);

                // 最后一张牌显示后，启用重新抽卡按钮
                if (index === 2) {
                    setTimeout(() => {
                        document.getElementById('draw-button').disabled = false;
                        document.getElementById('draw-button').textContent = '🔄 重新抽卡';
                    }, 800);
                }
            }, index * 1000);
        });
    }

    createCardElement(card, position, positionName) {
        const cardEl = document.createElement('div');
        cardEl.className = 'spread-card';

        const reversedClass = card.isReversed ? 'reversed' : '';
        const reversedBadge = card.isReversed ? '<div class="reversed-badge">逆位</div>' : '';

        cardEl.innerHTML = `
            <div class="card-position">${positionName}</div>
            <div class="flip-scene">
                <div class="flip-card ${reversedClass}">
                    <!-- 卡背 -->
                    <div class="card-face card-back">
                        <div class="card-back-icon">🌙�?/div>
                        <div class="flip-hint">点击翻牌</div>
                    </div>
                    
                    <!-- 卡牌正面 -->
                    <div class="card-face card-front">
                        <div class="mini-card card-${card.id}">
                            ${reversedBadge}
                            <div class="mini-card-emoji">${card.emoji}</div>
                            <div class="mini-card-name">${card.name.en}</div>
                            <div class="mini-card-name-zh">${card.name.zh}</div>
                        </div>
                    </div>
                    
                    <!-- 翻牌特效容器 -->
                    <div class="flip-particles"></div>
                </div>
            </div>
            <a href="card.html?card=${card.id}${card.isReversed ? '&reversed=true' : ''}" class="view-detail" style="opacity: 0; pointer-events: none;">查看详情 �?/a>
        `;

        // 添加翻牌交互
        const flipScene = cardEl.querySelector('.flip-scene');
        const flipCard = cardEl.querySelector('.flip-card');
        const viewDetail = cardEl.querySelector('.view-detail');

        flipScene.addEventListener('click', () => {
            if (!flipCard.classList.contains('flipped')) {
                this.flipCard(flipCard, viewDetail);
            }
        });

        return cardEl;
    }

flipCard(flipCard, viewDetail) {
    // 翻牌
    flipCard.classList.add('flipped');

    // 光效爆发
    this.createFlipGlow(flipCard);

    // 粒子爆发
    this.createParticleBurst(flipCard);

    // 显示"查看详情"链接
    setTimeout(() => {
        viewDetail.style.opacity = '1';
        viewDetail.style.pointerEvents = 'auto';
    }, 800);

    // 增加已翻牌计�?
    this.flippedCount++;

    // 如果3张牌都翻开了，显示综合解读
    if (this.flippedCount === 3) {
        setTimeout(() => {
            this.generateReading();
        }, 1000); // 等待翻牌动画完成
    }
}

createFlipGlow(flipCard) {
    const glow = document.createElement('div');
    glow.className = 'flip-glow';
    flipCard.appendChild(glow);

    setTimeout(() => {
        glow.remove();
    }, 800);
}

createParticleBurst(flipCard) {
    const container = flipCard.querySelector('.flip-particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机方向
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance + 'px';
        const ty = Math.sin(angle) * distance + 'px';

        particle.style.setProperty('--tx', tx);
        particle.style.setProperty('--ty', ty);
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.animationDelay = (i * 0.02) + 's';

        container.appendChild(particle);

        // 清理
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}



    createFlipGlow(flipCard) {
        const glow = document.createElement('div');
        glow.className = 'flip-glow';
        flipCard.appendChild(glow);

        setTimeout(() => {
            glow.remove();
        }, 800);
    }

    createParticleBurst(flipCard) {
        const container = flipCard.querySelector('.flip-particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // 随机方向
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * distance + 'px';
            const ty = Math.sin(angle) * distance + 'px';

            particle.style.setProperty('--tx', tx);
            particle.style.setProperty('--ty', ty);
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.animationDelay = (i * 0.02) + 's';

            container.appendChild(particle);

            // 清理
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    generateReading() {
        const [past, present, future] = this.drawnCards;

        const reading = this.createReading(past, present, future);

        const readingEl = document.getElementById('reading-content');
        readingEl.innerHTML = reading;

        document.getElementById('reading-section').classList.add('show');
    }

    createReading(past, present, future) {
        // 检测主�?
        const theme = this.detectTheme(past, present, future);

        // 生成综合解读
        const questionContext = this.getQuestionContext();

        return `
            <p><strong>�?牌阵概况</strong></p>
            <p>这三张牌为你展现�?{theme.name}的旅程，揭示�?{questionContext}的重要启示�?/p>

            <p><strong>📅 时间线分�?/strong></p>
            <p>
                <strong>【过去�?{past.name.zh}</strong> - ${past.symbolism}<br>
                ${past.upright.meaning.substring(0, 150)}...<br><br>

                <strong>【现在�?{present.name.zh}</strong> - ${present.symbolism}<br>
                ${present.upright.meaning.substring(0, 150)}...<br><br>

                <strong>【未来�?{future.name.zh}</strong> - ${future.symbolism}<br>
                ${future.upright.meaning.substring(0, 150)}...
            </p>

            <p><strong>🎯 核心洞察</strong></p>
            <p>${this.generateInsight(past, present, future)}</p>

            <p><strong>💡 行动建议</strong></p>
            <p>${this.generateAdvice(past, present, future)}</p>

            <p style="margin-top: 30px; text-align: center; color: #c9a961;">
                �?点击上方卡牌可查看每张牌的详细解�?�?
            </p>
        `;
    }

    detectTheme(past, present, future) {
        const themes = [
            {
                name: '成长与转�?,
                keywords: ['开�?, '转变', '成长', '力量', '成功', '成就'],
                description: '你正在经历重要的个人成长'
            },
            {
                name: '爱与关系',
                keywords: ['爱情', '关怀', '和谐', '选择', '连接'],
                description: '关系和情感是当前的焦�?
            },
            {
                name: '挑战与突�?,
                keywords: ['挑战', '突变', '破坏', '释放', '解放'],
                description: '你正面临需要突破的挑战'
            }
        ];

        // 组合所有关键词
        const allKeywords = [
            ...past.keywords,
            ...present.keywords,
            ...future.keywords
        ];

        // 找到最匹配的主�?
        let bestMatch = themes[0];
        let maxMatches = 0;

        themes.forEach(theme => {
            const matches = allKeywords.filter(kw =>
                theme.keywords.some(tk => kw.includes(tk) || tk.includes(kw))
            ).length;

            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = theme;
            }
        });

        return bestMatch;
    }

    getQuestionContext() {
        const contexts = {
            love: '爱情关系',
            career: '事业发展',
            growth: '个人成长',
            general: '人生旅程'
        };
        return contexts[this.questionType] || contexts.general;
    }

    generateInsight(past, present, future) {
        const insights = [
            `�?{past.name.zh}�?{future.name.zh}，你的旅程充满了意义�?{past.keywords[0]}的经历塑造了现在�?{present.keywords[0]}，而这一切都指向${future.keywords[0]}的未来。`,

            `过去�?{past.name.zh}为你带来�?{past.keywords[0]}的体验。现在的${present.name.zh}显示你正处于${present.keywords[0]}的状态。未来的${future.name.zh}预示着${future.keywords[0]}即将到来。`,

            `你的过去�?{past.name.zh}）充�?{past.keywords[0]}，塑造了当下�?{present.name.zh}）的${present.keywords[0]}。如果你继续当前的道路，${future.name.zh}所代表�?{future.keywords[0]}将成为你的现实。`
        ];

        return insights[Math.floor(Math.random() * insights.length)];
    }

    generateAdvice(past, present, future) {
        return `
            基于${past.name.zh}的经验，你已经学到了宝贵的一课�?
            现在�?{present.name.zh}提醒你要${present.keywords[0]}，保�?{present.keywords[1]}�?
            展望未来�?{future.name.zh}的能量鼓励你${future.upright.advice.substring(0, 100)}...
            记住�?{present.upright.advice.substring(0, 100)}...
        `;
    }
}

// 初始�?
document.addEventListener('DOMContentLoaded', () => {
    const spread = new ThreeCardSpread();
    spread.init();
});

