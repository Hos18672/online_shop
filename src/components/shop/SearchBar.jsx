import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Modal from './../common/Modal';
import ProductCard from '../shop/ProductCard'; // Adjust import path if needed
import { searchProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import './../../styles/SearchBar.scss';

const SearchBar = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa'; // Check if language is Farsi

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
        setIsModalOpen(false);
        return;
      }
      try {
        setLoading(true);
        const results = await searchProducts({ name: search, category, priceRange });
        if (isMounted.current) {
          setSearchResults(results);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        if (isMounted.current) {
          setSearchResults([]);
          setIsModalOpen(false);
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
    setIsModalOpen(search.trim() !== '');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getTranslatedName = (obj) =>
    obj[`name_${lang}`] || obj.name_en || obj.name || t('unnamed');

  return (
    <div className="search-bar">
      <form
        onSubmit={handleSearch}
        className="search-bar-form"
        aria-label={t('product_search')}
      >
        <div className="search-bar__container">
          <div className="search-bar__input-wrapper">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
              className="search-bar__input"
              aria-label={t('search_products')}
              autoComplete="off"
              dir={isRtl ? 'rtl' : 'ltr'} // Set direction based on language
            />
            <svg
              className="search-bar__icon"
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
            className="search-bar__select"
            aria-label={t('filter_by_price_range')}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <option value="">{t('all_prices')}</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={t('search_results')}>
        {loading ? (
          <div className="search-bar__loading">
            <div className="spinner" />
            {t('loading')}
          </div>
        ) : searchResults.length === 0 ? (
          <p className="search-bar__no-results">{t('no_results')}</p>
        ) : (
          <div className="search-bar__results-grid">
            {searchResults.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                onClick={handleCloseModal}
                className="search-bar__result-link"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SearchBar;