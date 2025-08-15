import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import "./../../styles/ProductCard.scss";

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    items: wishlistItems,
  } = useWishlistStore();
  const [addedToCart, setAddedToCart] = useState(false);
  const [showWishlistAnim, setShowWishlistAnim] = useState(false);
  const lang = i18n.language || "en";
  const isRtl = lang === "fa";

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    let item = {
      id: product.id,
      name: product[`name_${lang}`] || product.name_en,
      price: product.price,
      quantity: 1,
      image_url: product.image_url || "https://via.placeholder.com/200x200?text=No+Image",
      description: product[`description_${lang}`] || product.description_en,
    };
    item[`name_en`] = product[`name_en`] || product.name_en || t("unnamed");
    item[`name_de`] = product[`name_de`] || product.name_de || t("unnamed");
    item[`name_fa`] = product[`name_fa`] || product.name_fa || t("unnamed");
    addItem(item);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000); // Reset after 2s
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product[`name_${lang}`] || product.name_en,
        price: product.price,
      });
      setShowWishlistAnim(true);
      setTimeout(() => setShowWishlistAnim(false), 1000);
    }
  };

  const productName =
    product[`name_${lang}`] || product.name_en || product.name || t("unnamed");
  const productDescription =
    product[`description_${lang}`] || product.description_en;

  return (
    <div
      className="product-card"
      role="article"
      aria-labelledby={`product-${product.id}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Link to={`/product/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          <img
            src={
              product.image_url ||
              "https://via.placeholder.com/200x200?text=No+Image"
            }
            alt={productName}
            className="product-card__image"
            loading="lazy"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/200x200?text=No+Image")
            }
          />
        </div>
        <div className="product-card__content">
          <h3 id={`product-${product.id}`} className="product-card__title">
            {productName}
          </h3>
          {productDescription && (
            <p className="product-card__description">{productDescription}</p>
          )}
          <p className="product-card__price">
            €{product.price?.toFixed(2) || "N/A"}
          </p>
          <p
            className={`product-card__stock ${product.stock > 0 ? "" : "out-of-stock"}`}
          >
            {t("stock")}: {product.stock}
          </p>
        </div>
      </Link>
      <div className="product-card__actions">
        <button
          onClick={handleAddToCart}
          className={`product-card__add-to-cart ${addedToCart ? "added" : ""}`}
          aria-label={`${t(addedToCart ? "added_to_cart" : "add_to_cart")} ${productName}`}
          type="button"
        >
          <svg
            className="product-card__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {addedToCart ? (
              <path d="M5 13l4 4L19 7" />
            ) : (
              <>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </>
            )}
          </svg>
          {t(addedToCart ? "added_to_cart" : "add_to_cart")}
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`product-card__wishlist ${isInWishlist ? "wishlisted" : ""} ${showWishlistAnim ? "animate" : ""}`}
          aria-label={`${isInWishlist ? t("remove_from_wishlist") : t("add_to_wishlist")} ${productName}`}
          type="button"
        >
          <svg
            className="product-card__wishlist-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;