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
  const isRtl = lang === 'fa'; // Check if language is Farsi for RTL

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
    <div className="homepage" dir={isRtl ? 'rtl' : 'ltr'}>      <section className="homepage__section">
        <h2 className="homepage__section-title">{t('featured_products')}</h2>
        <Carousel items={products} />
      </section>
      <section className="homepage__section">
        <h2 className="homepage__section-title">{t('All')}</h2>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {categories.map((category) => (
        <section key={category.id} className="homepage__section">
          <h2 className="homepage__section-title">{getTranslatedName(category)}</h2>
          <div className="product-grid">
            {products
              .filter((p) => p.category_id === category.id)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;