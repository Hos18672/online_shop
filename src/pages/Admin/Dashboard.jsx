import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../../components/common/Spinner';
import { getProducts, deleteProduct, updateProduct } from '../../services/productService';
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
  const [operationLoading, setOperationLoading] = useState(false);
  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('error_fetching_data'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const handleDeleteProduct = useCallback(async (productId) => {
    if (window.confirm(t('confirm_delete_product'))) {
      setOperationLoading(true);
      try {
        await deleteProduct(productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(t('error_deleting_product'));
      } finally {
        setOperationLoading(false);
      }
    }
  }, [t]);

  const handleDeleteCategory = useCallback(async (categoryId) => {
    if (window.confirm(t('confirm_delete_category'))) {
      setOperationLoading(true);
      try {
        await deleteCategory(categoryId);
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(t('error_deleting_category'));
      } finally {
        setOperationLoading(false);
      }
    }
  }, [t]);

  const handleEditProduct = useCallback((product) => {
    setEditProduct({ ...product });
  }, []);

  const handleEditCategory = useCallback((category) => {
    setEditCategory({ ...category });
  }, []);

  const handleSaveProduct = useCallback(async (updatedProduct) => {
    setOperationLoading(true);
    try {
      await updateProduct(updatedProduct.id, {
        name_en: updatedProduct.name_en,
        name_de: updatedProduct.name_de,
        name_fa: updatedProduct.name_fa,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
        image_url: updatedProduct.image_url,
        category_id: updatedProduct.category_id,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setEditProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setError(t('error_updating_product'));
    } finally {
      setOperationLoading(false);
    }
  }, [t]);

  const handleSaveCategory = useCallback(async (updatedCategory) => {
    setOperationLoading(true);
    try {
      await updateCategory(updatedCategory.id, {
        name_en: updatedCategory.name_en,
        name_de: updatedCategory.name_de,
        name_fa: updatedCategory.name_fa,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
      );
      setEditCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      setError(t('error_updating_category'));
    } finally {
      setOperationLoading(false);
    }
  }, [t]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product[`name_${lang}`] || product.name_en || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category_id === parseInt(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory, lang]);

  if (loading) return <Spinner />;
  if (error) return <div className="dashboard__error">{error}</div>;

  return (
    <div className={`dashboard ${isRtl ? 'rtl' : 'ltr'}`} role="main" aria-label={t('admin_dashboard')}>
      <header className="dashboard__header">
        <h1 className="dashboard__title">{t('admin_dashboard')}</h1>
        <nav className="dashboard__tabs" aria-label={t('dashboard_tabs')}>
          <button
            className={`dashboard__tab ${activeTab === 'products' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('products')}
            disabled={operationLoading}
          >
            {t('admin_products')} ({products.length})
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'categories' ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('categories')}
            disabled={operationLoading}
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
                disabled={operationLoading}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="dashboard__category-filter"
                disabled={operationLoading}
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
                          disabled={operationLoading}
                        >
                          {t('edit')}
                        </button>
                        <button
                          className="dashboard__action-btn dashboard__delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={operationLoading}
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
                            disabled={operationLoading}
                          >
                            {t('edit')}
                          </button>
                          <button
                            className="dashboard__action-btn dashboard__delete-btn"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={operationLoading}
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

        {editProduct && (
          <div className="dashboard__modal-overlay" onClick={() => !operationLoading && setEditProduct(null)}>
            <div className="dashboard__modal" onClick={(e) => e.stopPropagation()}>
              <ProductsManager
                product={editProduct}
                onSave={handleSaveProduct}
                onCancel={() => !operationLoading && setEditProduct(null)}
              />
            </div>
          </div>
        )}

        {editCategory && (
          <div className="dashboard__modal-overlay" onClick={() => !operationLoading && setEditCategory(null)}>
            <div className="dashboard__modal" onClick={(e) => e.stopPropagation()}>
              <CategoriesManager
                category={editCategory}
                onSave={handleSaveCategory}
                onCancel={() => !operationLoading && setEditCategory(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;