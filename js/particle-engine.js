// 粒子效果引擎
// 支持多种粒子类型和自定义配置

class ParticleEngine {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = {
            type: 'floating-orbs',
            count: 50,
            colors: ['#FFD700'],
            size: [2, 8],
            speed: 0.5,
            glow: false,
            motion: 'random',
            ...config
        };

        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        // 设置Canvas尺寸
        this.resizeCanvas();

        // 创建粒子
        for (let i = 0; i < this.config.count; i++) {
            this.particles.push(this.createParticle(i));
        }

        // 开始动画
        this.animate();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticle(index) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const center = { x: w / 2, y: h / 2 };

        const particle = {
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * (this.config.size[1] - this.config.size[0]) + this.config.size[0],
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            alpha: Math.random() * 0.5 + 0.5,
            vx: (Math.random() - 0.5) * this.config.speed,
            vy: (Math.random() - 0.5) * this.config.speed,
            life: 1,
            maxLife: 1
        };

        // 根据类型初始化特殊属性
        switch (this.config.type) {
            case 'floating-orbs':
                particle.vy = -Math.abs(particle.vy) * 0.5; // 向上漂浮
                particle.wobble = Math.random() * Math.PI * 2;
                break;

            case 'energy-ring':
                particle.angle = (index / this.config.count) * Math.PI * 2;
                particle.radius = Math.min(w, h) * 0.3;
                particle.x = center.x + Math.cos(particle.angle) * particle.radius;
                particle.y = center.y + Math.sin(particle.angle) * particle.radius;
                particle.speed = this.config.speed || 0.02;
                break;

            case 'stardust':
                particle.vy *= 0.3;
                particle.vx *= 0.3;
                particle.twinkle = Math.random() * Math.PI * 2;
                break;

            case 'dissolve':
                particle.maxLife = Math.random() * 100 + 100;
                particle.life = particle.maxLife;
                particle.vx *= 2;
                particle.vy *= 2;
                break;

            case 'radial-burst':
                const angle = (index / this.config.count) * Math.PI * 2;
                particle.x = center.x;
                particle.y = center.y;
                particle.vx = Math.cos(angle) * this.config.speed;
                particle.vy = Math.sin(angle) * this.config.speed;
                particle.maxLife = Math.random() * 50 + 50;
                particle.life = particle.maxLife;
                break;
        }

        return particle;
    }

    updateParticle(p, index) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const center = { x: w / 2, y: h / 2 };

        switch (this.config.type) {
            case 'floating-orbs':
                p.wobble += 0.05;
                p.x += Math.sin(p.wobble) * 0.5;
                p.y += p.vy;

                // 边界检查
                if (p.y < -10) {
                    p.y = h + 10;
                    p.x = Math.random() * w;
                }
                break;

            case 'energy-ring':
                p.angle += p.speed;
                p.x = center.x + Math.cos(p.angle) * p.radius;
                p.y = center.y + Math.sin(p.angle) * p.radius;

                // 脉动效果
                p.size = (this.config.size[0] + this.config.size[1]) / 2 +
                    Math.sin(p.angle * 3) * 2;
                break;

            case 'stardust':
                p.x += p.vx;
                p.y += p.vy;
                p.twinkle += 0.1;
                p.alpha = 0.3 + Math.sin(p.twinkle) * 0.4;

                // 边界循环
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                break;

            case 'dissolve':
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                p.alpha = p.life / p.maxLife;

                if (p.life <= 0) {
                    Object.assign(p, this.createParticle(index));
                }
                break;

            case 'radial-burst':
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                p.alpha = p.life / p.maxLife;
                p.size *= 0.98;

                if (p.life <= 0) {
                    p.x = center.x;
                    p.y = center.y;
                    p.life = p.maxLife;
                    const angle = (index / this.config.count) * Math.PI * 2;
                    p.vx = Math.cos(angle) * this.config.speed;
                    p.vy = Math.sin(angle) * this.config.speed;
                }
                break;

            default: // random
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
        }
    }

    drawParticle(p) {
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;

        if (this.config.glow) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = p.color;
        }

        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            this.updateParticle(p, i);
            this.drawParticle(p);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 默认粒子配置
const PARTICLE_CONFIGS = {
    fool: {
        type: 'floating-orbs',
        count: 50,
        colors: ['#FFD700', '#FFA500', '#FFFFFF'],
        size: [2, 8],
        speed: 0.5,
        glow: true,
        motion: 'upward'
    },
    magician: {
        type: 'energy-ring',
        count: 80,
        colors: ['#FF6B6B', '#FF4444', '#FF8888'],
        size: [1, 4],
        speed: 0.02,
        glow: true
    },
    death: {
        type: 'dissolve',
        count: 60,
        colors: ['#424242', '#666666', '#888888'],
        size: [2, 6],
        speed: 1,
        glow: false
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleEngine, PARTICLE_CONFIGS };
}
