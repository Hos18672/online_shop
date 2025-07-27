import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from '../components/shop/Carousel';
import ProductCard from '../components/shop/ProductCard';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import '../styles/HomePage.scss';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const lang = i18n.language || 'en';
  const isRtl = lang === 'fa';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const getTranslatedName = (category) =>
    category[`name_${lang}`] || category.name_en || category.name || t('unnamed');

  return (
    <div className={`homepage ${isRtl ? 'rtl' : 'ltr'}`}>
      <Carousel items={products} className="homepage__carousel" />
      <section className="homepage__section">
        <h2 className="homepage__section-title">{t('featured_products')}</h2>
        <div className="homepage__product-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} className="homepage__product-card" />
          ))}
        </div>
      </section>
      {categories.map((category) => {
        const categoryProducts = products.filter((p) => p.category_id === category.id);
        return (
          <section key={category.id} className="homepage__section">
            <div className="homepage__section-header">
              <h2 className="homepage__section-title">{getTranslatedName(category)}</h2>
              {categoryProducts.length > 4 && (
                <a href={`/category/${category.id}`} className="homepage__view-all">
                  {t('view_all')}
                </a>
              )}
            </div>
            <div className="homepage__product-grid">
              {categoryProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} className="homepage__product-card" />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;