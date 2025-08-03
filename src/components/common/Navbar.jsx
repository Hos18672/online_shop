import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";
import { searchProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import useCartStore from "../../store/cartStore";
import "./../../styles/navbar.scss";
import flagEN from "./../../assets/flags/en.png";
import flagDE from "./../../assets/flags/de.png";
import flagFA from "./../../assets/flags/fa.png";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isSignedIn, signOut } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLangFlag, setCurrentLangFlag] = useState(flagEN);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const searchResultsRef = useRef(null);
  const clearTimeoutRef = useRef(null);
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const lang = i18n.language || "en";
  const isRtl = lang === "fa";

  // Clear search results on route change — delay to allow click to register
  useEffect(() => {
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    clearTimeoutRef.current = setTimeout(() => {
      setSearch("");
      setSearchResults([]);
      setLoading(false);
    }, 200); // Delay helps preserve smooth UX
    return () => clearTimeout(clearTimeoutRef.current);
  }, [location.pathname]);

  // Handle outside click to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setSearch("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
    if (lang === "en") setCurrentLangFlag(flagEN);
    else if (lang === "de") setCurrentLangFlag(flagDE);
    else if (lang === "fa") setCurrentLangFlag(flagFA);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const getTranslatedName = (obj) =>
    obj[`name_${lang}`] || obj.name_en || obj.name || t("unnamed");

  const handleSearch = (e) => e.preventDefault();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar__title">Your Shop</div>

        {/* MENU ICON */}
        <button
          className="navbar__menu-icon"
          onClick={toggleSidebar}
          aria-label={t("open_menu")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-16 6h16" />
          </svg>
        </button>

        {/* SEARCH FORM */}
        <div className="navbar__search-desktop">
          <form onSubmit={handleSearch} className="navbar__search-form" aria-label={t("product_search")}>
            <div className="navbar__search-container">
              <div className="navbar__search-input-wrapper">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="navbar__search-input"
                  aria-label={t("search_products")}
                  autoComplete="off"
                  dir={isRtl ? "rtl" : "ltr"}
                />
                <svg
                  className={isRtl ? "navbar__search-icon--rtl" : "navbar__search-icon"}
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

            {/* RESULTS */}
            <div
              ref={searchResultsRef}
              className={
                searchResults.length > 0 || loading
                  ? "navbar__search-results--open"
                  : "navbar__search-results"
              }
            >
              {loading ? (
                <div className="navbar__search-loading">
                  <div className="navbar__spinner" />
                  {t("loading")}
                </div>
              ) : searchResults.length === 0 && search.trim() !== "" ? (
                <div className="navbar__search-no-results">
                  {t("no_results")}
                </div>
              ) : (
                searchResults.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="navbar__search-result-item"
                  >
                    <img
                      src={product.image_url || "/placeholder-image.jpg"}
                      alt={getTranslatedName(product)}
                      className="navbar__search-result-image"
                      width="48"
                      height="48"
                    />
                    <span className="navbar__search-result-name">
                      {getTranslatedName(product)}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </form>
        </div>

        {/* NAV LINKS */}
        <div className="navbar__links">
          <NavLink to="/" className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}>{t("home")}</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}>
            {t("cart")} {totalCount ? `(${totalCount})` : ""}
          </NavLink>
          {isSignedIn && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "navbar__link navbar__link--active" : "navbar__link"}>{t("admin")}</NavLink>
          )}
          <div className="navbar__actions--desktop">
            <div className="navbar__lang-switcher">
              <button className="navbar__lang-btn" onClick={() => setDropdownOpen(!dropdownOpen)} aria-haspopup="true" aria-expanded={dropdownOpen}>
                <img src={currentLangFlag} alt="Language" className="navbar__flag-icon" />
              </button>
              {dropdownOpen && (
                <ul className="navbar__lang-dropdown">
                  <li onClick={() => changeLanguage("en")}><img src={flagEN} alt="English" className="navbar__flag-icon" /> English</li>
                  <li onClick={() => changeLanguage("de")}><img src={flagDE} alt="Deutsch" className="navbar__flag-icon" /> Deutsch</li>
                  <li onClick={() => changeLanguage("fa")}><img src={flagFA} alt="فارسی" className="navbar__flag-icon" /> فارسی</li>
                </ul>
              )}
            </div>
          </div>
          {isSignedIn ? (
            <button onClick={() => signOut()} className="navbar__logout-btn">{t("logout")}</button>
          ) : (
            <NavLink to="/auth" className="navbar__link">{t("sign_in")}</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
