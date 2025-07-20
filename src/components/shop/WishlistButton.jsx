import React from 'react';
import { useTranslation } from 'react-i18next';
import useWishlistStore from '../../store/wishlistStore';

const WishlistButton = ({ product }) => {
  const { t } = useTranslation();
  const { items, addItem, removeItem } = useWishlistStore();
  const isInWishlist = items.some(item => item.id === product.id);

  const handleClick = () => {
    if (isInWishlist) {
      removeItem(product.id);
    } else {
      addItem({ id: product.id, name: product.name_en });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        wishlist-button
        ${isInWishlist ? 'wishlist-button--active' : 'wishlist-button--inactive'}
      `}
      aria-label={
        isInWishlist
          ? `Remove ${product[`name_${t('lang')}`]} from wishlist`
          : `Add ${product[`name_${t('lang')}`]} to wishlist`
      }
    >
      {isInWishlist ? t('remove_from_wishlist') : t('add_to_wishlist')}
    </button>
  );
};

export default WishlistButton;
