import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import { getProductById } from "../services/productService";
import Spinner from "../components/common/Spinner";
import "../styles/ProductPage.scss";

const ProductPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    items: wishlistItems,
  } = useWishlistStore();
  const [product, setProduct] = useState(null);
  const [showWishlistAnim, setShowWishlistAnim] = useState(false);
  const lang = i18n.language || "en";
  const isRtl = lang === "fa"; // Check for Farsi (RTL)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Spinner />;

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    let item = {
      id: product.id,
      name: product[`name_${lang}`] || product.name_en,
      price: product.price,
      quantity: 1,
    };
    item[`name_en`] = product[`name_en`] || product.name_en || t("unnamed");
    item[`name_de`] = product[`name_de`] || product.name_de || t("unnamed");
    item[`name_fa`] = product[`name_fa`] || product.name_fa || t("unnamed");
    console.log("Adding item to cart:", item);
    addItem(item);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product[`name_${lang}`] || product.name_en,
        price: product.price,
      });
      setShowWishlistAnim(true);
      setTimeout(() => setShowWishlistAnim(false), 1000); // Animation duration
    }
  };

  const productName =
    product[`name_${lang}`] || product.name_en || t("unnamed");

  return (
    <div
      className="product-page"
      role="main"
      aria-label={t("product_details")}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Helmet>
        <title>{productName} - E-commerce</title>
        <meta
          name="description"
          content={
            product[`description_${lang}`] ||
            product.description_en ||
            t("no_description")
          }
        />
      </Helmet>
      <div className="product-container">
        <div className="product-image-wrapper">
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
        <div className="product-info">
          <h1 className="product-title">{productName}</h1>
          <p className="product-description">
            {product[`description_${lang}`] ||
              product.description_en ||
              t("no_description")}
          </p>
          <p className="product-price">
            {t("price")}: €{product.price?.toFixed(2) || "N/A"}
          </p>
          <p
            className={`product-stock ${product.stock > 0 ? "" : "out-of-stock"}`}
          >
            {t("stock")}: {product.stock}
          </p>
          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              className="product-btn-cart"
              aria-label={`${t("add_to_cart")} ${productName}`}
              type="button"
            >
              <svg
                className="product-btn-icon"
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
              {t("add_to_cart")}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`product-btn-wishlist ${isInWishlist ? "active" : ""} ${showWishlistAnim ? "animate" : ""}`}
              aria-label={
                isInWishlist
                  ? `${t("remove_from_wishlist")} ${productName}`
                  : `${t("add_to_wishlist")} ${productName}`
              }
              type="button"
            >
              <svg
                className="product-btn-wishlist-icon"
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
      </div>

      <section className="reviews-section">
        <h2 className="reviews-title">{t("reviews")}</h2>
        <p className="no-reviews">{t("no_reviews")}</p>
      </section>
    </div>
  );
};

export default ProductPage;
