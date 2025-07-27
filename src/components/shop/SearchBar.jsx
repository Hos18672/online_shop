import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { searchProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import "./../../styles/SearchBar.scss";

const SearchBar = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const lang = i18n.language || "en";
  const isRtl = lang === "fa"; // Check if language is Farsi

  useEffect(() => {
    isMounted.current = true;
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted.current) setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (search.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        const results = await searchProducts({
          name: search,
          category,
          priceRange,
        });
        if (isMounted.current) {
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        if (isMounted.current) {
          setSearchResults([]);
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [search, category, priceRange]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const toggleSearchPopup = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const getTranslatedName = (obj) =>
    obj[`name_${lang}`] || obj.name_en || obj.name || t("unnamed");

  return (
    <div className="search-bar">
      <button
        className="search-bar__mobile-icon"
        onClick={toggleSearchPopup}
        aria-label={t("open_search")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
      <div
        className={`search-bar__popup ${isSearchOpen ? "search-bar__popup--open" : ""}`}
      >
        <button
          className="search-bar__close-button"
          onClick={toggleSearchPopup}
          aria-label={t("close_search")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <form
          onSubmit={handleSearch}
          className="search-bar__form"
          aria-label={t("product_search")}
        >
          <div className="search-bar__container">
            <div className="search-bar__input-wrapper">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search_placeholder")}
                className="search-bar__input"
                aria-label={t("search_products")}
                autoComplete="off"
                dir={isRtl ? "rtl" : "ltr"}
              />
              <svg
                className={isRtl ? "search-bar__icon--rtl" : "search-bar__icon"}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="search-bar__select"
              aria-label={t("filter_by_category")}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <option value="">{t("all_categories")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getTranslatedName(cat)}
                </option>
              ))}
            </select>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="search-bar__select"
              aria-label={t("filter_by_price_range")}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <option value="">{t("all_prices")}</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100+">$100+</option>
            </select>
          </div>
        </form>
        <div
          className={
            searchResults.length > 0 || loading
              ? "search-bar__results-list--open"
              : "search-bar__results-list"
          }
        >
          {loading ? (
            <div className="search-bar__loading">
              <div className="spinner" />
              {t("loading")}
            </div>
          ) : searchResults.length === 0 && search.trim() !== "" ? (
            <div className="search-bar__no-results">{t("no_results")}</div>
          ) : (
            searchResults.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="search-bar__result-item"
                onClick={toggleSearchPopup}
              >
                <img
                  src={product.image_url || "/placeholder-image.jpg"}
                  alt={getTranslatedName(product)}
                  className="search-bar__result-imageresult-image"
                  width="40"
                  height="40"
                />
                <span className="search-bar__result-name">
                  {getTranslatedName(product)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
