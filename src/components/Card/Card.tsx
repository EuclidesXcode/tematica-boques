import Image from 'next/image';
import styles from './Card.module.css';

interface CardProps {
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    category?: string;
    delay?: number;
    salesCount?: number;
    onBuy: () => void;
}

const Card: React.FC<CardProps> = ({ title, price, description, imageUrl, category, delay = 0, salesCount = 0, onBuy }) => {
    return (
        <div
            className={styles.card}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={styles.imageContainer}>
                {/* Using a placeholder for local development if image fails */}
                <Image
                    src={imageUrl}
                    alt={title}
                    width={400}
                    height={300}
                    className={styles.image}
                    unoptimized // For external images without loader config
                />
                {salesCount > 0 && (
                    <div className={styles.salesBadge}>
                        {salesCount} {salesCount === 1 ? 'vendido' : 'vendidos'}
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.categoryLabel}>{category || 'premium'}</div>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.price}>R$ {price.toFixed(2)}</p>
                </div>
                <p className={styles.description}>{description}</p>
                <div className={styles.action}>
                    <button className={styles.button} onClick={onBuy}>Mais Detalhes</button>
                </div>
            </div>
        </div>
    );
};

export default Card;
