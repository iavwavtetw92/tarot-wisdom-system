// 涓夊紶鐗屾娊鍗＄郴锟?
class ThreeCardSpread {
    constructor() {
        this.cards = [];
        this.drawnCards = [];
        this.questionType = 'general';
        this.positions = ['past', 'present', 'future'];
        this.flippedCount = 0; // 杩借釜宸茬炕寮€鐨勭墝锟?
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
            console.error('鍔犺浇鍗＄墝澶辫触:', error);
            alert('鍔犺浇鍗＄墝鏁版嵁澶辫触锛岃鍒锋柊椤甸潰閲嶈瘯');
        }
    }

    setupEventListeners() {
        // 闂绫诲瀷閫夋嫨
        document.querySelectorAll('.question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.question-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.questionType = btn.dataset.type;
            });
        });

        // 鎶藉崱鎸夐挳
        document.getElementById('draw-button').addEventListener('click', () => {
            this.drawCards();
        });
    }

    drawCards() {
        // 绂佺敤鎸夐挳
        const button = document.getElementById('draw-button');
        button.disabled = true;
        button.textContent = '鎶藉崱锟?..';

        // 娓呯┖涔嬪墠鐨勭粨锟?
        document.getElementById('cards-spread').innerHTML = '';
        document.getElementById('reading-section').classList.remove('show');

        // 閲嶇疆缈荤墝璁℃暟
        this.flippedCount = 0;

        // 闅忔満鎶藉彇3寮犱笉閲嶅鐨勭墝
        const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
        this.drawnCards = shuffled.slice(0, 3).map(card => ({
            ...card,
            isReversed: Math.random() < 0.5 // 50%姒傜巼閫嗕綅
        }));

        // 渚濇鏄剧ず3寮犵墝
        this.revealCards();
    }

    revealCards() {
        const positionNames = {
            past: '杩囧幓',
            present: '鐜板湪',
            future: '鏈潵'
        };

        const spreadEl = document.getElementById('cards-spread');

        this.drawnCards.forEach((card, index) => {
            setTimeout(() => {
                const position = this.positions[index];
                const cardEl = this.createCardElement(card, position, positionNames[position]);
                spreadEl.appendChild(cardEl);

                // 瑙﹀彂鏄剧ず鍔ㄧ敾
                setTimeout(() => {
                    cardEl.classList.add('revealed');
                }, 50);

                // 鏈€鍚庝竴寮犵墝鏄剧ず鍚庯紝鍚敤閲嶆柊鎶藉崱鎸夐挳
                if (index === 2) {
                    setTimeout(() => {
                        document.getElementById('draw-button').disabled = false;
                        document.getElementById('draw-button').textContent = '馃攧 閲嶆柊鎶藉崱';
                    }, 800);
                }
            }, index * 1000);
        });
    }

    createCardElement(card, position, positionName) {
        const cardEl = document.createElement('div');
        cardEl.className = 'spread-card';

        const reversedClass = card.isReversed ? 'reversed' : '';
        const reversedBadge = card.isReversed ? '<div class="reversed-badge">閫嗕綅</div>' : '';

        cardEl.innerHTML = `
            <div class="card-position">${positionName}</div>
            <div class="flip-scene">
                <div class="flip-card ${reversedClass}">
                    <!-- 鍗¤儗 -->
                    <div class="card-face card-back">
                        <div class="card-back-icon">馃寵锟?/div>
                        <div class="flip-hint">鐐瑰嚮缈荤墝</div>
                    </div>
                    
                    <!-- 鍗＄墝姝ｉ潰 -->
                    <div class="card-face card-front">
                        <div class="mini-card card-${card.id}">
                            ${reversedBadge}
                            <div class="mini-card-emoji">${card.emoji}</div>
                            <div class="mini-card-name">${card.name.en}</div>
                            <div class="mini-card-name-zh">${card.name.zh}</div>
                        </div>
                    </div>
                    
                    <!-- 缈荤墝鐗规晥瀹瑰櫒 -->
                    <div class="flip-particles"></div>
                </div>
            </div>
            <a href="card.html?card=${card.id}${card.isReversed ? '&reversed=true' : ''}" class="view-detail" style="opacity: 0; pointer-events: none;">鏌ョ湅璇︽儏 锟?/a>
        `;

        // 娣诲姞缈荤墝浜や簰
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
    // 缈荤墝
    flipCard.classList.add('flipped');

    // 鍏夋晥鐖嗗彂
    this.createFlipGlow(flipCard);

    // 绮掑瓙鐖嗗彂
    this.createParticleBurst(flipCard);

    // 鏄剧ず"鏌ョ湅璇︽儏"閾炬帴
    setTimeout(() => {
        viewDetail.style.opacity = '1';
        viewDetail.style.pointerEvents = 'auto';
    }, 800);

    // 澧炲姞宸茬炕鐗岃锟?
    this.flippedCount++;

    // 濡傛灉3寮犵墝閮界炕寮€浜嗭紝鏄剧ず缁煎悎瑙ｈ
    if (this.flippedCount === 3) {
        setTimeout(() => {
            this.generateReading();
        }, 1000); // 绛夊緟缈荤墝鍔ㄧ敾瀹屾垚
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

        // 闅忔満鏂瑰悜
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

        // 娓呯悊
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

            // 闅忔満鏂瑰悜
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

            // 娓呯悊
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
        // 妫€娴嬩富锟?
        const theme = this.detectTheme(past, present, future);

        // 鐢熸垚缁煎悎瑙ｈ
        const questionContext = this.getQuestionContext();

        return `
            <p><strong>锟?鐗岄樀姒傚喌</strong></p>
            <p>杩欎笁寮犵墝涓轰綘灞曠幇锟?{theme.name}鐨勬梾绋嬶紝鎻ず锟?{questionContext}鐨勯噸瑕佸惎绀猴拷?/p>

            <p><strong>馃搮 鏃堕棿绾垮垎锟?/strong></p>
            <p>
                <strong>銆愯繃鍘伙拷?{past.name.zh}</strong> - ${past.symbolism}<br>
                ${past.upright.meaning.substring(0, 150)}...<br><br>

                <strong>銆愮幇鍦拷?{present.name.zh}</strong> - ${present.symbolism}<br>
                ${present.upright.meaning.substring(0, 150)}...<br><br>

                <strong>銆愭湭鏉ワ拷?{future.name.zh}</strong> - ${future.symbolism}<br>
                ${future.upright.meaning.substring(0, 150)}...
            </p>

            <p><strong>馃幆 鏍稿績娲炲療</strong></p>
            <p>${this.generateInsight(past, present, future)}</p>

            <p><strong>馃挕 琛屽姩寤鸿</strong></p>
            <p>${this.generateAdvice(past, present, future)}</p>

            <p style="margin-top: 30px; text-align: center; color: #c9a961;">
                锟?鐐瑰嚮涓婃柟鍗＄墝鍙煡鐪嬫瘡寮犵墝鐨勮缁嗚В锟?锟?
            </p>
        `;
    }

    detectTheme(past, present, future) {
        const themes = [
            {
                name: '鎴愰暱涓庤浆鍙?
                keywords: ['寮€锟?, '杞彉', '鎴愰暱', '鍔涢噺', '鎴愬姛', '鎴愬氨'],
                description: '浣犳鍦ㄧ粡鍘嗛噸瑕佺殑涓汉鎴愰暱'
            },
            {
                name: '鐖变笌鍏崇郴',
                keywords: ['鐖辨儏', '鍏虫€€', '鍜岃皭', '閫夋嫨', '杩炴帴'],
                description: '鍏崇郴鍜屾儏鎰熸槸褰撳墠鐨勭劍锟?
            },
            {
                name: '鎸戞垬涓庣獊锟?,
                keywords: ['鎸戞垬', '绐佸彉', '鐮村潖', '閲婃斁', '瑙ｆ斁'],
                description: '浣犳闈复闇€瑕佺獊鐮寸殑鎸戞垬'
            }
        ];

        // 缁勫悎鎵€鏈夊叧閿瘝
        const allKeywords = [
            ...past.keywords,
            ...present.keywords,
            ...future.keywords
        ];

        // 鎵惧埌鏈€鍖归厤鐨勪富锟?
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
            love: '鐖辨儏鍏崇郴',
            career: '浜嬩笟鍙戝睍',
            growth: '涓汉鎴愰暱',
            general: '浜虹敓鏃呯▼'
        };
        return contexts[this.questionType] || contexts.general;
    }

    generateInsight(past, present, future) {
        const insights = [
            `锟?{past.name.zh}锟?{future.name.zh}锛屼綘鐨勬梾绋嬪厖婊′簡鎰忎箟锟?{past.keywords[0]}鐨勭粡鍘嗗閫犱簡鐜板湪锟?{present.keywords[0]}锛岃€岃繖涓€鍒囬兘鎸囧悜${future.keywords[0]}鐨勬湭鏉ャ€俙,

            `杩囧幓锟?{past.name.zh}涓轰綘甯︽潵锟?{past.keywords[0]}鐨勪綋楠屻€傜幇鍦ㄧ殑${present.name.zh}鏄剧ず浣犳澶勪簬${present.keywords[0]}鐨勭姸鎬併€傛湭鏉ョ殑${future.name.zh}棰勭ず鐫€${future.keywords[0]}鍗冲皢鍒版潵銆俙,

            `浣犵殑杩囧幓锟?{past.name.zh}锛夊厖锟?{past.keywords[0]}锛屽閫犱簡褰撲笅锟?{present.name.zh}锛夌殑${present.keywords[0]}銆傚鏋滀綘缁х画褰撳墠鐨勯亾璺紝${future.name.zh}鎵€浠ｈ〃锟?{future.keywords[0]}灏嗘垚涓轰綘鐨勭幇瀹炪€俙
        ];

        return insights[Math.floor(Math.random() * insights.length)];
    }

    generateAdvice(past, present, future) {
        return `
            鍩轰簬${past.name.zh}鐨勭粡楠岋紝浣犲凡缁忓鍒颁簡瀹濊吹鐨勪竴璇撅拷?
            鐜板湪锟?{present.name.zh}鎻愰啋浣犺${present.keywords[0]}锛屼繚锟?{present.keywords[1]}锟?
            灞曟湜鏈潵锟?{future.name.zh}鐨勮兘閲忛紦鍔变綘${future.upright.advice.substring(0, 100)}...
            璁颁綇锟?{present.upright.advice.substring(0, 100)}...
        `;
    }
}

// 鍒濆锟?
document.addEventListener('DOMContentLoaded', () => {
    const spread = new ThreeCardSpread();
    spread.init();
});

