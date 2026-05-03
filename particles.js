// ===== SKY PARTICLE SYSTEM =====
// Dark mode: Twinkling stars with reddish/warm tones
// Light mode: Subtle floating sparkles
// GPU-accelerated, responsive, theme-aware

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let stars = [];
        let animationId;
        let width, height;
        let isMobile = window.innerWidth < 768;

        function getTheme() {
            return document.documentElement.getAttribute('data-theme') || 'dark';
        }

        // Config
        const CONFIG = {
            dark: {
                count: isMobile ? 80 : 180,
                minSize: 0.5,
                maxSize: isMobile ? 2 : 3,
                twinkleSpeed: 0.02,
                colors: [
                    // Warm white / cream
                    { r: 255, g: 245, b: 230 },
                    // Reddish (brand)
                    { r: 230, g: 80, b: 80 },
                    // Orange-red
                    { r: 255, g: 140, b: 80 },
                    // Pale blue
                    { r: 180, g: 200, b: 255 },
                    // Pure white
                    { r: 255, g: 255, b: 255 },
                ]
            },
            light: {
                count: isMobile ? 15 : 30,
                minSize: 1,
                maxSize: 2,
                twinkleSpeed: 0.008,
                colors: [
                    { r: 255, g: 255, b: 255 },
                    { r: 255, g: 230, b: 180 },
                ]
            }
        };

        // Resize
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            isMobile = window.innerWidth < 768;
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resize();
                createStars();
            }, 200);
        });

        // Star class
        class Star {
            constructor(config) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                this.baseOpacity = 0.2 + Math.random() * 0.6;
                this.twinkleSpeed = config.twinkleSpeed * (0.5 + Math.random());
                this.twinkleOffset = Math.random() * Math.PI * 2;
                this.opacity = this.baseOpacity;

                // Some stars are brighter (larger)
                if (Math.random() < 0.05) {
                    this.size *= 2;
                    this.baseOpacity = 0.7 + Math.random() * 0.3;
                    this.isBright = true;
                }
            }

            update(time) {
                // Twinkling effect
                const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
                this.opacity = this.baseOpacity + twinkle * 0.25;
                this.opacity = Math.max(0.05, Math.min(1, this.opacity));
            }

            draw(ctx) {
                const { r, g, b } = this.color;

                // Core star
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
                ctx.fill();

                // Glow for bright/large stars
                if (this.size > 2 || this.isBright) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity * 0.08})`;
                    ctx.fill();

                    // Cross/sparkle for very bright stars
                    if (this.isBright && this.opacity > 0.5) {
                        const sparkleLen = this.size * 4;
                        ctx.strokeStyle = `rgba(${r},${g},${b},${this.opacity * 0.15})`;
                        ctx.lineWidth = 0.5;

                        ctx.beginPath();
                        ctx.moveTo(this.x - sparkleLen, this.y);
                        ctx.lineTo(this.x + sparkleLen, this.y);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y - sparkleLen);
                        ctx.lineTo(this.x, this.y + sparkleLen);
                        ctx.stroke();
                    }
                }
            }
        }

        // Light mode sparkle (floating dust)
        class Sparkle {
            constructor(config) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                this.baseOpacity = 0.15 + Math.random() * 0.3;
                this.twinkleSpeed = config.twinkleSpeed * (0.5 + Math.random());
                this.twinkleOffset = Math.random() * Math.PI * 2;
                this.opacity = this.baseOpacity;
                this.speedX = (Math.random() - 0.5) * 0.15;
                this.speedY = -0.05 - Math.random() * 0.1; // Slowly float upward
                this.driftOffset = Math.random() * Math.PI * 2;
            }

            update(time) {
                // Gentle float
                this.x += this.speedX + Math.sin(time * 0.003 + this.driftOffset) * 0.1;
                this.y += this.speedY;

                // Wrap
                if (this.y < -10) this.y = height + 10;
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;

                // Twinkle
                const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
                this.opacity = this.baseOpacity + twinkle * 0.15;
                this.opacity = Math.max(0.05, Math.min(0.5, this.opacity));
            }

            draw(ctx) {
                const { r, g, b } = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
                ctx.fill();

                // Soft glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity * 0.1})`;
                ctx.fill();
            }
        }

        // Create particles
        function createStars() {
            stars = [];
            const theme = getTheme();
            const config = theme === 'light' ? CONFIG.light : CONFIG.dark;
            const count = theme === 'light' ? config.count : config.count;
            const ParticleClass = theme === 'light' ? Sparkle : Star;

            for (let i = 0; i < count; i++) {
                stars.push(new ParticleClass(config));
            }
        }

        // Occasional shooting star (dark mode only)
        let shootingStars = [];

        class ShootingStar {
            constructor() {
                this.x = Math.random() * width * 0.7;
                this.y = Math.random() * height * 0.4;
                this.length = 60 + Math.random() * 80;
                this.speed = 8 + Math.random() * 6;
                this.angle = (20 + Math.random() * 20) * Math.PI / 180;
                this.opacity = 0.7 + Math.random() * 0.3;
                this.life = 0;
                this.maxLife = this.length / this.speed * 3;
                this.trail = [];
            }

            update() {
                this.life++;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 15) this.trail.shift();

                return this.life < this.maxLife && this.x < width + 100 && this.y < height + 100;
            }

            draw(ctx) {
                if (this.trail.length < 2) return;

                const progress = this.life / this.maxLife;
                const fadeOut = progress > 0.6 ? 1 - (progress - 0.6) / 0.4 : 1;

                for (let i = 1; i < this.trail.length; i++) {
                    const t = i / this.trail.length;
                    const alpha = t * this.opacity * fadeOut;

                    ctx.beginPath();
                    ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                    ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    ctx.strokeStyle = `rgba(255,200,150,${alpha})`;
                    ctx.lineWidth = (1 - t) * 2 + 0.5;
                    ctx.stroke();
                }

                // Bright head
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,240,220,${this.opacity * fadeOut})`;
                ctx.fill();
            }
        }

        // Animate
        let time = 0;
        let lastTheme = getTheme();

        function animate() {
            time++;
            ctx.clearRect(0, 0, width, height);

            // Check for theme change → recreate particles
            const currentTheme = getTheme();
            if (currentTheme !== lastTheme) {
                lastTheme = currentTheme;
                createStars();
            }

            stars.forEach(s => {
                s.update(time);
                s.draw(ctx);
            });

            // Shooting stars (dark mode only)
            if (currentTheme !== 'light') {
                // Random chance to spawn shooting star
                if (Math.random() < 0.001 && shootingStars.length < 2) {
                    shootingStars.push(new ShootingStar());
                }

                shootingStars = shootingStars.filter(ss => {
                    const alive = ss.update();
                    if (alive) ss.draw(ctx);
                    return alive;
                });
            }

            animationId = requestAnimationFrame(animate);
        }

        // Visibility API
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });

        // Start
        resize();
        createStars();
        animate();
    }
})();
