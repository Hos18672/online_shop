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
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
    setLangDropdownOpen(false);
    setSidebarOpen(false);
    if (lang === "en") setCurrentLangFlag(flagEN);
    else if (lang === "de") setCurrentLangFlag(flagDE);
    else if (lang === "fa") setCurrentLangFlag(flagFA);
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
      <div className="navbar-container">
        <div className="navbar__title">Your Shop</div>

        {/* Menu Icon */}
        <button
          className="navbar__menu-icon"
          onClick={toggleSidebar}
          aria-label={t("open_menu")}
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
            <path d="M4 6h16M4 12h16m-16 6h16" />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`navbar__sidebar ${sidebarOpen ? "navbar__sidebar--open" : ""}`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="navbar__sidebar-header">
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
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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
            {/* Category Filter */}
            <div className="navbar__sidebar-section">
              <label htmlFor="category-select" className="navbar__sidebar-label">
                {t("category")}
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="navbar__sidebar-select"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="">{t("all_categories")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {getTranslatedName(cat)}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="navbar__sidebar-section">
              <label htmlFor="language-select" className="navbar__sidebar-label">
                {t("language")}
              </label>
              <div
                ref={langDropdownRef}
                className="navbar__sidebar-lang-wrapper"
                dir={isRtl ? "rtl" : "ltr"}
              >
                <button
                  className="navbar__sidebar-lang-btn"
                  onClick={toggleLangDropdown}
                  aria-haspopup="true"
                  aria-expanded={langDropdownOpen}
                >
                  <img
                    src={currentLangFlag}
                    alt={lang}
                    className="navbar__flag-icon"
                  />
                  <span>{lang === "en" ? "English" : lang === "de" ? "Deutsch" : "فارسی"}</span>
                  <svg
                    className="navbar__sidebar-lang-arrow"
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
                  <ul className="navbar__sidebar-lang-dropdown">
                    <li
                      className="navbar__sidebar-lang-option"
                      onClick={() => changeLanguage("en")}
                    >
                      <img
                        src={flagEN}
                        alt="English"
                        className="navbar__flag-icon"
                      />
                      English
                    </li>
                    <li
                      className="navbar__sidebar-lang-option"
                      onClick={() => changeLanguage("de")}
                    >
                      <img
                        src={flagDE}
                        alt="Deutsch"
                        className="navbar__flag-icon"
                      />
                      Deutsch
                    </li>
                    <li
                      className="navbar__sidebar-lang-option"
                      onClick={() => changeLanguage("fa")}
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
            </div>

            {/* Login/Logout */}
            <div className="navbar__sidebar-section">
              {isSignedIn ? (
                <button
                  onClick={() => {
                    signOut();
                    setSidebarOpen(false);
                  }}
                  className="navbar__sidebar-btn navbar__logout-btn"
                >
                  {t("logout")}
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  className="navbar__sidebar-btn navbar__link"
                  onClick={() => setSidebarOpen(false)}
                >
                  {t("sign_in")}
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="navbar__search-desktop">
          <SearchInput
            search={search}
            setSearch={setSearch}
            category={category}
            priceRange={priceRange}
            isRtl={isRtl}
            searchResultsRef={searchResultsRef}
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            {t("cart")} {totalCount ? `(${totalCount})` : ""}
          </NavLink>
          {isSignedIn && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "navbar__link navbar__link--active" : "navbar__link"
              }
            >
              {t("admin")}
            </NavLink>
          )}
          <div className="navbar__actions--desktop">
            <div className="navbar__lang-switcher">
              <button
                className="navbar__lang-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={currentLangFlag}
                  alt="Language"
                  className="navbar__flag-icon"
                />
              </button>
              {dropdownOpen && (
                <ul className="navbar__lang-dropdown">
                  <li onClick={() => changeLanguage("en")}>
                    <img
                      src={flagEN}
                      alt="English"
                      className="navbar__flag-icon"
                    />{" "}
                    English
                  </li>
                  <li onClick={() => changeLanguage("de")}>
                    <img
                      src={flagDE}
                      alt="Deutsch"
                      className="navbar__flag-icon"
                    />{" "}
                    Deutsch
                  </li>
                  <li onClick={() => changeLanguage("fa")}>
                    <img src={flagFA} alt="فارسی" className="navbar__flag-icon" />{" "}
                    فارسی
                  </li>
                </ul>
              )}
            </div>
            {isSignedIn ? (
              <button
                onClick={() => signOut()}
                className="navbar__logout-btn"
              >
                {t("logout")}
              </button>
            ) : (
              <NavLink to="/auth" className="navbar__link">
                {t("sign_in")}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;