// 娑撳绱堕悧灞惧▕閸楋紕閮撮敓?
class ThreeCardSpread {
    constructor() {
        this.cards = [];
        this.drawnCards = [];
        this.questionType = 'general';
        this.positions = ['past', 'present', 'future'];
        this.flippedCount = 0; // 鏉╁€熼嚋瀹歌尙鐐曞鈧惃鍕閿?
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
            console.error('閸旂姾娴囬崡锛勫婢惰精瑙?', error);
            alert('閸旂姾娴囬崡锛勫閺佺増宓佹径杈Е閿涘矁顕崚閿嬫煀妞ょ敻娼伴柌宥堢槸');
        }
    }

    setupEventListeners() {
        // 闂傤噣顣界猾璇茬€烽柅澶嬪
        document.querySelectorAll('.question-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.question-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.questionType = btn.dataset.type;
            });
        });

        // 閹惰棄宕遍幐澶愭尦
        document.getElementById('draw-button').addEventListener('click', () => {
            this.drawCards();
        });
    }

    drawCards() {
        // 缁備胶鏁ら幐澶愭尦
        const button = document.getElementById('draw-button');
        button.disabled = true;
        button.textContent = '閹惰棄宕遍敓?..';

        // 濞撳懐鈹栨稊瀣閻ㄥ嫮绮ㄩ敓?
        document.getElementById('cards-spread').innerHTML = '';
        document.getElementById('reading-section').classList.remove('show');

        // 闁插秶鐤嗙紙鑽ゅ鐠佲剝鏆?
        this.flippedCount = 0;

        // 闂呭繑婧€閹惰棄褰?瀵姳绗夐柌宥咁槻閻ㄥ嫮澧?
        const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
        this.drawnCards = shuffled.slice(0, 3).map(card => ({
            ...card,
            isReversed: Math.random() < 0.5 // 50%濮掑倻宸奸柅鍡曠秴
        }));

        // 娓氭繃顐奸弰鍓с仛3瀵姷澧?
        this.revealCards();
    }

    revealCards() {
        const positionNames = {
            past: '鏉╁洤骞?,
            present: '閻滄澘婀?,
            future: '閺堫亝娼?
        };

        const spreadEl = document.getElementById('cards-spread');

        this.drawnCards.forEach((card, index) => {
            setTimeout(() => {
                const position = this.positions[index];
                const cardEl = this.createCardElement(card, position, positionNames[position]);
                spreadEl.appendChild(cardEl);

                // 鐟欙箑褰傞弰鍓с仛閸斻劎鏁?
                setTimeout(() => {
                    cardEl.classList.add('revealed');
                }, 50);

                // 閺堚偓閸氬簼绔村鐘靛閺勫墽銇氶崥搴礉閸氼垳鏁ら柌宥嗘煀閹惰棄宕遍幐澶愭尦
                if (index === 2) {
                    setTimeout(() => {
                        document.getElementById('draw-button').disabled = false;
                        document.getElementById('draw-button').textContent = '棣冩敡 闁插秵鏌婇幎钘夊幢';
                    }, 800);
                }
            }, index * 1000);
        });
    }

    createCardElement(card, position, positionName) {
        const cardEl = document.createElement('div');
        cardEl.className = 'spread-card';

        const reversedClass = card.isReversed ? 'reversed' : '';
        const reversedBadge = card.isReversed ? '<div class="reversed-badge">闁棔缍?/div>' : '';

        cardEl.innerHTML = `
            <div class="card-position">${positionName}</div>
            <div class="flip-scene">
                <div class="flip-card ${reversedClass}">
                    <!-- 閸椔ゅ剹 -->
                    <div class="card-face card-back">
                        <div class="card-back-icon">棣冨閿?/div>
                        <div class="flip-hint">閻愮懓鍤紙鑽ゅ</div>
                    </div>
                    
                    <!-- 閸楋紕澧濆锝夋桨 -->
                    <div class="card-face card-front">
                        <div class="mini-card card-${card.id}">
                            ${reversedBadge}
                            <div class="mini-card-emoji">${card.emoji}</div>
                            <div class="mini-card-name">${card.name.en}</div>
                            <div class="mini-card-name-zh">${card.name.zh}</div>
                        </div>
                    </div>
                    
                    <!-- 缂堣崵澧濋悧瑙勬櫏鐎圭懓娅?-->
                    <div class="flip-particles"></div>
                </div>
            </div>
            <a href="card.html?card=${card.id}${card.isReversed ? '&reversed=true' : ''}" class="view-detail" style="opacity: 0; pointer-events: none;">閺屻儳婀呯拠锔藉剰 閿?/a>
        `;

        // 濞ｈ濮炵紙鑽ゅ娴溿倓绨?
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
    // 缂堣崵澧?
    flipCard.classList.add('flipped');

    // 閸忓鏅ラ悥鍡楀絺
    this.createFlipGlow(flipCard);

    // 缁帒鐡欓悥鍡楀絺
    this.createParticleBurst(flipCard);

    // 閺勫墽銇?閺屻儳婀呯拠锔藉剰"闁剧偓甯?
    setTimeout(() => {
        viewDetail.style.opacity = '1';
        viewDetail.style.pointerEvents = 'auto';
    }, 800);

    // 婢х偛濮炲鑼倳閻楀矁顓搁敓?
    this.flippedCount++;

    // 婵″倹鐏?瀵姷澧濋柈鐣岀倳瀵偓娴滃棴绱濋弰鍓с仛缂佺厧鎮庣憴锝堫嚢
    if (this.flippedCount === 3) {
        setTimeout(() => {
            this.generateReading();
        }, 1000); // 缁涘绶熺紙鑽ゅ閸斻劎鏁剧€瑰本鍨?
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

        // 闂呭繑婧€閺傜懓鎮?
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

        // 濞撳懐鎮?
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

            // 闂呭繑婧€閺傜懓鎮?
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

            // 濞撳懐鎮?
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
        // 濡偓濞村瀵岄敓?
        const theme = this.detectTheme(past, present, future);

        // 閻㈢喐鍨氱紒鐓庢値鐟欙綀顕?
        const questionContext = this.getQuestionContext();

        return `
            <p><strong>閿?閻楀矂妯€濮掑倸鍠?/strong></p>
            <p>鏉╂瑤绗佸鐘靛娑撹桨缍樼仦鏇犲箛閿?{theme.name}閻ㄥ嫭姊剧粙瀣剁礉閹活厾銇氶敓?{questionContext}閻ㄥ嫰鍣哥憰浣告儙缁€鐚存嫹?/p>

            <p><strong>棣冩惍 閺冨爼妫跨痪鍨瀻閿?/strong></p>
            <p>
                <strong>閵嗘劘绻冮崢浼欐嫹?{past.name.zh}</strong> - ${past.symbolism}<br>
                ${past.upright.meaning.substring(0, 150)}...<br><br>

                <strong>閵嗘劗骞囬崷顭掓嫹?{present.name.zh}</strong> - ${present.symbolism}<br>
                ${present.upright.meaning.substring(0, 150)}...<br><br>

                <strong>閵嗘劖婀弶銉嫹?{future.name.zh}</strong> - ${future.symbolism}<br>
                ${future.upright.meaning.substring(0, 150)}...
            </p>

            <p><strong>棣冨箚 閺嶇绺惧ú鐐茬檪</strong></p>
            <p>${this.generateInsight(past, present, future)}</p>

            <p><strong>棣冩寱 鐞涘苯濮╁楦款唴</strong></p>
            <p>${this.generateAdvice(past, present, future)}</p>

            <p style="margin-top: 30px; text-align: center; color: #c9a961;">
                閿?閻愮懓鍤稉濠冩煙閸楋紕澧濋崣顖涚叀閻鐦″鐘靛閻ㄥ嫯顕涚紒鍡毿掗敓?閿?
            </p>
        `;
    }

    detectTheme(past, present, future) {
    detectTheme() {
        return { name: 'Journey', description: 'Your tarot journey' };
    }
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
            love: '閻栬鲸鍎忛崗宕囬兇',
            career: '娴滃绗熼崣鎴濈潔',
            growth: '娑擃亙姹夐幋鎰版毐',
            general: '娴滆櫣鏁撻弮鍛柤'
        };
        return contexts[this.questionType] || contexts.general;
    }

    generateInsight(past, present, future) {
        const insights = [
            `閿?{past.name.zh}閿?{future.name.zh}閿涘奔缍橀惃鍕⒕缁嬪鍘栧鈥茬啊閹板繋绠熼敓?{past.keywords[0]}閻ㄥ嫮绮￠崢鍡楊敄闁姳绨￠悳鏉挎躬閿?{present.keywords[0]}閿涘矁鈧矁绻栨稉鈧崚鍥厴閹稿洤鎮?{future.keywords[0]}閻ㄥ嫭婀弶銉ｂ偓淇?

            `鏉╁洤骞撻敓?{past.name.zh}娑撹桨缍樼敮锔芥降閿?{past.keywords[0]}閻ㄥ嫪缍嬫灞烩偓鍌滃箛閸︺劎娈?{present.name.zh}閺勫墽銇氭担鐘愁劀婢跺嫪绨?{present.keywords[0]}閻ㄥ嫮濮搁幀浣碘偓鍌涙弓閺夈儳娈?{future.name.zh}妫板嫮銇氶惈鈧?{future.keywords[0]}閸楀啿鐨㈤崚鐗堟降閵嗕繖,

            `娴ｇ姷娈戞潻鍥у箵閿?{past.name.zh}閿涘鍘栭敓?{past.keywords[0]}閿涘苯顢栭柅鐘辩啊瑜版挷绗呴敓?{present.name.zh}閿涘娈?{present.keywords[0]}閵嗗倸顩ч弸婊€缍樼紒褏鐢昏ぐ鎾冲閻ㄥ嫰浜剧捄顖ょ礉${future.name.zh}閹碘偓娴狅綀銆冮敓?{future.keywords[0]}鐏忓棙鍨氭稉杞扮稑閻ㄥ嫮骞囩€圭偑鈧繖
        ];

        return insights[Math.floor(Math.random() * insights.length)];
    }

    generateAdvice(past, present, future) {
        return `
            閸╄桨绨?{past.name.zh}閻ㄥ嫮绮℃宀嬬礉娴ｇ姴鍑＄紒蹇擃劅閸掗绨＄€规繆鍚归惃鍕鐠囨拝鎷?
            閻滄澘婀敓?{present.name.zh}閹绘劙鍟嬫担鐘侯洣${present.keywords[0]}閿涘奔绻氶敓?{present.keywords[1]}閿?
            鐏炴洘婀滈張顏呮降閿?{future.name.zh}閻ㄥ嫯鍏橀柌蹇涚处閸斿彉缍?{future.upright.advice.substring(0, 100)}...
            鐠侀缍囬敓?{present.upright.advice.substring(0, 100)}...
        `;
    }
}

// 閸掓繂顫愰敓?
document.addEventListener('DOMContentLoaded', () => {
    const spread = new ThreeCardSpread();
    spread.init();
});

