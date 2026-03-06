"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Petals from '@/components/Petals/Petals';
import Sidebar from '@/components/Sidebar/Sidebar';
import Card from '@/components/Card/Card';
import BuyModal, { BuyerData } from '@/components/Modal/BuyModal';
import { createClient } from '@/lib/supabase';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [allBouquets, setAllBouquets] = useState<any[]>([]);
  const [filteredBouquets, setFilteredBouquets] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedBouquet, setSelectedBouquet] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salesCountMap, setSalesCountMap] = useState<Record<string, number>>({});

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch bouquets
        const { data: bouquetsData, error: bouquetsError } = await supabase
          .from("bouquets")
          .select("*")
          .order("created_at", { ascending: false });

        if (bouquetsError) throw bouquetsError;
        const bouquets = bouquetsData || [];
        setAllBouquets(bouquets);
        setFilteredBouquets(bouquets);

        // Fetch sales to compute count per bouquet
        const { data: salesData } = await supabase
          .from("sales")
          .select("bouquet_id, quantity");

        const countMap: Record<string, number> = {};
        (salesData || []).forEach((sale: any) => {
          if (sale.bouquet_id) {
            countMap[sale.bouquet_id] = (countMap[sale.bouquet_id] || 0) + (sale.quantity || 1);
          }
        });
        setSalesCountMap(countMap);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBuyClick = (bouquet: any) => {
    setSelectedBouquet({
      ...bouquet,
      title: bouquet.name,
      image: bouquet.images?.[0] || 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80',
      category: bouquet.category || 'premium'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBouquet(null), 300);
  };

  const handleConfirmPurchase = async (data: BuyerData) => {
    try {
      // 1. Save sale to Supabase
      const { error } = await supabase
        .from("sales")
        .insert([{
          bouquet_id: selectedBouquet?.id,
          total_price: selectedBouquet?.price,
          buyer_name: data.name,
          buyer_phone: data.phone,
          buyer_address: data.address,
          wants_to_register: data.wantsRegister,
          payment_method: 'Pix', // Defaulting to Pix for WA flow
          quantity: 1
        }]);

      if (error) {
        console.error("Erro ao salvar venda:", error);
        // Even if saving fails, we proceed with WhatsApp as it's the primary channel
      }

      // 2. Clear Modal
      setIsModalOpen(false);

      // 3. Construct WhatsApp Message
      const message = `Olá! Vi este buquê no site e gostaria de finalizar a compra.%0A%0A` +
        `*Detalhes do Produto:*%0A` +
        `- Produto: *${selectedBouquet?.title}*%0A` +
        `- Categoria: ${selectedBouquet?.category}%0A` +
        `- Preço: *R$ ${selectedBouquet?.price.toFixed(2)}*%0A%0A` +
        `*Dados do Comprador:*%0A` +
        `- Nome: ${data.name}%0A` +
        `- WhatsApp: ${data.phone}%0A` +
        `- Endereço: ${data.address || 'Não informado'}%0A` +
        `- Deseja se cadastrar: ${data.wantsRegister ? 'Sim' : 'Não'}`;

      const whatsappNumber = "5541989015380"; // Replace with actual business number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // 4. Redirect
      window.open(whatsappUrl, '_blank');

      alert("Pedido enviado! Você será redirecionado para o WhatsApp para finalizar o pagamento.");
    } catch (error) {
      console.error("Erro no processo de compra:", error);
      alert("Ocorreu um erro ao processar sua compra. Tente novamente.");
    }
  };


  const handleFilterChange = (filters: { category: string | null; sortOrder: 'asc' | 'desc' | 'bestsellers' | null }) => {
    let result = [...allBouquets];
    setVisibleCount(ITEMS_PER_PAGE); // Reset visible count on filter

    if (filters.category) {
      result = result.filter(b => b.category === filters.category);
    }

    if (filters.sortOrder === 'bestsellers') {
      result.sort((a, b) => (salesCountMap[b.id] || 0) - (salesCountMap[a.id] || 0));
    } else if (filters.sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
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
              category={bouquet.category}
              delay={index * 100}
              salesCount={salesCountMap[bouquet.id] || 0}
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
