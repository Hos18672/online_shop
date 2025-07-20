import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white p-4 text-center" role="contentinfo">
      <p>{t('footer_text')}</p>
    </footer>
  );
};

export default Footer;