import React from 'react';
import { useTranslation } from 'react-i18next';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';

const WishlistPage = () => {
  const { t } = useTranslation();
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (item) => {
    addItem({ id: item.id, name: item.name_en, price: item.price || 0, quantity: 1 });
    removeItem(item.id); // Optional: remove from wishlist after adding to cart
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" role="main" aria-label={t('wishlist')}>
      <h1 className="text-2xl font-bold mb-6">{t('wishlist')}</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">{t('wishlist_empty')}</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between border p-4 rounded" role="listitem">
              <span>{item[`name_${t('lang')}`] || item.name_en}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  aria-label={`Add ${item[`name_${t('lang')}`] || item.name_en} to cart`}
                >
                  {t('add_to_cart')}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  aria-label={`Remove ${item[`name_${t('lang')}`] || item.name_en} from wishlist`}
                >
                  {t('remove')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;