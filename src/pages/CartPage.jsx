import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

const CartPage = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity } = useCartStore();

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="p-4 max-w-4xl mx-auto" role="main" aria-label={t('cart')}>
      <h1 className="text-2xl font-bold mb-6">{t('cart')}</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">{t('cart_empty')}</p>
      ) : (
        <>
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between border p-4 rounded" role="listitem">
                <div className="flex-1">
                  <span>{item[`name_${t('lang')}`] || item.name_en}</span>
                  <p className="text-gray-600">{t('price')}: ${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      aria-label={`Decrease quantity of ${item[`name_${t('lang')}`] || item.name_en}`}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{t('quantity')}: {item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      aria-label={`Increase quantity of ${item[`name_${t('lang')}`] || item.name_en}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    aria-label={`Remove ${item[`name_${t('lang')}`] || item.name_en} from cart`}
                  >
                    {t('remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">{t('total')}: ${totalPrice}</p>
            <Link
              to="/checkout"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              aria-label={t('proceed_to_checkout')}
            >
              {t('proceed_to_checkout')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;