/**
 * 全屏粒子系统 - 塔罗牌主题特效
 * 为每张塔罗牌提供独特的全屏粒子背景效果
 */

class FullscreenParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.currentTheme = null;
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;

        this.init();
    }

    init() {
        // 创建全屏Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'fullscreen-particles';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 1s ease';

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // 设置Canvas尺寸
        this.resizeCanvas();

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resizeCanvas());

        // 监听鼠标移动（用于交互效果）
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * 激活指定塔罗牌的粒子主题
     * @param {string} cardId - 卡牌ID（如 'fool', 'magician'）
     */
    activate(cardId) {
        this.currentTheme = this.getTheme(cardId);
        this.particles = [];

        // 创建粒子
        for (let i = 0; i < this.currentTheme.count; i++) {
            this.particles.push(this.createParticle());
        }

        // 显示Canvas
        this.canvas.style.opacity = '1';
        this.isActive = true;

        // 开始动画
        if (!this.animationId) {
            this.animate();
        }
    }

    /**
     * 停用粒子效果
     */
    deactivate() {
        this.canvas.style.opacity = '0';
        this.isActive = false;

        setTimeout(() => {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            this.particles = [];
        }, 1000);
    }

    /**
     * 获取卡牌主题配置
     */
    getTheme(cardId) {
        const themes = {
            // 0. 愚者 - 向上漂浮的金色光球
            fool: {
                type: 'floating_orbs',
                colors: ['#ffd700', '#ffed4e', '#87ceeb', '#ffffff'],
                colorWeights: [0.5, 0.3, 0.15, 0.05],
                count: 60,
                size: { min: 3, max: 8 },
                speed: { x: 0.5, y: { min: -1.5, max: -0.5 } },
                behavior: 'upward_drift',
                glow: true,
                interactive: true
            },

            // 1. 魔术师 - 螺旋爆发的彩色火花
            magician: {
                type: 'magic_sparks',
                colors: ['#ff6b6b', '#ffd700', '#4ecdc4', '#ff69b4'],
                colorWeights: [0.3, 0.3, 0.2, 0.2],
                count: 80,
                size: { min: 2, max: 6 },
                speed: { x: 2, y: 2 },
                behavior: 'spiral_burst',
                glow: true,
                trail: true
            },

            // 2. 女祭司 - 轻柔飘落的月尘
            high_priestess: {
                type: 'moon_dust',
                colors: ['#c9a0dc', '#ffffff', '#87ceeb', '#e6e6fa'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 70,
                size: { min: 2, max: 5 },
                speed: { x: 0.3, y: { min: 0.3, max: 0.8 } },
                behavior: 'gentle_fall',
                glow: true,
                twinkle: true
            },

            // 3. 女皇 - 旋转飞舞的花瓣
            empress: {
                type: 'flower_petals',
                colors: ['#ff69b4', '#ffb6c1', '#98fb98', '#ffd700'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 50,
                size: { min: 4, max: 10 },
                speed: { x: 1, y: { min: 0.5, max: 1.2 } },
                behavior: 'swirl_dance',
                rotation: true
            },

            // 4. 皇帝 - 下落的金币
            emperor: {
                type: 'golden_coins',
                colors: ['#ffd700', '#ff8c00', '#daa520'],
                colorWeights: [0.6, 0.3, 0.1],
                count: 40,
                size: { min: 5, max: 12 },
                speed: { x: 0.5, y: { min: 1, max: 2 } },
                behavior: 'heavy_fall',
                glow: true,
                rotation: true
            },

            // 5. 教皇 - 神圣光芒
            hierophant: {
                type: 'holy_light',
                colors: ['#ffd700', '#ffffff', '#fffacd'],
                colorWeights: [0.5, 0.3, 0.2],
                count: 50,
                size: { min: 3, max: 7 },
                speed: { x: 0.2, y: { min: -0.5, max: 0.5 } },
                behavior: 'radial_glow',
                glow: true
            },

            // 6. 恋人 - 心形粒子
            lovers: {
                type: 'heart_particles',
                colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ff6b6b'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 60,
                size: { min: 4, max: 9 },
                speed: { x: 0.8, y: { min: -1, max: -0.3 } },
                behavior: 'floating_hearts',
                glow: true
            },

            // 7. 战车 - 快速流星
            chariot: {
                type: 'shooting_stars',
                colors: ['#4169e1', '#00bfff', '#ffffff', '#ffd700'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 30,
                size: { min: 3, max: 8 },
                speed: { x: 5, y: 3 },
                behavior: 'fast_streak',
                trail: true,
                glow: true
            },

            // 8. 力量 - 金色能量波
            strength: {
                type: 'energy_waves',
                colors: ['#ffd700', '#ff8c00', '#ffed4e'],
                colorWeights: [0.5, 0.3, 0.2],
                count: 55,
                size: { min: 4, max: 10 },
                speed: { x: 1, y: 1 },
                behavior: 'wave_pulse',
                glow: true
            },

            // 9. 隐士 - 雪花飘落
            hermit: {
                type: 'snowflakes',
                colors: ['#ffffff', '#e0ffff', '#b0e0e6'],
                colorWeights: [0.6, 0.3, 0.1],
                count: 65,
                size: { min: 2, max: 6 },
                speed: { x: 0.5, y: { min: 0.3, max: 1 } },
                behavior: 'gentle_fall',
                twinkle: true
            },

            // 10. 命运之轮 - 旋转光点
            wheel_of_fortune: {
                type: 'spinning_lights',
                colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#9b59b6'],
                colorWeights: [0.25, 0.25, 0.25, 0.25],
                count: 70,
                size: { min: 3, max: 7 },
                speed: { x: 2, y: 2 },
                behavior: 'circular_spin',
                glow: true,
                trail: true
            },

            // 11. 正义 - 对称光芒
            justice: {
                type: 'balanced_rays',
                colors: ['#ffd700', '#ffffff', '#4169e1'],
                colorWeights: [0.5, 0.3, 0.2],
                count: 50,
                size: { min: 3, max: 8 },
                speed: { x: 0.5, y: 0.5 },
                behavior: 'symmetrical',
                glow: true
            },

            // 12. 倒吊人 - 倒置水滴
            hanged_man: {
                type: 'inverted_drops',
                colors: ['#87ceeb', '#4682b4', '#5f9ea0'],
                colorWeights: [0.5, 0.3, 0.2],
                count: 60,
                size: { min: 3, max: 7 },
                speed: { x: 0.3, y: { min: -1.2, max: -0.5 } },
                behavior: 'upward_drift',
                glow: true
            },

            // 13. 死神 - 暗色灰烬
            death: {
                type: 'dark_ashes',
                colors: ['#696969', '#2f4f4f', '#000000', '#8b4513'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 75,
                size: { min: 2, max: 5 },
                speed: { x: 0.8, y: { min: 0.5, max: 1.5 } },
                behavior: 'chaotic_drift',
                fade: true
            },

            // 14. 节制 - 彩虹水滴
            temperance: {
                type: 'rainbow_drops',
                colors: ['#ff6b6b', '#ffd700', '#4ecdc4', '#9b59b6', '#98fb98'],
                colorWeights: [0.2, 0.2, 0.2, 0.2, 0.2],
                count: 65,
                size: { min: 3, max: 7 },
                speed: { x: 0.5, y: { min: 0.5, max: 1.2 } },
                behavior: 'gentle_fall',
                glow: true
            },

            // 15. 恶魔 - 暗红火焰
            devil: {
                type: 'dark_flames',
                colors: ['#8b0000', '#ff4500', '#ff6347', '#000000'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 70,
                size: { min: 4, max: 10 },
                speed: { x: 1, y: { min: -1.5, max: -0.5 } },
                behavior: 'flame_rise',
                glow: true,
                flicker: true
            },

            // 16. 高塔 - 闪电碎片
            tower: {
                type: 'lightning_shards',
                colors: ['#ffff00', '#ffffff', '#00bfff', '#ffd700'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 90,
                size: { min: 2, max: 8 },
                speed: { x: 3, y: 4 },
                behavior: 'chaotic_burst',
                glow: true,
                flicker: true
            },

            // 17. 星星 - 闪烁星光
            star: {
                type: 'twinkling_stars',
                colors: ['#ffffff', '#ffd700', '#87ceeb', '#e0ffff'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 100,
                size: { min: 2, max: 6 },
                speed: { x: 0.2, y: 0.2 },
                behavior: 'gentle_drift',
                twinkle: true,
                glow: true
            },

            // 18. 月亮 - 银色月光
            moon: {
                type: 'moonlight',
                colors: ['#c0c0c0', '#e6e6fa', '#b0c4de', '#ffffff'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 70,
                size: { min: 3, max: 7 },
                speed: { x: 0.3, y: { min: 0.3, max: 0.8 } },
                behavior: 'gentle_fall',
                glow: true,
                twinkle: true
            },

            // 19. 太阳 - 金色阳光
            sun: {
                type: 'sunlight',
                colors: ['#ffd700', '#ffed4e', '#ff8c00', '#ffff00'],
                colorWeights: [0.4, 0.3, 0.2, 0.1],
                count: 80,
                size: { min: 4, max: 10 },
                speed: { x: 0.5, y: 0.5 },
                behavior: 'radial_glow',
                glow: true,
                pulse: true
            },

            // 20. 审判 - 圣光降临
            judgement: {
                type: 'divine_light',
                colors: ['#ffffff', '#ffd700', '#87ceeb'],
                colorWeights: [0.5, 0.3, 0.2],
                count: 60,
                size: { min: 3, max: 8 },
                speed: { x: 0.3, y: { min: -1, max: -0.3 } },
                behavior: 'upward_drift',
                glow: true,
                pulse: true
            },

            // 21. 世界 - 宇宙星尘
            world: {
                type: 'cosmic_dust',
                colors: ['#9b59b6', '#3498db', '#ffd700', '#ffffff', '#e74c3c'],
                colorWeights: [0.25, 0.25, 0.2, 0.2, 0.1],
                count: 100,
                size: { min: 2, max: 7 },
                speed: { x: 1, y: 1 },
                behavior: 'orbital',
                glow: true,
                trail: true
            }
        };

        return themes[cardId] || themes.fool;
    }

    /**
     * 创建单个粒子
     */
    createParticle() {
        const theme = this.currentTheme;

        // 加权随机选择颜色
        let rand = Math.random();
        let color = theme.colors[0];
        let cumulative = 0;
        for (let i = 0; i < theme.colors.length; i++) {
            cumulative += theme.colorWeights[i];
            if (rand <= cumulative) {
                color = theme.colors[i];
                break;
            }
        }

        // 根据行为模式设置初始位置
        let x, y;
        switch (theme.behavior) {
            case 'spiral_burst':
            case 'radial_glow':
                // 从中心爆发
                x = this.canvas.width / 2;
                y = this.canvas.height / 2;
                break;
            case 'upward_drift':
            case 'flame_rise':
                // 从底部开始
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + Math.random() * 100;
                break;
            default:
                // 随机位置
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
        }

        const size = theme.size.min + Math.random() * (theme.size.max - theme.size.min);

        let speedX, speedY;
        if (typeof theme.speed.y === 'object') {
            speedX = (Math.random() - 0.5) * theme.speed.x;
            speedY = theme.speed.y.min + Math.random() * (theme.speed.y.max - theme.speed.y.min);
        } else {
            const angle = Math.random() * Math.PI * 2;
            speedX = Math.cos(angle) * theme.speed.x;
            speedY = Math.sin(angle) * theme.speed.y;
        }

        return {
            x,
            y,
            size,
            speedX,
            speedY,
            color,
            opacity: 0.4 + Math.random() * 0.6,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            life: 1,
            maxLife: 1,
            twinklePhase: Math.random() * Math.PI * 2,
            pulsePhase: Math.random() * Math.PI * 2
        };
    }

    /**
     * 动画循环
     */
    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.016;

        this.particles.forEach((p, index) => {
            this.updateParticle(p);
            this.drawParticle(p);

            // 粒子死亡后重生
            if (p.life <= 0 || this.isOutOfBounds(p)) {
                this.particles[index] = this.createParticle();
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * 更新粒子状态
     */
    updateParticle(p) {
        const theme = this.currentTheme;

        // 基础运动
        switch (theme.behavior) {
            case 'spiral_burst':
                const angle = Math.atan2(p.y - this.canvas.height / 2, p.x - this.canvas.width / 2);
                p.speedX = Math.cos(angle + 0.1) * 2;
                p.speedY = Math.sin(angle + 0.1) * 2;
                break;

            case 'circular_spin':
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                const radius = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
                const currentAngle = Math.atan2(p.y - centerY, p.x - centerX);
                const newAngle = currentAngle + 0.02;
                p.x = centerX + Math.cos(newAngle) * radius;
                p.y = centerY + Math.sin(newAngle) * radius;
                return;

            case 'orbital':
                const orbitCenterX = this.canvas.width / 2;
                const orbitCenterY = this.canvas.height / 2;
                const orbitAngle = Math.atan2(p.y - orbitCenterY, p.x - orbitCenterX) + 0.01;
                const orbitRadius = Math.sqrt(Math.pow(p.x - orbitCenterX, 2) + Math.pow(p.y - orbitCenterY, 2));
                p.x = orbitCenterX + Math.cos(orbitAngle) * orbitRadius;
                p.y = orbitCenterY + Math.sin(orbitAngle) * orbitRadius;
                break;

            case 'swirl_dance':
                p.speedX += Math.sin(this.time * 2) * 0.05;
                break;

            case 'wave_pulse':
                p.speedY = Math.sin(this.time * 3 + p.x * 0.01) * 0.5;
                break;
        }

        // 应用速度
        p.x += p.speedX;
        p.y += p.speedY;

        // 旋转
        if (theme.rotation) {
            p.rotation += p.rotationSpeed;
        }

        // 鼠标交互
        if (theme.interactive) {
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                p.x -= (dx / distance) * force * 2;
                p.y -= (dy / distance) * force * 2;
            }
        }

        // 生命周期
        if (theme.fade) {
            p.life -= 0.005;
            p.opacity = p.life;
        }
    }

    /**
     * 绘制粒子
     */
    drawParticle(p) {
        const theme = this.currentTheme;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);

        if (theme.rotation) {
            this.ctx.rotate(p.rotation);
        }

        // 闪烁效果
        let opacity = p.opacity;
        if (theme.twinkle) {
            opacity *= 0.5 + Math.sin(this.time * 5 + p.twinklePhase) * 0.5;
        }

        // 脉冲效果
        let size = p.size;
        if (theme.pulse) {
            size *= 0.8 + Math.sin(this.time * 3 + p.pulsePhase) * 0.2;
        }

        // 闪烁效果（恶魔、高塔）
        if (theme.flicker) {
            opacity *= 0.7 + Math.random() * 0.3;
        }

        // 绘制光晕
        if (theme.glow) {
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = opacity * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 绘制粒子主体
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = opacity;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        this.ctx.fill();

        // 拖尾效果
        if (theme.trail) {
            this.ctx.globalAlpha = opacity * 0.3;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.speedX * 3, -p.speedY * 3, 2, 2);
        }

        this.ctx.restore();
    }

    /**
     * 检查粒子是否超出边界
     */
    isOutOfBounds(p) {
        const margin = 100;
        return (
            p.x < -margin ||
            p.x > this.canvas.width + margin ||
            p.y < -margin ||
            p.y > this.canvas.height + margin
        );
    }

    /**
     * 销毁系统
     */
    destroy() {
        this.deactivate();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 导出供全局使用
window.FullscreenParticleSystem = FullscreenParticleSystem;
