import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@clerk/clerk-react';
import './../../styles/navbar.scss'; // adjust path as needed
// Import your flag images
import flagEN from './../../assets/flags/en.png';
import flagDE from './../../assets/flags/de.png';
import flagFA from './../../assets/flags/fa.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isSignedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLangFlag, setCurrentLangFlag] = useState(flagEN);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
    if (lang === 'en') {
      setCurrentLangFlag(flagEN);
    }else if (lang === 'de') {
      setCurrentLangFlag(flagDE);
    } else if (lang === 'fa') {
      setCurrentLangFlag(flagFA);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link to="/">{t('home')}</Link>
          <Link to="/cart">{t('cart')}</Link>
          <Link to="/wishlist">{t('wishlist')}</Link>
          {isSignedIn && (
            <Link to="/admin/dashboard">{t('admin')}</Link>
          )}
        </div>

        <div className="navbar-actions">
          <div className="lang-switcher">
            <button
              className="lang-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img src={currentLangFlag} alt="English" className="flag-icon" />
            </button>
         {dropdownOpen && (
              <ul className="lang-dropdown">
                <li onClick={() => changeLanguage('en')}>
                  <img src={flagEN} alt="English" className="flag-icon" />
                  English
                </li>
                <li onClick={() => changeLanguage('de')}>
                  <img src={flagDE} alt="Deutsch" className="flag-icon" />
                  Deutsch
                </li>
                <li onClick={() => changeLanguage('fa')}>
                  <img src={flagFA} alt="فارسی" className="flag-icon" />
                  فارسی
                </li>
              </ul>
            )}
          </div>
          <Link to="/auth" className="auth-link">{t('auth')}</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
