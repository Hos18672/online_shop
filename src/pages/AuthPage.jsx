import React from 'react';
import { useTranslation } from 'react-i18next';
import { SignIn, SignUp } from '@clerk/clerk-react';

const AuthPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 max-w-md mx-auto" role="main" aria-label={t('auth')}>
      <h1 className="text-2xl font-bold mb-4 text-center">{t('auth')}</h1>
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-xl mb-2">{t('sign_in')}</h2>
          <SignIn afterSignInUrl="/" />
        </div>
        <div>
          <h2 className="text-xl mb-2">{t('sign_up')}</h2>
          <SignUp afterSignUpUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
