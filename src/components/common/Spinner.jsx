import React from 'react';
import { useTranslation } from 'react-i18next';

const Spinner = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center" role="status" aria-label={t('loading')}>
      <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
    </div>
  );
};

export default Spinner;