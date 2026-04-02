import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const name = currentLang === 'ar' ? product.name_ar : product.name_fr;
  const description = currentLang === 'ar' ? product.description_ar : product.description_fr;

  const handleWhatsApp = () => {
    const textFr = `Bonjour 107 Shop 👔\n\nJe suis intéressé(e) par ce produit et j'aimerais passer commande :\n\n🛍️ *Produit* : ${product.name_fr}\n💰 *Prix* : ${product.price} MRU\n\nMerci de confirmer la disponibilité !\n\nPhoto: ${product.images[0] || ''}`;
    const textAr = `مرحباً 107 Shop 👔\n\nأنا مهتم(ة) بهذا المنتج وأود تقديم طلب:\n\n🛍️ *المنتج* : ${product.name_ar}\n💰 *السعر* : ${product.price} أوقية\n\nهل يمكنكم تأكيد توفر هذا المنتج؟ شكراً!\n\nصورة: ${product.images[0] || ''}`;
    const text = currentLang === 'ar' ? textAr : textFr;

    window.open(`https://wa.me/22224107107?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.images[0] || 'https://via.placeholder.com/400x500?text=107+Shop'} alt={name} className="product-image" />
        <div className="product-logo-overlay">
          <img src="/logo_107.png" alt="107 Shop" className="product-logo-watermark" />
        </div>
        {product.isSoldOut && <span className="badge badge-sold-out absolute-badge">{t('sold_out')}</span>}
        {product.isBestSeller && <span className="badge badge-best-seller absolute-badge top-right">{t('best_sellers')}</span>}
      </div>

      <div className="product-info">
        <h3>{name}</h3>
        <p className="price">{product.price} MRU</p>
      </div>

      <div className="product-actions" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
        <button className="btn btn-accent full-width-btn" onClick={handleWhatsApp} disabled={product.isSoldOut}>
          <MessageCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {t('add_to_cart')}
        </button>
      </div>

      <style jsx="true">{`
        .product-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
          border: 1px solid #f0f0f0;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .product-image-container {
          position: relative;
          height: 400px;
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .absolute-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
        }
        .top-right {
          top: 15px;
          right: 15px;
          bottom: auto;
          left: auto;
        }
        .product-logo-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          pointer-events: none;
        }
        .product-logo-watermark {
          width: 90px;
          height: 90px;
          object-fit: contain;
          border-radius: 50%;
          opacity: 0.55;
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.18);
          padding: 6px;
          transition: opacity 0.3s ease;
        }
        .product-card:hover .product-logo-watermark {
          opacity: 0.75;
        }
        .product-info {
          padding: 1.5rem 1.5rem 0.5rem 1.5rem;
          text-align: center;
        }
        .product-info h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          color: var(--text-dark);
        }
        .price {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }
        .full-width-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        @media (max-width: 768px) {
          .product-card {
            border-radius: 8px;
          }
          .product-image-container {
            height: 180px;
            border-radius: 8px 8px 0 0;
          }
          .product-info h3 {
            font-size: 0.85rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .price {
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
          }
          .product-info {
            padding: 0.6rem 0.4rem 0.2rem 0.4rem;
          }
          .product-actions {
            padding: 0 0.4rem 0.6rem 0.4rem !important;
          }
          .btn {
            font-size: 0.70rem;
            padding: 6px 4px;
            gap: 5px;
          }
          .absolute-badge {
            font-size: 0.55rem;
            padding: 3px 6px;
            bottom: 6px;
            left: 6px;
          }
          .top-right {
            top: 6px;
            right: 6px;
            bottom: auto;
            left: auto;
          }
          .product-logo-watermark {
            width: 55px;
            height: 55px;
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
