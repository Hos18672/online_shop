import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import '../styles/CartPage.scss';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { items, removeItem, updateQuantity } = useCartStore();
  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa'; // Check for Farsi (RTL)
  console.log('Cart items:', items);
  // Aggregate items by id to combine quantities
  const aggregatedItems = items.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const totalPrice = aggregatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const productName = (item) => item[`name_${lang}`] || item.name_en || t('unnamed');

  return (
    <div className="cart-page" role="main" aria-label={t('cart')} dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="cart-page__title">{t('cart')}</h1>
      {aggregatedItems.length === 0 ? (
        <p className="cart-page__empty">{t('cart_empty')}</p>
      ) : (
        <>
          <ul className="cart-page__items">
            {aggregatedItems.map((item) => (
              <li key={item.id} className="cart-page__item" role="listitem">
                <div className="cart-page__item-details">
                  <span className="cart-page__item-name">{productName(item)}</span>
                  <p className="cart-page__item-price">{t('price')}: ${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-page__item-actions">
                  <div className="cart-page__quantity-control">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="cart-page__quantity-btn"
                      aria-label={`${t('decrease_quantity')} ${productName(item)}`}
                      disabled={item.quantity <= 1}
                    >
                      <svg
                        className="cart-page__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <span className="cart-page__quantity">{t('quantity')}: {item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-page__quantity-btn"
                      aria-label={`${t('increase_quantity')} ${productName(item)}`}
                    >
                      <svg
                        className="cart-page__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="cart-page__remove-btn"
                    aria-label={`${t('remove_item')} ${productName(item)} ${t('from_cart')}`}
                  >
                    <svg
                      className="cart-page__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0h8" />
                    </svg>
                    {t('remove_item')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-page__summary">
            <p className="cart-page__total">{t('total')}: ${totalPrice}</p>
      {/* '      <Link
              to="/checkout"
              className="cart-page__checkout-btn"
              aria-label={t('proceed_to_checkout')}
            >
              <svg
                className="cart-page__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {t('proceed_to_checkout')}
            </Link>' */}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;