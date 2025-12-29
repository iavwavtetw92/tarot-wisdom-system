/**
 * 愚者粒子系统
 * 基于RCTFO专家团队设计方案
 * 35个向上漂浮的光球，hover时加速并增加数量
 */

class FoolParticleSystem {
    constructor(canvas, cardElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cardElement = cardElement;
        this.particles = [];
        this.isHovered = false;
        this.animationId = null;

        this.init();
    }

    init() {
        // 设置canvas尺寸
        this.resizeCanvas();

        // 创建35个初始粒子
        for (let i = 0; i < 35; i++) {
            this.particles.push(this.createParticle());
        }

        // 绑定hover事件
        this.cardElement.addEventListener('mouseenter', () => this.onHover(true));
        this.cardElement.addEventListener('mouseleave', () => this.onHover(false));

        // 开始动画
        this.animate();
    }

    resizeCanvas() {
        const rect = this.cardElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticle() {
        const colors = ['#ffd700', '#ffed4e', '#87ceeb', '#ffffff'];
        const colorWeights = [0.5, 0.3, 0.15, 0.05]; // 金色为主

        // 加权随机选择颜色
        let rand = Math.random();
        let color = colors[0];
        let cumulative = 0;
        for (let i = 0; i < colors.length; i++) {
            cumulative += colorWeights[i];
            if (rand <= cumulative) {
                color = colors[i];
                break;
            }
        }

        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + Math.random() * 50, // 从底部开始
            size: 3 + Math.random() * 5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -0.3 - Math.random() * 0.9, // 向上漂浮
            opacity: 0.4 + Math.random() * 0.5,
            color: color,
            sparkleChance: Math.random() > 0.9 // 10%的粒子会闪烁
        };
    }

    onHover(isHovered) {
        this.isHovered = isHovered;

        if (isHovered) {
            // hover时增加10个粒子
            for (let i = 0; i < 10; i++) {
                this.particles.push(this.createParticle());
            }
        } else {
            // 离开hover时，逐渐减少到35个
            if (this.particles.length > 35) {
                this.particles.splice(35, this.particles.length - 35);
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            // 更新位置
            const speedMultiplier = this.isHovered ? 2.5 : 1;
            p.y += p.speedY * speedMultiplier;
            p.x += p.speedX;

            // 边界检测 - 从底部重新进入
            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = Math.random() * this.canvas.width;
            }

            // 水平边界反弹
            if (p.x < 0 || p.x > this.canvas.width) {
                p.speedX *= -1;
            }

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();

            // 添加白色闪光效果
            if (p.sparkleChance && Math.random() > 0.95) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.globalAlpha = 0.8;
                this.ctx.stroke();
            }
        });

        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 导出供全局使用
window.FoolParticleSystem = FoolParticleSystem;
