import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { FcGoogle } from 'react-icons/fc';
import './../styles/AuthPage.scss';

const rtlLanguages = ['fa', 'ar', 'he', 'ur']; // add other RTL langs here

const AuthPage = () => {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!signInLoaded) throw new Error(t('auth.not_loaded'));
        await signIn.create({ identifier: email, password });
        await signIn.authenticateWithRedirect({ redirectUrl: '/', strategy: 'password' });
      } else {
        if (!signUpLoaded) throw new Error(t('auth.not_loaded'));
        await signUp.create({ emailAddress: email, password, redirectUrl: '/' });
      }
    } catch (err) {
      const message =
        err.errors?.[0]?.message || err.longMessage || err.message || t('auth.generic_error');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    try {
      if (mode === 'signin') {
        await signIn.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: '/',
        });
      } else {
        await signUp.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: '/',
        });
      }
    } catch (err) {
      setError(err.message || t('auth.generic_error'));
    }
  };

  const isReady = signInLoaded && signUpLoaded;

  // Determine direction based on current language
  const dir = rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr';

  return (
    <div className={`auth-page ${dir === 'rtl' ? 'rtl' : 'ltr'}`} dir={dir}>
      <div className="auth-switch">
        <button
          type="button"
          className={`switch-btn ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => setMode('signin')}
        >
          {t('sign_in')}
        </button>
        <button
          type="button"
          className={`switch-btn ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => setMode('signup')}
        >
          {t('sign_up')}
        </button>
      </div>

      <div className="oauth-buttons">
        <button
          type="button"
          className="oauth-btn google"
          onClick={() => handleOAuth('oauth_google')}
          disabled={!isReady}
        >
          <FcGoogle className="oauth-icon" />
          <span>
            {mode === 'signin'
              ? t('signin_with_google')
              : t('signup_with_google')}
          </span>
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1 className="form-title">
          {mode === 'signin' ? t('sign_in') : t('sign_up')}
        </h1>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">{t('email')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!isReady || loading}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('password')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!isReady || loading}
            autoComplete="current-password"
          />
        </div>

        <button
          className="submit-btn"
          type="submit"
          disabled={!isReady || loading}
        >
          {loading
            ? t('auth.loading')
            : mode === 'signin'
            ? t('sign_in')
            : t('sign_up')}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
