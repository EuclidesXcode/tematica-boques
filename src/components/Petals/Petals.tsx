"use client";

import React, { useEffect, useRef } from 'react';

const Petals: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = 120; // Fewer particles for a cleaner look
        const mouse = { x: -1000, y: -1000, radius: 180 };

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            density: number;
            alpha: number;
            baseAlpha: number;
            angle: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 3 + 1; // Subtle small particles/bokeh
                this.density = (Math.random() * 20) + 1;
                this.baseAlpha = Math.random() * 0.4 + 0.3;
                this.alpha = this.baseAlpha;
                this.angle = Math.random() * Math.PI * 2;
            }

            draw() {
                ctx!.beginPath();
                const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
                gradient.addColorStop(0, `rgba(212, 165, 165, ${this.alpha})`); // Dusty Rose
                gradient.addColorStop(1, `rgba(212, 165, 165, 0)`);

                ctx!.fillStyle = gradient;
                ctx!.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                ctx!.fill();
            }

            update() {
                // Floating movement
                this.angle += 0.01;
                this.baseX += Math.cos(this.angle) * 0.2;
                this.baseY += Math.sin(this.angle) * 0.2;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = (dx / distance) * force * this.density;
                    const directionY = (dy / distance) * force * this.density;

                    this.x -= directionX;
                    this.y -= directionY;
                    this.alpha = Math.min(0.6, this.alpha + 0.02); // Glow brighter when approached
                } else {
                    if (this.x !== this.baseX) {
                        this.x -= (this.x - this.baseX) / 20;
                    }
                    if (this.y !== this.baseY) {
                        this.y -= (this.y - this.baseY) / 20;
                    }
                    if (this.alpha > this.baseAlpha) {
                        this.alpha -= 0.005;
                    }
                }
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'radial-gradient(circle at top right, #fff5f7 0%, #ffffff 100%)' // Very soft blush white
            }}
        />
    );
};

export default Petals;
