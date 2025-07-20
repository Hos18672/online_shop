import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Admin/Dashboard';
import ProductsManager from './pages/Admin/ProductsManager';
import CategoriesManager from './pages/Admin/CategoriesManager';
import OrdersManager from './pages/Admin/OrdersManager';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';

const clerkPubKey = 'pk_test_ZmluZXItZXNjYXJnb3QtMjcuY2xlcmsuYWNjb3VudHMuZGV2JA';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
            <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ProductsManager />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <CategoriesManager />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <OrdersManager />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </I18nextProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);