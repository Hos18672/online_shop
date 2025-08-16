import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ProductCard from "../components/shop/ProductCard";
import { getProducts } from "../services/productService";
import Loader from "../components/common/Loader";
import SearchInput from "../components/common/SearchInput";
import "../styles/products.scss";

const Products = () => {
  const { t, i18n } = useTranslation();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchResultsRef = useRef(null);
  const sidebarRef = useRef(null);
  const lang = i18n.language || "en";
  const isRtl = lang === "fa";

  // Fetch products, filtering by categoryId if provided
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        const filteredByCategory = categoryId
          ? productsData.filter(
              (product) => product.category_id === parseInt(categoryId)
            )
          : productsData;
        setProducts(filteredByCategory);
        setFilteredProducts(filteredByCategory);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  // Handle outside clicks to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".products__filter-toggle")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply search, price range, and sort filters
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter((product) =>
        (product[`name_${lang}`] || product.name_en || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
      result.sort((a, b) =>
        (a[`name_${lang}`] || a.name_en || "").localeCompare(
          b[`name_${lang}`] || b.name_en || ""
        )
      );
    }

    setFilteredProducts(result);
  }, [search, priceRange, sortOption, products, lang]);

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => {
      const newRange = [...prev];
      newRange[name === "minPrice" ? 0 : 1] = parseInt(value) || 0;
      return newRange;
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="products__error">{t("error_loading_data")}</div>;

  return (
    <div className={`products ${isRtl ? "rtl" : "ltr"}`}>
      <div className="products__container">
        {/* Filter Toggle for Mobile */}
        <button
          className="products__filter-toggle"
          onClick={toggleSidebar}
          aria-label={t("toggle_filters")}
        >
          <svg
            className="products__filter-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4h16v2H4zM4 11h16v2H4zM4 18h16v2H4z" />
          </svg>
          {t("filters")}
        </button>

        {/* Sidebar Filters */}
        <div
          ref={sidebarRef}
          className={`products__sidebar ${sidebarOpen ? "products__sidebar--open" : ""}`}
        >
          <div className="products__sidebar-header">
            <h3 className="products__sidebar-title">{t("filters")}</h3>
            <button
              className="products__sidebar-close"
              onClick={toggleSidebar}
              aria-label={t("close_filters")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="products__sidebar-content">
            {/* Price Range Filter */}
            <div className="products__filter-section">
              <h4 className="products__filter-title">{t("price_range")}</h4>
              <div className="products__price-range">
                <input
                  type="number"
                  name="minPrice"
                  value={priceRange[0]}
                  onChange={handlePriceRangeChange}
                  placeholder={t("min_price")}
                  className="products__price-input"
                />
                <span className="products__price-separator">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={priceRange[1]}
                  onChange={handlePriceRangeChange}
                  placeholder={t("max_price")}
                  className="products__price-input"
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div className="products__filter-section">
              <h4 className="products__filter-title">{t("sort_by")}</h4>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="products__sort-select"
              >
                <option value="default">{t("default")}</option>
                <option value="price-low">{t("price_low_to_high")}</option>
                <option value="price-high">{t("price_high_to_low")}</option>
                <option value="name">{t("name_a_z")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products__grid">
          {filteredProducts.length === 0 ? (
            <div className="products__no-results">{t("no_products_found")}</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="products__product-card"
              />
            ))
          )}
        </div>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="products__sidebar-overlay"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default Products;