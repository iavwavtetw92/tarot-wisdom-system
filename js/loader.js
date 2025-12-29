// 塔罗牌动态加载器
// 从JSON加载卡牌数据并渲染页面

class TarotLoader {
    constructor() {
        this.cards = [];
        this.currentCard = null;
        this.currentIndex = 0;
    }

    // 初始化
    async init() {
        try {
            // 显示加载状态
            this.showLoading();

            // 加载卡牌数据
            await this.loadCards();

            // 从URL获取卡牌ID
            const urlParams = new URLSearchParams(window.location.search);
            const cardId = urlParams.get('card') || 'fool';

            // 渲染卡牌
            await this.renderCard(cardId);

            // 初始化交互
            this.initInteractions();

            // 隐藏加载，显示内容
            this.hideLoading();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // 加载卡牌数据
    async loadCards() {
        try {
            const response = await fetch('data/cards-major.json');
            if (!response.ok) {
                throw new Error('无法加载卡牌数据');
            }
            const data = await response.json();
            this.cards = data.cards;
        } catch (error) {
            throw new Error(`数据加载失败: ${error.message}`);
        }
    }

    // 渲染卡牌
    async renderCard(cardId) {
        // 查找卡牌
        this.currentCard = this.cards.find(card => card.id === cardId);

        if (!this.currentCard) {
            throw new Error(`未找到卡牌: ${cardId}`);
        }

        // 更新当前索引
        this.currentIndex = this.cards.findIndex(card => card.id === cardId);

        // 更新页面标题
        document.title = `${this.currentCard.name.zh} - 塔罗解析`;
        document.getElementById('page-title').textContent = `${this.currentCard.name.zh} - 塔罗解析`;

        // 更新标题
        document.getElementById('card-title').textContent = this.currentCard.name.en;
        document.getElementById('card-subtitle').textContent =
            `${this.currentCard.name.zh} · ${this.currentCard.number}号牌`;

        // 更新卡牌显示
        const card = document.getElementById('tarot-card');
        card.dataset.cardId = this.currentCard.id;
        card.dataset.effect = this.currentCard.visualEffect;
        card.className = `tarot-card card-${this.currentCard.id}`;

        document.getElementById('card-number').textContent = this.currentCard.number;
        document.getElementById('card-image').textContent = this.currentCard.emoji || '🎴';
        document.getElementById('card-name-en').textContent = this.currentCard.name.en;
        document.getElementById('card-name-zh').textContent = this.currentCard.name.zh;

        // 应用主题色
        if (this.currentCard.color) {
            card.style.setProperty('--card-theme', this.currentCard.color);
        }

        // 更新内容
        this.renderContent();
    }

    // 渲染内容
    renderContent() {
        const card = this.currentCard;

        // 牌面解读
        const meaningHtml = `
            <p><strong>正位含义：</strong></p>
            <p>${card.upright.meaning}</p>
            ${card.reversed ? `
                <p style="margin-top: 20px;"><strong>逆位含义：</strong></p>
                <p>${card.reversed.meaning}</p>
            ` : ''}
            <p><strong>关键词：</strong></p>
            <p>${card.keywords.join('、')}</p>
        `;
        document.getElementById('meaning-content').innerHTML = meaningHtml;

        // 领域指引
        const guidanceHtml = `
            ${card.upright.love ? `<p><strong>爱情：</strong>${card.upright.love}</p>` : ''}
            ${card.upright.career ? `<p><strong>事业：</strong>${card.upright.career}</p>` : ''}
            ${card.upright.wealth ? `<p><strong>财运：</strong>${card.upright.wealth}</p>` : ''}
        `;
        document.getElementById('guidance-content').innerHTML = guidanceHtml;

        // 实用建议
        const adviceHtml = `
            <p>${card.upright.advice || card.symbolism}</p>
            ${card.meditation && card.meditation.length > 0 ? `
                <p style="margin-top: 20px;"><strong>冥想问题：</strong></p>
                ${card.meditation.map(q => `<p>• ${q}</p>`).join('')}
            ` : ''}
        `;
        document.getElementById('advice-content').innerHTML = adviceHtml;
    }

    // 初始化交互
    initInteractions() {
        // 卡牌翻转
        const card = document.getElementById('tarot-card');
        let isFlipped = false;

        const flipCard = () => {
            isFlipped = !isFlipped;
            card.classList.toggle('flipped', isFlipped);
        };

        card.addEventListener('click', flipCard);
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            flipCard();
        });

        // 导航按钮
        document.getElementById('prev-card').addEventListener('click', () => this.navigateCard(-1));
        document.getElementById('next-card').addEventListener('click', () => this.navigateCard(1));
        document.getElementById('random-card').addEventListener('click', () => this.randomCard());

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigateCard(-1);
            if (e.key === 'ArrowRight') this.navigateCard(1);
            if (e.key === ' ' || e.key === 'Enter') flipCard();
        });
    }

    // 导航到其他卡牌
    navigateCard(direction) {
        const newIndex = (this.currentIndex + direction + this.cards.length) % this.cards.length;
        const newCard = this.cards[newIndex];
        window.location.href = `card.html?card=${newCard.id}`;
    }

    // 随机抽牌
    randomCard() {
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        const randomCard = this.cards[randomIndex];
        window.location.href = `card.html?card=${randomCard.id}`;
    }

    // 显示加载
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('main-container').classList.add('hidden');
        document.getElementById('error').classList.add('hidden');
    }

    // 隐藏加载
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');
    }

    // 显示错误
    showError(message) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('main-container').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error-message').textContent = message;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const loader = new TarotLoader();
    loader.init();
});
