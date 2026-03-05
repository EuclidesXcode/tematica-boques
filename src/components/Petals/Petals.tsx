"use client";

import React, { useEffect, useState } from 'react';
import styles from './Petals.module.css';

interface PetalProps {
    id: number;
    style: React.CSSProperties;
}

const Petals: React.FC = () => {
    const [petals, setPetals] = useState<PetalProps[]>([]);

    useEffect(() => {
        // Generate petals only on client to avoid hydration mismatch
        const newPetals: PetalProps[] = [];
        const count = 30; // Number of falling petals

        for (let i = 0; i < count; i++) {
            const size = Math.random() * 15 + 10; // 10px to 25px
            const startX = Math.random() * 100; // 0% to 100%vw
            const endX = startX + (Math.random() * 20 - 10); // Drift +/- 10vw
            const duration = Math.random() * 10 + 10; // 10s to 20s fall time
            const delay = Math.random() * 15; // Random delay up to 15s
            const scale = Math.random() * 0.5 + 0.5; // 0.5 to 1.0 scale
            const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8 opacity

            const style: React.CSSProperties = {
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animationDuration: `${duration}s`,
                animationDelay: `-${delay}s`, // Start immediately at different points
                '--start-x': `${startX}vw`,
                '--end-x': `${endX}vw`,
                '--scale': scale,
                '--opacity': opacity,
                left: 0, // Using translate3d for positioning relative to viewport
            } as React.CSSProperties;

            newPetals.push({ id: i, style });
        }

        setPetals(newPetals);
    }, []);

    return (
        <div className={styles.container} aria-hidden="true">
            {petals.map((petal) => (
                <div key={petal.id} className={styles.petal} style={petal.style} />
            ))}
        </div>
    );
};

export default Petals;
