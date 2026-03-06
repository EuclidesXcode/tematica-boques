"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './BuyModal.module.css';

export interface BuyerData {
    name: string;
    phone: string;
    address: string;
    wantsRegister: boolean;
}

interface BuyModalProps {
    bouquet: {
        id: string; // Changed to string as it's UUID in database
        title: string;
        price: number;
        description: string;
        image: string;
        category: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: BuyerData) => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ bouquet, isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState<'details' | 'checkout'>('details');
    const [buyerData, setBuyerData] = useState<BuyerData>({
        name: '',
        phone: '',
        address: '',
        wantsRegister: false
    });

    // Prevent scrolling on background when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep('details'); // Reset to details when opening
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen || !bouquet) return null;

    const handleNextStep = () => {
        setStep('checkout');
    };

    const handleBackStep = () => {
        setStep('details');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(buyerData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setBuyerData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className={styles.overlay} onClick={onClose} aria-label="Overlay">
            <div className={`${styles.modal} ${step === 'checkout' ? styles.modalCheckout : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <div className={styles.modalContent}>
                    {step === 'details' ? (
                        <>
                            <div className={styles.imageSection}>
                                <Image
                                    src={bouquet.image}
                                    alt={bouquet.title}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className={styles.image}
                                    unoptimized
                                />
                            </div>

                            <div className={styles.detailsSection}>
                                <span className={styles.category}>{bouquet.category}</span>
                                <h2 className={styles.title}>{bouquet.title}</h2>
                                <p className={styles.price}>R$ {bouquet.price.toFixed(2)}</p>
                                <p className={styles.description}>{bouquet.description}</p>

                                <div className={styles.actions}>
                                    <button className={styles.buttonSecondary} onClick={onClose}>
                                        Voltar
                                    </button>
                                    <button className={styles.buttonPrimary} onClick={handleNextStep}>
                                        Continuar para Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.checkoutSection}>
                            <h2 className={styles.checkoutTitle}>Dados do Comprador</h2>
                            <p className={styles.checkoutSubtitle}>Preencha seus dados para finalizar a compra via WhatsApp</p>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name">Nome Completo</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Seu nome"
                                        value={buyerData.name}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="phone">WhatsApp / Telefone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        placeholder="(00) 00000-0000"
                                        value={buyerData.phone}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="address">Endereço de Entrega (Opcional)</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        placeholder="Rua, número, bairro..."
                                        value={buyerData.address}
                                        onChange={handleInputChange}
                                        className={styles.textarea}
                                    />
                                </div>

                                <div className={styles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        id="wantsRegister"
                                        name="wantsRegister"
                                        checked={buyerData.wantsRegister}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="wantsRegister">Deseja se cadastrar para receber novidades?</label>
                                </div>

                                <div className={styles.actions}>
                                    <button type="button" className={styles.buttonSecondary} onClick={handleBackStep}>
                                        Voltar
                                    </button>
                                    <button type="submit" className={styles.buttonPrimary}>
                                        Finalizar e Enviar WhatsApp
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyModal;

