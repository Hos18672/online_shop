import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Spinner from './../../components/common/Spinner';
import { getProducts, getOrders, deleteProduct, updateProduct } from '../../services/productService';
import { getCategories, deleteCategory, updateCategory } from '../../services/categoryService';
import ProductsManager from './ProductsManager';
import CategoriesManager from './CategoriesManager';
import './../../styles/Dashboard.scss';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, , categoriesData] = await Promise.all([
          getProducts(),
          getOrders(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('error_fetching_data'));
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm(t('confirm_delete_product'))) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((p) => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(t('error_deleting_product'));
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm(t('confirm_delete_category'))) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter((c) => c.id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(t('error_deleting_category'));
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct({ ...product }); // Set the product to edit
  };

  const handleEditCategory = (category) => {
    setEditCategory({ ...category }); // Set the category to edit
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.id, {
        name_en: updatedProduct.name_en,
        name_fa: updatedProduct.name_fa,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
        image_url: updatedProduct.image_url,
      });
      setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      setEditProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setError(t('error_updating_product'));
    }
  };

  const handleSaveCategory = async (updatedCategory) => {
    try {
      await updateCategory(updatedCategory.id, {
        name_en: updatedCategory.name_en,
        name_fa: updatedCategory.name_fa,
      });
      setCategories(categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
      setEditCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      setError(t('error_updating_category'));
    }
  };

  const filteredProducts = products.filter((product) => {
    const name = product[`name_${lang}`] || product.name_en || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Spinner />;
  if (error) return <div className="dashboard__error">{error}</div>;

  return (
    <div className="dashboard" dir={isRtl ? 'rtl' : 'ltr'} role="main" aria-label={t('admin_dashboard')}>
      <header className="dashboard__header">
        <h1 className="dashboard__title">{t('admin_dashboard')}</h1>
        <nav className="dashboard__tabs" aria-label="Dashboard tabs">
          <button
            className={`dashboard__tab ${activeTab === 'products' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            {t('admin_products')} ({products.length})
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'categories' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            {t('admin_categories')} ({categories.length})
          </button>
        </nav>
      </header>
      <main className="dashboard__main">
        {activeTab === 'products' && (
          <section className="dashboard__section">
            <div className="dashboard__filter-controls">
              <input
                type="text"
                placeholder={t('search_products')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dashboard__search-input"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="dashboard__category-filter"
              >
                <option value="">{t('all_categories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category[`name_${lang}`] || category.name_en || t('unnamed')}
                  </option>
                ))}
              </select>
            </div>
            <div className="dashboard__table-container">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>{t('image')}</th>
                    <th>{t('product_name')}</th>
                    <th>{t('price')}</th>
                    <th>{t('stock')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image_url || 'https://via.placeholder.com/40?text=No+Image'}
                          alt={product[`name_${lang}`] || product.name_en || t('unnamed')}
                          className="dashboard__product-image"
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=No+Image')}
                        />
                      </td>
                      <td>{product[`name_${lang}`] || product.name_en || t('unnamed')}</td>
                      <td>${product.price?.toFixed(2) || 'N/A'}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button
                          className="dashboard__action-btn dashboard__edit-btn"
                          onClick={() => handleEditProduct(product)}
                        >
                          {t('edit')}
                        </button>
                        <button
                          className="dashboard__action-btn dashboard__delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          {t('delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {activeTab === 'categories' && (
          <section className="dashboard__section">
            <div className="dashboard__table-container">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>{t('category_name')}</th>
                    <th>{t('product_count')}</th>
                    <th>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const productCount = products.filter((p) => p.category_id === category.id).length;
                    return (
                      <tr key={category.id}>
                        <td>{category[`name_${lang}`] || category.name_en || t('unnamed')}</td>
                        <td>{productCount}</td>
                        <td>
                          <button
                            className="dashboard__action-btn dashboard__edit-btn"
                            onClick={() => handleEditCategory(category)}
                          >
                            {t('edit')}
                          </button>
                          <button
                            className="dashboard__action-btn dashboard__delete-btn"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            {t('delete')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Product Edit Modal */}
        {editProduct && (
          <div className="dashboard__modal-overlay" onClick={() => setEditProduct(null)}>
            <div className="dashboard__modal" onClick={(e) => e.stopPropagation()}>
              <ProductsManager
                product={editProduct}
                onSave={handleSaveProduct}
                onCancel={() => setEditProduct(null)}
              />
            </div>
          </div>
        )}

        {/* Category Edit Modal */}
        {editCategory && (
          <div className="dashboard__modal-overlay" onClick={() => setEditCategory(null)}>
            <div className="dashboard__modal" onClick={(e) => e.stopPropagation()}>
              <CategoriesManager
                category={editCategory}
                onSave={handleSaveCategory}
                onCancel={() => setEditCategory(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;