"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Petals from '@/components/Petals/Petals';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import BuyModal from '@/components/Modal/BuyModal';
import { createClient } from '@/lib/supabase';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [allBouquets, setAllBouquets] = useState<any[]>([]);
  const [filteredBouquets, setFilteredBouquets] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedBouquet, setSelectedBouquet] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchBouquets() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("bouquets")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAllBouquets(data || []);
        setFilteredBouquets(data || []);
      } catch (error) {
        console.error("Erro ao buscar buquês:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBouquets();
  }, []);

  const handleBuyClick = (bouquet: any) => {
    setSelectedBouquet({
      ...bouquet,
      title: bouquet.name,
      image: bouquet.images?.[0] || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBouquet(null), 300);
  };

  const handleConfirmPurchase = () => {
    alert(`Compra de "${selectedBouquet?.name}" iniciada! Em breve: fluxo de checkout.`);
    setIsModalOpen(false);
  };

  const handleFilterChange = (filters: any) => {
    let result = allBouquets;
    setVisibleCount(ITEMS_PER_PAGE); // Reset visible count on filter

    if (filters.colors.length > 0) {
      result = result.filter(b =>
        filters.colors.some((color: string) =>
          b.name.toLowerCase().includes(color.toLowerCase()) ||
          b.description.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    if (filters.types.length > 0) {
      result = result.filter(b =>
        filters.types.some((type: string) =>
          b.name.toLowerCase().includes(type.toLowerCase()) ||
          b.description.toLowerCase().includes(type.toLowerCase())
        )
      );
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

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const visibleBouquets = filteredBouquets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBouquets.length;

  return (
    <div className={styles.container}>
      <Petals />

      <Sidebar onFilterChange={handleFilterChange} />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={`${styles.title} title-gradient`}>Temática Buquês</h1>
          <p className={styles.subtitle}>
            Descubra a magia de presentear com flores selecionadas especialmente para você.
          </p>
        </header>

        {/* Intro Section - Sobre a Dona */}
        <section className={styles.introSection}>
          <div className={styles.profileImageWrapper}>
            <Image
              src="/perfil.png"
              alt="Dona da Temática Buquês"
              width={180}
              height={180}
              className={styles.profileImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.introContent}>
            <h2 className={styles.ownerName}>Nossa História & Paixão</h2>
            <p className={styles.ownerBio}>
              Seja bem-vindo à Temática Buquês! Eu sou a fundadora e apaixonada por transformar sentimentos em arranjos florais únicos.
              Cada buquê que você encontra aqui é selecionado e montado à mão, com dedicação e o frescor das melhores flores da estação.
              Nossa missão é levar beleza, perfume e emoção para os momentos mais especiais da sua vida.
            </p>
          </div>
        </section>

        <section className={styles.grid}>
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-muted-foreground animate-pulse">Carregando buquês...</p>
            </div>
          ) : visibleBouquets.map((bouquet, index) => (
            <Card
              key={bouquet.id}
              title={bouquet.name}
              price={bouquet.price}
              description={bouquet.description}
              imageUrl={bouquet.images?.[0] || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80'}
              delay={index * 100}
              onBuy={() => handleBuyClick(bouquet)}
            />
          ))}
        </section>

        {!loading && filteredBouquets.length === 0 && (
          <div style={{ textAlign: 'center', margin: '4rem 0', fontSize: '1.2rem', color: '#888' }}>
            Nenhum buquê encontrado no momento.
          </div>
        )}

        {hasMore && !loading && (
          <div className={styles.paginationContainer}>
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              Exibir Mais
            </button>
          </div>
        )}

        <BuyModal
          bouquet={selectedBouquet}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmPurchase}
        />

        <footer className={styles.footer}>
          <p>© 2026 Temática Buquê. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
