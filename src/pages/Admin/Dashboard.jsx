import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Spinner from './../../components/common/Spinner';
import { getProducts, getOrders } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import './../../styles/Dashboard.scss'; // ✅ Import SCSS

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    lowStock: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [products, orders, categories] = await Promise.all([
          getProducts(),
          getOrders(),
          getCategories(),
        ]);
        const lowStock = products.filter((p) => p.stock < 10).length;
        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          lowStock,
          totalCategories: categories.length,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(t('error_fetching_data'));
        setLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  if (loading) return <Spinner />;
  if (error) return <div className="dashboard__error">{error}</div>;

  return (
    <div className="dashboard" role="main" aria-label={t('admin_dashboard')}>
      <h1 className="dashboard__title">{t('admin_dashboard')}</h1>
      <div className="dashboard__stats">
        <div className="dashboard__card" role="region" aria-label={t('total_products')}>
          <h2>{t('total_products')}</h2>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="dashboard__card" role="region" aria-label={t('total_orders')}>
          <h2>{t('total_orders')}</h2>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="dashboard__card" role="region" aria-label={t('low_stock')}>
          <h2>{t('low_stock')}</h2>
          <p>{stats.lowStock}</p>
        </div>
        <div className="dashboard__card" role="region" aria-label={t('total_categories')}>
          <h2>{t('total_categories')}</h2>
          <p>{stats.totalCategories}</p>
        </div>
      </div>
      <nav className="dashboard__nav" aria-label="Admin navigation">
        <Link to="/admin/products">{t('admin_products')}</Link>
        <Link to="/admin/categories">{t('admin_categories')}</Link>
        <Link to="/admin/orders">{t('admin_orders')}</Link>
      </nav>
    </div>
  );
};

export default Dashboard;
