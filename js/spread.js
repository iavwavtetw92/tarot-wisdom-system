// Three Card Spread System - Clean ASCII version
class ThreeCardSpread {
    constructor() {
        this.cards = [];
        this.drawnCards = [];
        this.questionType = 'general';
        this.positions = ['past', 'present', 'future'];
        this.flippedCount = 0;
    }

    async init() {
        const response = await fetch('data/cards-major.json');
        const data = await response.json();
        this.cards = data.cards;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.question-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.question-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.questionType = e.target.dataset.type;
            });
        });

        document.getElementById('draw-button').addEventListener('click', () => {
            this.drawCards();
        });
    }

    drawCards() {
        const button = document.getElementById('draw-button');
        button.disabled = true;
        button.textContent = '抽卡中...';

        document.getElementById('cards-spread').innerHTML = '';
        document.getElementById('reading-section').classList.remove('show');

        this.flippedCount = 0;

        const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
        this.drawnCards = shuffled.slice(0, 3).map(card => ({
            ...card,
            isReversed: Math.random() < 0.5
        }));

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

                setTimeout(() => {
                    cardEl.classList.add('revealed');
                }, 50);

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

        const reversedBadge = card.isReversed ? '<div class="reversed-badge">逆位</div>' : '';

        cardEl.innerHTML = `
            <div class="card-position">${positionName}</div>
            <div class="flip-scene">
                <div class="flip-card">
                    <div class="card-face card-back">
                        <div class="card-back-icon">🌙⭐</div>
                        <div class="flip-hint">点击翻牌</div>
                    </div>
                    
                    <div class="card-face card-front">
                        <div class="mini-card card-${card.id}">
                            ${reversedBadge}
                            <div class="mini-card-emoji">${card.emoji}</div>
                            <div class="mini-card-name">${card.name.en}</div>
                            <div class="mini-card-name-zh">${card.name.zh}</div>
                        </div>
                    </div>
                    
                    <div class="flip-particles"></div>
                </div>
            </div>
            <a href="card.html?card=${card.id}${card.isReversed ? '&reversed=true' : ''}" class="view-detail" style="opacity: 0; pointer-events: none; transition: opacity 0.5s;">查看详情 →</a>
        `;

        const flipCard = cardEl.querySelector('.flip-card');
        const cardBack = cardEl.querySelector('.card-back');
        const viewDetail = cardEl.querySelector('.view-detail');

        cardBack.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!flipCard.classList.contains('flipped')) {
                this.flipCard(flipCard, viewDetail);
            }
        });

        return cardEl;
    }

    flipCard(flipCard, viewDetail) {
        flipCard.classList.add('flipped');

        this.createFlipGlow(flipCard);
        this.createParticleBurst(flipCard);

        setTimeout(() => {
            viewDetail.style.opacity = '1';
            viewDetail.style.pointerEvents = 'auto';
        }, 800);

        this.flippedCount++;

        if (this.flippedCount === 3) {
            setTimeout(() => {
                this.generateReading();
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

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    generateReading() {
        const [past, present, future] = this.drawnCards;

        const pastPos = past.isReversed ? ' · 逆位' : ' · 正位';
        const presentPos = present.isReversed ? ' · 逆位' : ' · 正位';
        const futurePos = future.isReversed ? ' · 逆位' : ' · 正位';

        const pastColor = past.isReversed ? '#ff6b6b' : '#ffd700';
        const presentColor = present.isReversed ? '#ff6b6b' : '#ffd700';
        const futureColor = future.isReversed ? '#ff6b6b' : '#ffd700';

        const pastKeywords = (past.isReversed && past.reversed.keywords) ? past.reversed.keywords : past.keywords;
        const presentKeywords = (present.isReversed && present.reversed.keywords) ? present.reversed.keywords : present.keywords;
        const futureKeywords = (future.isReversed && future.reversed.keywords) ? future.reversed.keywords : future.keywords;

        const pastMeaning = past.isReversed ? past.reversed.meaning : past.upright.meaning;
        const presentMeaning = present.isReversed ? present.reversed.meaning : present.upright.meaning;
        const futureMeaning = future.isReversed ? future.reversed.meaning : future.upright.meaning;

        const reading = `
            <p style="font-size: 1.3rem; margin-bottom: 30px;"><strong>📖 三张牌综合解读</strong></p>
            
            <div style="margin-bottom: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <p style="color: ${pastColor}; font-size: 1.2rem; margin-bottom: 10px;">
                    <strong>【过去${pastPos}】${past.name.zh}</strong>
                </p>
                <p style="margin-bottom: 10px;"><em>${past.symbolism}</em></p>
                <p style="line-height: 1.8;">${pastMeaning}</p>
                <p style="margin-top: 10px; color: #c9a961;">
                    <strong>关键词：</strong>${pastKeywords.slice(0, 3).join(' · ')}
                </p>
            </div>
            
            <div style="margin-bottom: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <p style="color: ${presentColor}; font-size: 1.2rem; margin-bottom: 10px;">
                    <strong>【现在${presentPos}】${present.name.zh}</strong>
                </p>
                <p style="margin-bottom: 10px;"><em>${present.symbolism}</em></p>
                <p style="line-height: 1.8;">${presentMeaning}</p>
                <p style="margin-top: 10px; color: #c9a961;">
                    <strong>关键词：</strong>${presentKeywords.slice(0, 3).join(' · ')}
                </p>
            </div>
            
            <div style="margin-bottom: 30px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                <p style="color: ${futureColor}; font-size: 1.2rem; margin-bottom: 10px;">
                    <strong>【未来${futurePos}】${future.name.zh}</strong>
                </p>
                <p style="margin-bottom: 10px;"><em>${future.symbolism}</em></p>
                <p style="line-height: 1.8;">${futureMeaning}</p>
                <p style="margin-top: 10px; color: #c9a961;">
                    <strong>关键词：</strong>${futureKeywords.slice(0, 3).join(' · ')}
                </p>
            </div>
            
            <div style="margin-top: 40px; padding: 25px; background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,215,0,0.05)); border-left: 4px solid #ffd700; border-radius: 10px;">
                <p style="font-size: 1.1rem; margin-bottom: 15px;"><strong>🌟 整体启示</strong></p>
                <p style="line-height: 1.9; color: #e8d4b8;">
                    从【${past.name.zh}】的过去，到【${present.name.zh}】的现在，再到【${future.name.zh}】的未来，
                    这三张牌向你展示了一段重要的生命旅程。${this.getInsight(past, present, future)}
                </p>
            </div>
            
            <p style="margin-top: 30px; padding: 20px; background: rgba(255,215,0,0.05); border-radius: 10px; text-align: center;">
                <span style="color: #ffd700;">⭐</span> 
                <strong style="color: #c9a961;">正位（金色）</strong>：能量的正面展现
                <span style="margin: 0 20px;">|</span>
                <span style="color: #ff6b6b;">⭐</span> 
                <strong style="color: #ff9999;">逆位（红色）</strong>：能量的阻塞或过度
            </p>
            
            <p style="margin-top: 20px; color: #c9a961; text-align: center;">✨ 点击上方卡牌可查看详细解读 ✨</p>
        `;

        const readingEl = document.getElementById('reading-content');
        readingEl.innerHTML = reading;

        document.getElementById('reading-section').classList.add('show');
    }

    getInsight(past, present, future) {
        const insights = [
            '过去的经历正在塑造现在，而现在的选择将引领未来。',
            '注意过去与现在之间的联系，它们是理解未来的钥匙。',
            '现在是一个转折点，你有力量改变未来的走向。',
            '这三张牌提示你关注内心的声音，它们正在指引你的道路。'
        ];
        return insights[Math.floor(Math.random() * insights.length)];
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const spread = new ThreeCardSpread();
    spread.init();
});
