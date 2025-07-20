import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WishlistButton from './WishlistButton';
import useCartStore from '../../store/cartStore';
import './../../styles/ProductCard.scss';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addItem } = useCartStore();
  const lang = i18n.language || 'en';

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product[`name_${lang}`] || product.name_en, price: product.price, quantity: 1 });
  };

  const productName = product[`name_${lang}`] || product.name_en || product.name || t('unnamed');

  return (
    <div className="product-card" role="article" aria-labelledby={`product-${product.id}`}>
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
          alt={productName}
          className="product-image"
          loading="lazy"
          onError={(e) => (e.target.src = 'https://via.placeholder.com/200x200?text=No+Image')}
        />
        <h3 id={`product-${product.id}`} className="product-title">{productName}</h3>
        <p className="product-price">${product.price?.toFixed(2) || 'N/A'}</p>
        <p className={`product-stock ${product.stock > 0 ? '' : 'out-of-stock'}`}>
          {t('stock')}: {product.stock}
        </p>
      </Link>
      <div className="actions">
        <button
          onClick={handleAddToCart}
          aria-label={`${t('add_to_cart')} ${productName}`}
          type="button"
        >
          {t('add_to_cart')}
        </button>
        <WishlistButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
