import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@clerk/clerk-react';
import { searchProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import './../../styles/navbar.scss';
import flagEN from './../../assets/flags/en.png';
import flagDE from './../../assets/flags/de.png';
import flagFA from './../../assets/flags/fa.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isSignedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLangFlag, setCurrentLangFlag] = useState(flagEN);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa';

  useEffect(() => {
    isMounted.current = true;
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (isMounted.current) setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (search.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        const results = await searchProducts({ name: search, category, priceRange });
        if (isMounted.current) {
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Error searching products:', error);
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

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
    if (lang === 'en') {
      setCurrentLangFlag(flagEN);
    } else if (lang === 'de') {
      setCurrentLangFlag(flagDE);
    } else if (lang === 'fa') {
      setCurrentLangFlag(flagFA);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const getTranslatedName = (obj) =>
    obj[`name_${lang}`] || obj.name_en || obj.name || t('unnamed');

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar__title">Your Shop</div>
        <button
          className="navbar__menu-icon"
          onClick={toggleSidebar}
          aria-label={t('open_menu')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-16 6h16" />
          </svg>
        </button>
        <div className="navbar__search-desktop">
          <form onSubmit={handleSearch} className="navbar__search-form" aria-label={t('product_search')}>
            <div className="navbar__search-container">
              <div className="navbar__search-input-wrapper">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="navbar__search-input"
                  aria-label={t('search_products')}
                  autoComplete="off"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                <svg
                  className={isRtl ? 'navbar__search-icon--rtl' : 'navbar__search-icon'}
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
                className="navbar__search-select"
                aria-label={t('filter_by_category')}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('all_categories')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {getTranslatedName(cat)}
                  </option>
                ))}
              </select>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="navbar__search-select"
                aria-label={t('filter_by_price_range')}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('all_prices')}</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
            <div className={searchResults.length > 0 || loading ? 'navbar__search-results--open' : 'navbar__search-results'}>
              {loading ? (
                <div className="navbar__search-loading">
                  <div className="navbar__spinner" />
                  {t('loading')}
                </div>
              ) : searchResults.length === 0 && search.trim() !== '' ? (
                <div className="navbar__search-no-results">{t('no_results')}</div>
              ) : (
                searchResults.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="navbar__search-result-item"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <img
                      src={product.image_url || '/placeholder-image.jpg'}
                      alt={getTranslatedName(product)}
                      className="navbar__search-result-image"
                      width="48"
                      height="48"
                    />
                    <span className="navbar__search-result-name">{getTranslatedName(product)}</span>
                  </Link>
                ))
              )}
            </div>
          </form>
        </div>
        <div className="navbar__links">
          <Link to="/">{t('home')}</Link>
          <Link to="/cart">{t('cart')}</Link>
          <Link to="/wishlist">{t('wishlist')}</Link>
          {isSignedIn && (
            <Link to="/admin/dashboard">{t('admin')}</Link>
          )}
        </div>
        <div className="navbar__actions--desktop">
          <div className="navbar__lang-switcher">
            <button
              className="navbar__lang-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img src={currentLangFlag} alt="Language" className="navbar__flag-icon" />
            </button>
            {dropdownOpen && (
              <ul className="navbar__lang-dropdown">
                <li onClick={() => changeLanguage('en')}>
                  <img src={flagEN} alt="English" className="navbar__flag-icon" />
                  English
                </li>
                <li onClick={() => changeLanguage('de')}>
                  <img src={flagDE} alt="Deutsch" className="navbar__flag-icon" />
                  Deutsch
                </li>
                <li onClick={() => changeLanguage('fa')}>
                  <img src={flagFA} alt="فارسی" className="navbar__flag-icon" />
                  فارسی
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className={`navbar__sidebar ${sidebarOpen ? 'navbar__sidebar--open' : ''}`}>
        <button
          className="navbar__sidebar-close"
          onClick={toggleSidebar}
          aria-label={t('close_menu')}
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
        <div className="navbar__sidebar-content">
          <form onSubmit={handleSearch} className="navbar__search-form" aria-label={t('product_search')}>
            <div className="navbar__search-container">
              <div className="navbar__search-input-wrapper">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="navbar__search-input"
                  aria-label={t('search_products')}
                  autoComplete="off"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
                <svg
                  className={isRtl ? 'navbar__search-icon--rtl' : 'navbar__search-icon'}
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
                className="navbar__search-select"
                aria-label={t('filter_by_category')}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('all_categories')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {getTranslatedName(cat)}
                  </option>
                ))}
              </select>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="navbar__search-select"
                aria-label={t('filter_by_price_range')}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="">{t('all_prices')}</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
            <div className={searchResults.length > 0 || loading ? 'navbar__search-results--open' : 'navbar__search-results'}>
              {loading ? (
                <div className="navbar__search-loading">
                  <div className="navbar__spinner" />
                  {t('loading')}
                </div>
              ) : searchResults.length === 0 && search.trim() !== '' ? (
                <div className="navbar__search-no-results">{t('no_results')}</div>
              ) : (
                searchResults.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="navbar__search-result-item"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <img
                      src={product.image_url || '/placeholder-image.jpg'}
                      alt={getTranslatedName(product)}
                      className="navbar__search-result-image"
                      width="48"
                      height="48"
                    />
                    <span className="navbar__search-result-name">{getTranslatedName(product)}</span>
                  </Link>
                ))
              )}
            </div>
          </form>
          <div className="navbar__sidebar-categories">
            <h3>{t('categories')}</h3>
            <ul className="navbar__category-list">
              {categories.map((category) => (
                <li key={category.id} className="navbar__category-item">
                  <Link
                    to={`/category/${category.id}`}
                    onClick={toggleSidebar}
                    className="navbar__category-link"
                  >
                    {getTranslatedName(category)}
                  </Link>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <ul className="navbar__subcategory-list">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id} className="navbar__subcategory-item">
                          <Link
                            to={`/category/${category.id}/subcategory/${subcategory.id}`}
                            onClick={toggleSidebar}
                            className="navbar__subcategory-link"
                          >
                            {getTranslatedName(subcategory)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="navbar__sidebar-lang">
            <h3>{t('language')}</h3>
            <div className="navbar__lang-switcher">
              <button
                className="navbar__lang-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img src={currentLangFlag} alt="Language" className="navbar__flag-icon" />
                {t(i18n.language)}
              </button>
              {dropdownOpen && (
                <ul className="navbar__lang-dropdown">
                  <li onClick={() => changeLanguage('en')}>
                    <img src={flagEN} alt="English" className="navbar__flag-icon" />
                    English
                  </li>
                  <li onClick={() => changeLanguage('de')}>
                    <img src={flagDE} alt="Deutsch" className="navbar__flag-icon" />
                    Deutsch
                  </li>
                  <li onClick={() => changeLanguage('fa')}>
                    <img src={flagFA} alt="فارسی" className="navbar__flag-icon" />
                    فارسی
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;