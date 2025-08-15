import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";
import { getCategories } from "../../services/categoryService";
import useCartStore from "../../store/cartStore";
import SearchInput from "./SearchInput";
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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLangFlag, setCurrentLangFlag] = useState(flagEN);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const isMounted = useRef(true);
  const searchResultsRef = useRef(null);
  const sidebarRef = useRef(null);
  const langDropdownRef = useRef(null);
  const clearTimeoutRef = useRef(null);
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const lang = i18n.language || "en";
  const isRtl = lang === "fa";
  console.log(`test`);

  // Clear search results and close sidebar on route change
  useEffect(() => {
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    clearTimeoutRef.current = setTimeout(() => {
      setSearch("");
      setSidebarOpen(false);
      setLangDropdownOpen(false);
    }, 200);
    return () => clearTimeout(clearTimeoutRef.current);
  }, [location.pathname]);

  // Handle outside click to close sidebar, search results, and language dropdown
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setSearch("");
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".navbar__menu-icon")
      ) {
        setSidebarOpen(false);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch categories
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

  const changeLanguage = (lang) => {
    console.log(`Language changed to: ${lang}`);
    i18n.changeLanguage(lang);
    setLangDropdownOpen(false);
    setSidebarOpen(false);
  };

  // Get the correct flag dynamically
  const getFlagForLang = (lang) => {
    if (lang === "en") return flagEN;
    if (lang === "de") return flagDE;
    if (lang === "fa") return flagFA;
    return flagEN;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (dropdownOpen) setDropdownOpen(false);
    if (langDropdownOpen) setLangDropdownOpen(false);
  };

  const toggleLangDropdown = () => {
    setLangDropdownOpen(!langDropdownOpen);
  };

  const getTranslatedName = (obj) =>
    obj[`name_${lang}`] || obj.name_en || obj.name || t("unnamed");

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      {/* Top Bar with Service Links */}
      <div className="navbar__topbar">
        <div className="navbar__topbar-container">
          <div className="navbar__topbar-left">
             <span className="navbar__topbar-text">
              {t("customer_service")} : 0800 200 800
            </span>
          </div>
          <div className="navbar__topbar-right">
            {/* Language Switcher */}
            <div className="navbar__lang-switcher" ref={langDropdownRef}>
              <button
                className="navbar__lang-btn"
                onClick={toggleLangDropdown}
                aria-haspopup="true"
                aria-expanded={langDropdownOpen}
              >
                <img
                  src={getFlagForLang(i18n.language)}
                  alt="Language"
                  className="navbar__flag-icon"
                />
                <span className="navbar__lang-text">
                  {i18n.language === "en"
                    ? "EN"
                    : i18n.language === "de"
                      ? "DE"
                      : "FA"}
                </span>

                <svg
                  className={`navbar__lang-arrow ${langDropdownOpen ? "navbar__lang-arrow--open" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {langDropdownOpen && (
                <ul className="navbar__lang-dropdown">
                  <li
                    className="navbar__lang-option"
                    onClick={(e) =>{
                       e.stopPropagation(); 
                       changeLanguage("en")}
                    } 
                  >
                    <img
                      src={flagEN}
                      alt="English"
                      className="navbar__flag-icon"
                    />
                    English
                  </li>
                  <li
                    className="navbar__lang-option"
                    onClick={(e) =>{
                       e.stopPropagation(); 
                       changeLanguage("de")
                      }
                     }
                  >
                    <img
                      src={flagDE}
                      alt="Deutsch"
                      className="navbar__flag-icon"
                    />
                    Deutsch
                  </li>
                  <li
                    className="navbar__lang-option"
                    onClick={(e) =>{
                       e.stopPropagation(); 
                       changeLanguage("fa")
                      }}
                  >
                    <img
                      src={flagFA}
                      alt="فارسی"
                      className="navbar__flag-icon"
                    />
                    فارسی
                  </li>
                </ul>
              )}
            </div>
            {/* Login/Account */}
            {isSignedIn ? (
              <div className="navbar__account-menu">
                <span className="navbar__topbar-separator">|</span>
                <button
                  onClick={() => signOut()}
                  className="navbar__topbar-link navbar__logout-link"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className="navbar__topbar-link">
                {t("sign_in")}
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar__main">
        <div className="navbar__main-container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <svg
              className="navbar__logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7M3 7L12 2L21 7M3 7L12 13L21 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="navbar__logo-text">
              <span className="navbar__logo-primary">Your</span>
              <span className="navbar__logo-secondary">Shop</span>
            </div>
          </Link>

          {/* Search Bar - Main Feature */}
          <div className="navbar__search-main">
            <div className="navbar__search-wrapper">
              <SearchInput
                search={search}
                setSearch={setSearch}
                category={category}
                priceRange={priceRange}
                isRtl={isRtl}
                searchResultsRef={searchResultsRef}
                className="navbar__search-enhanced"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="navbar__actions">
            {/* Cart */}
            <NavLink to="/cart" className="navbar__cart-link">
              <div className="navbar__cart-icon-wrapper">
                <svg
                  className="navbar__cart-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" />
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" />
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" />
                </svg>
                {totalCount > 0 && (
                  <span className="navbar__cart-badge">{totalCount}</span>
                )}
              </div>
              <span className="navbar__cart-text">{t("cart")}</span>
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              className="navbar__menu-icon"
              onClick={toggleSidebar}
              aria-label={t("open_menu")}
            >
              <span className="navbar__menu-line"></span>
              <span className="navbar__menu-line"></span>
              <span className="navbar__menu-line"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="navbar__categories">
        <div className="navbar__categories-container">
          <div className="navbar__categories-wrapper">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar__category-link ${isActive ? "navbar__category-link--active" : ""}`
              }
            >
              {t("home")}
            </NavLink>
            {categories.slice(0, 6).map((cat) => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.id}`}
                className={({ isActive }) =>
                  `navbar__category-link ${isActive ? "navbar__category-link--active" : ""}`
                }
              >
                {getTranslatedName(cat)}
              </NavLink>
            ))}
            {isSignedIn && (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `navbar__category-link ${isActive ? "navbar__category-link--active" : ""}`
                }
              >
                {t("admin")}
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`navbar__sidebar ${sidebarOpen ? "navbar__sidebar--open" : ""}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="navbar__sidebar-header">
          <div className="navbar__sidebar-logo">
            <span className="navbar__logo-primary">Your</span>
            <span className="navbar__logo-secondary">Shop</span>
          </div>
          <button
            className="navbar__sidebar-close"
            onClick={toggleSidebar}
            aria-label={t("close_menu")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="navbar__sidebar-search">
          <SearchInput
            search={search}
            setSearch={setSearch}
            category={category}
            priceRange={priceRange}
            isRtl={isRtl}
            searchResultsRef={searchResultsRef}
            className="navbar__search-mobile"
          />
        </div>

        <div className="navbar__sidebar-content">
          {/* Navigation Links */}
          <div className="navbar__sidebar-section">
            <ul className="navbar__sidebar-nav">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "navbar__sidebar-link navbar__sidebar-link--active"
                      : "navbar__sidebar-link"
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {t("home")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive
                      ? "navbar__sidebar-link navbar__sidebar-link--active"
                      : "navbar__sidebar-link"
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {t("cart")} {totalCount ? `(${totalCount})` : ""}
                </NavLink>
              </li>
              {isSignedIn && (
                <li>
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "navbar__sidebar-link navbar__sidebar-link--active"
                        : "navbar__sidebar-link"
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t("admin")}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="navbar__sidebar-section">
            <h3 className="navbar__sidebar-section-title">{t("categories")}</h3>
            <ul className="navbar__sidebar-nav">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <NavLink
                    to={`/category/${cat.id}`}
                    className="navbar__sidebar-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {getTranslatedName(cat)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Section */}
          <div className="navbar__sidebar-section">
            {isSignedIn ? (
              <div>
                <button
                  onClick={() => {
                    signOut();
                    setSidebarOpen(false);
                  }}
                  className="navbar__sidebar-btn navbar__sidebar-btn--secondary"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className="navbar__sidebar-btn navbar__sidebar-btn--primary"
                onClick={() => setSidebarOpen(false)}
              >
                {t("sign_in")}
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="navbar__sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
