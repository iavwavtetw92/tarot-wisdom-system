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

        const reading = `
            <p><strong>📖 三张牌解读</strong></p>
            <p><strong>【过去${pastPos}】${past.name.zh}</strong><br>${past.symbolism}</p>
            <p><strong>【现在${presentPos}】${present.name.zh}</strong><br>${present.symbolism}</p>
            <p><strong>【未来${futurePos}】${future.name.zh}</strong><br>${future.symbolism}</p>
            <p style="margin-top: 20px; color: #c9a961; text-align: center;">✨ 点击上方卡牌可查看详细解读 ✨</p>
        `;

        const readingEl = document.getElementById('reading-content');
        readingEl.innerHTML = reading;

        document.getElementById('reading-section').classList.add('show');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const spread = new ThreeCardSpread();
    spread.init();
});
