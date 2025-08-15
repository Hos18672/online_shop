import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { searchProducts } from "../../services/productService";
import "./../../styles/SearchInput.scss";

const SearchInput = ({
  search,
  setSearch,
  category,
  priceRange,
  isRtl,
  searchResultsRef,
}) => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const isMounted = useRef(true);

  // Handle search
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (search.trim() === "") {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const results = await searchProducts({
          name: search,
          category,
          priceRange,
        });
        if (isMounted.current) setSearchResults(results);
      } catch (error) {
        console.error("Error searching products:", error);
        if (isMounted.current) setSearchResults([]);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounce);
  }, [search, category, priceRange]);

  const getTranslatedName = (obj) =>
    obj[`name_${t("i18n.language")}`] ||
    obj.name_en ||
    obj.name ||
    t("unnamed");

  const handleSearch = (e) => e.preventDefault();

  return (
    <form
      onSubmit={handleSearch}
      className="search-input__form"
      aria-label={t("product_search")}
    >
      <div className="search-wrapper">
        <div className="search-input__input-wrapper">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            className="search-input__input"
            aria-label={t("search_products")}
            autoComplete="off"
            dir={isRtl ? "rtl" : "ltr"}
          />
          <svg
            className={isRtl ? "search-input__icon--rtl" : "search-input__icon"}
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
      </div>

      <div
        ref={searchResultsRef}
        className={
          searchResults.length > 0 || loading
            ? "search-input__results--open"
            : "search-input__results"
        }
      >
        {loading ? (
          <div className="search-input__loading">
            <div className="search-input__spinner" />
            {t("loading")}
          </div>
        ) : searchResults.length === 0 && search.trim() !== "" ? (
          <div className="search-input__no-results">{t("no_results")}</div>
        ) : (
          searchResults.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="search-input__result-item"
            >
              <img
                src={product.image_url || "/placeholder-image.jpg"}
                alt={getTranslatedName(product)}
                className="search-input__result-image"
                width="48"
                height="48"
              />
              <span className="search-input__result-name">
                {getTranslatedName(product)}
              </span>
            </Link>
          ))
        )}
      </div>
    </form>
  );
};

export default SearchInput;
