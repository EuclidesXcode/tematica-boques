"use client";

import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface FilterState {
    colors: string[];
    types: string[];
    priceRange: string | null;
}

interface SidebarProps {
    onFilterChange: (filters: FilterState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        colors: [],
        types: [],
        priceRange: null,
    });

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleColorToggle = (color: string) => {
        const newColors = filters.colors.includes(color)
            ? filters.colors.filter((c) => c !== color)
            : [...filters.colors, color];

        const newFilters = { ...filters, colors: newColors };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleTypeToggle = (type: string) => {
        const newTypes = filters.types.includes(type)
            ? filters.types.filter((t) => t !== type)
            : [...filters.types, type];

        const newFilters = { ...filters, types: newTypes };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (range: string) => {
        const newPrice = filters.priceRange === range ? null : range;
        const newFilters = { ...filters, priceRange: newPrice };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const colors = [
        { name: 'Red', hex: '#ef5350' },
        { name: 'White', hex: '#fff' },
        { name: 'Pink', hex: '#ec407a' },
        { name: 'Blue', hex: '#42a5f5' },
        { name: 'Yellow', hex: '#ffeb3b' },
        { name: 'Purple', hex: '#ab47bc' },
    ];

    const types = ['Rosas', 'Lírios', 'Tulipas', 'Orquídeas', 'Margaridas', 'Girassóis'];
    const prices = ['0-50', '50-100', '100-200', '200+'];

    return (
        <>
            <button
                className={styles.mobileToggle}
                onClick={toggleSidebar}
                aria-label="Toggle filters"
            >
                {isOpen ? '✕' : 'Filtros'}
            </button>

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Filtrar por Cor</h3>
                    <div className={styles.colorGroup}>
                        {colors.map((c) => (
                            <div
                                key={c.name}
                                className={`${styles.colorCircle} ${filters.colors.includes(c.name) ? styles.active : ''}`}
                                style={{ backgroundColor: c.hex }}
                                onClick={() => handleColorToggle(c.name)}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Tipo de Flor</h3>
                    <div className={styles.filterGroup}>
                        {types.map((type) => (
                            <label key={type} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={filters.types.includes(type)}
                                    onChange={() => handleTypeToggle(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Faixa de Preço</h3>
                    <div className={styles.filterGroup}>
                        {prices.map((price) => (
                            <label key={price} className={styles.checkboxLabel}>
                                <input
                                    type="radio"
                                    name="price"
                                    className={styles.checkbox}
                                    checked={filters.priceRange === price}
                                    onChange={() => handlePriceChange(price)}
                                    value={price}
                                />
                                R$ {price}
                            </label>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
