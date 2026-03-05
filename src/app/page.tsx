"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Petals from '@/components/Petals/Petals';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import BuyModal from '@/components/Modal/BuyModal';

// Mock Data
const BOUQUETS = [
  { id: 1, title: 'Amor Eterno', price: 120.00, type: 'Rosas', color: 'Red', description: 'Um clássico buquê de rosas vermelhas para declarar seu amor eterno.', image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Pureza da Manhã', price: 95.50, type: 'Lírios', color: 'White', description: 'Lírios brancos frescos que trazem paz e serenidade.', image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Jardim de Primavera', price: 85.00, type: 'Tulipas', color: 'Pink', description: 'Tulipas coloridas para alegrar qualquer ambiente.', image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Orquídea Real', price: 150.00, type: 'Orquídeas', color: 'Purple', description: 'Elegância e sofisticação em forma de flor.', image: 'https://images.unsplash.com/photo-1566939947968-30dd93c8346e?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Paixão Ardente', price: 130.00, type: 'Rosas', color: 'Red', description: 'Rosas vermelhas intensas com acabamento premium.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Doce Encanto', price: 90.00, type: 'Margaridas', color: 'White', description: 'Simplicidade e beleza em um arranjo delicado.', image: 'https://images.unsplash.com/photo-1602615576820-ea14cf3e476a?auto=format&fit=crop&w=800&q=80' },
  { id: 7, title: 'Sol Radiante', price: 75.00, type: 'Girassóis', color: 'Yellow', description: 'Energia positiva e vibração com girassóis selecionados.', image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=800&q=80' },
  { id: 8, title: 'Blue Moon', price: 110.00, type: 'Rosas', color: 'Blue', description: 'Rosas azuis raras e exóticas para momentos únicos.', image: 'https://images.unsplash.com/photo-1496857239036-1fb137683000?auto=format&fit=crop&w=800&q=80' },
  { id: 9, title: 'Veludo Negro', price: 140.00, type: 'Rosas', color: 'Purple', description: 'Rosas púrpuras profundas para um toque de mistério.', image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=800&q=80' },
  { id: 10, title: 'Romance Suave', price: 105.00, type: 'Rosas', color: 'Pink', description: 'Tons pasteis para um romance doce e leve.', image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&w=800&q=80' }
];

export default function Home() {
  const [filteredBouquets, setFilteredBouquets] = useState(BOUQUETS);
  const [selectedBouquet, setSelectedBouquet] = useState<typeof BOUQUETS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = (bouquet: typeof BOUQUETS[0]) => {
    setSelectedBouquet(bouquet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBouquet(null), 300); // Wait for animation
  };

  const handleConfirmPurchase = () => {
    alert(`Compra de "${selectedBouquet?.title}" iniciada! Em breve: fluxo de checkout.`);
    setIsModalOpen(false);
  };

  const handleFilterChange = (filters: any) => {
    let result = BOUQUETS;

    if (filters.colors.length > 0) {
      result = result.filter(b => filters.colors.includes(b.color));
    }

    if (filters.types.length > 0) {
      result = result.filter(b => filters.types.includes(b.type));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.replace('+', '').split('-').map(Number);
      if (max) {
        result = result.filter(b => b.price >= min && b.price <= max);
      } else {
        result = result.filter(b => b.price >= min);
      }
    }

    setFilteredBouquets(result);
  };

  return (
    <div className={styles.container}>
      <Petals />

      <Sidebar onFilterChange={handleFilterChange} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={`${styles.title} title-gradient`}>Temática Buquês</h1>
          <p className={styles.subtitle}>
            Descubra a magia de presentear com flores selecionadas especialmente para você.
          </p>
        </div>

        <div className={styles.grid}>
          {filteredBouquets.map((bouquet, index) => (
            <Card
              key={bouquet.id}
              title={bouquet.title}
              price={bouquet.price}
              description={bouquet.description}
              imageUrl={bouquet.image}
              delay={index * 100} // Staggered animation
              onBuy={() => handleBuyClick(bouquet)}
            />
          ))}
        </div>

        {filteredBouquets.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', color: '#888' }}>
            Nenhum buquê encontrado com esses filtros. Tente limpar os filtros.
          </div>
        )}

        {/* Modal */}
        <BuyModal
          bouquet={selectedBouquet}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmPurchase}
        />

        <footer className={styles.footer}>
          © 2026 Temática Buquê. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  );
}
