"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import styles from './BuyModal.module.css';

interface BuyModalProps {
    bouquet: {
        id: number;
        title: string;
        price: number;
        description: string;
        image: string;
        type: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ bouquet, isOpen, onClose, onConfirm }) => {
    // Prevent scrolling on background when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen || !bouquet) return null;

    return (
        <div className={styles.overlay} onClick={onClose} aria-label="Overlay">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <div className={styles.modalContent}>
                    <div className={styles.imageSection}>
                        <Image
                            src={bouquet.image}
                            alt={bouquet.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className={styles.image}
                            unoptimized
                        />
                    </div>

                    <div className={styles.detailsSection}>
                        <span className={styles.category}>{bouquet.type}</span>
                        <h2 className={styles.title}>{bouquet.title}</h2>
                        <p className={styles.price}>R$ {bouquet.price.toFixed(2)}</p>
                        <p className={styles.description}>{bouquet.description}</p>

                        <div className={styles.actions}>
                            <button className={styles.buttonSecondary} onClick={onClose}>
                                Voltar
                            </button>
                            <button className={styles.buttonPrimary} onClick={onConfirm}>
                                Finalizar Compra
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyModal;
