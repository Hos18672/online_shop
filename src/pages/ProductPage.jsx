import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { getProductById } from '../services/productService';
import Spinner from '../components/common/Spinner';
import '../styles/product-page.scss';

const ProductPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Spinner />;

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name_en, price: product.price, quantity: 1 });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, name: product.name_en, price: product.price });
    }
  };

  return (
    <div className="product-page" role="main" aria-label="Product details">
      <Helmet>
        <title>{product[`name_${t('lang')}`] || product.name_en} - E-commerce</title>
        <meta name="description" content={product[`description_${t('lang')}`] || product.description_en} />
      </Helmet>
      <div className="product-container">
        <img
          src={product.image_url || 'https://via.placeholder.com/300'}
          alt={product[`name_${t('lang')}`] || product.name_en}
          className="product-image"
          loading="lazy"
        />
        <div className="product-info">
          <h1 className="product-title">{product[`name_${t('lang')}`] || product.name_en}</h1>
          <p className="product-description">{product[`description_${t('lang')}`] || product.description_en}</p>
          <p className="product-price">{t('price')}: ${product.price}</p>
          <p className="product-stock">{t('stock')}: {product.stock}</p>
          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              className="btn-cart"
              aria-label={`Add ${product[`name_${t('lang')}`] || product.name_en} to cart`}
            >
              {t('add_to_cart')}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
              aria-label={isInWishlist ? `Remove ${product[`name_${t('lang')}`]} from wishlist` : `Add ${product[`name_${t('lang')}`]} to wishlist`}
            >
              {isInWishlist ? t('remove_from_wishlist') : t('add_to_wishlist')}
            </button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2 className="reviews-title">{t('reviews')}</h2>
        <p className="no-reviews">{t('no_reviews')}</p>
      </section>
    </div>
  );
};

export default ProductPage;