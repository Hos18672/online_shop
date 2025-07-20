import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/shop/SearchBar';
import ProductPage from '../pages/ProductPage';
import Carousel from '../components/shop/Carousel';
import ProductCard from '../components/shop/ProductCard';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import '../styles/HomePage.scss';  // Import your styles

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const lang = i18n.language || 'en';

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

  return (
    <div className="homepage">
  <h1>{t('Home')}</h1>
  <SearchBar />
  <section>
    <h2>{t('featured_products')}</h2>
    <Carousel items={products.slice(0, 5)} />
  </section>
      <section key={1}>
      <h2>All</h2>
      <div className="product-grid">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  {categories.map((category) => (
    <section key={category.id}>
      <h2>{category[`name_en`]}</h2>
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
