"use client";

import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { Filter, X, ChevronRight, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

interface FilterState {
    category: string | null;
    sortOrder: 'asc' | 'desc' | 'bestsellers' | null;
}

interface SidebarProps {
    onFilterChange: (filters: FilterState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        category: null,
        sortOrder: null,
    });

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleCategoryToggle = (category: string) => {
        const newCategory = filters.category === category ? null : category;
        const newFilters = { ...filters, category: newCategory };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSortChange = (order: 'asc' | 'desc' | 'bestsellers') => {
        const newSort = filters.sortOrder === order ? null : order;
        const newFilters = { ...filters, sortOrder: newSort };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const resetFilters: FilterState = { category: null, sortOrder: null };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const categories = [
        'Premium',
        'Mini Buquês',
        'Flores Individuais',
        'Cestas',
        'Presentes',
        'Decorativas',
        'Caixas Surpresa'
    ];

    const isAnyFilterActive = filters.category !== null || filters.sortOrder !== null;

    return (
        <>
            <button
                className={styles.mobileToggle}
                onClick={toggleSidebar}
                aria-label="Toggle filters"
            >
                {isOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
                <span>{isOpen ? 'Fechar' : 'Filtrar'}</span>
            </button>

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>
                        <Filter size={18} />
                        Filtros
                    </h2>
                    {isAnyFilterActive && (
                        <button className={styles.clearBtn} onClick={clearFilters}>
                            Limpar
                        </button>
                    )}
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <Sparkles size={14} />
                        Categorias
                    </h3>
                    <div className={styles.categoryList}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.categoryBtn} ${filters.category === cat ? styles.active : ''}`}
                                onClick={() => handleCategoryToggle(cat)}
                            >
                                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                                <ChevronRight size={14} className={styles.arrow} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        <ArrowUpDown size={14} />
                        Ordenar por
                    </h3>
                    <div className={styles.sortGroup}>
                        <button
                            className={`${styles.sortBtn} ${filters.sortOrder === 'bestsellers' ? styles.active : ''}`}
                            onClick={() => handleSortChange('bestsellers')}
                        >
                            🔥 Mais Vendidos
                        </button>
                        <button
                            className={`${styles.sortBtn} ${filters.sortOrder === 'desc' ? styles.active : ''}`}
                            onClick={() => handleSortChange('desc')}
                        >
                            Menor Preço
                        </button>
                        <button
                            className={`${styles.sortBtn} ${filters.sortOrder === 'asc' ? styles.active : ''}`}
                            onClick={() => handleSortChange('asc')}
                        >
                            Maior Preço
                        </button>
                    </div>
                </div>

                <div className={styles.infoBadge}>
                    <p>Encontre o presente perfeito em segundos.</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
