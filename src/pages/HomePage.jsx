import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Carousel from "../components/shop/Carousel";
import ProductCard from "../components/shop/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import Loader from "../components/common/Loader";
import SearchInput from "../components/common/SearchInput";

import "../styles/HomePage.scss";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const searchResultsRef = useRef(null);
  const lang = i18n.language || "en";
  const isRtl = lang === "fa";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);

        const categoriesWithAtLeastOneProduct = categoriesData.filter(
          (category) =>
            productsData.some((product) => product.category_id === category.id)
        );
        setCategoriesWithProducts(categoriesWithAtLeastOneProduct);
      } catch (err) {
        console.error("Error loading homepage data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTranslatedName = (category) =>
    category[`name_${lang}`] ||
    category.name_en ||
    category.name ||
    t("unnamed");

  if (loading) return <Loader />;
  if (error)
    return <div className="homepage__error">{t("error_loading_data")}</div>;

  return (
    <div className={`homepage ${isRtl ? "rtl" : "ltr"}`}>
      {/* Search */}
      <div className="homepage__search">
        <SearchInput
          search={search}
          setSearch={setSearch}
          isRtl={isRtl}
          searchResultsRef={searchResultsRef}
          isSidebar={true}
        />
      </div>

      <Carousel items={products} className="homepage__carousel" />

      <section className="homepage__section">
        <h2 className="homepage__section-title">{t("featured_products")}</h2>
        <div className="homepage__product-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="homepage__product-card"
            />
          ))}
        </div>
      </section>

      {categoriesWithProducts.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.category_id === category.id
        );
        return (
          <section key={category.id} className="homepage__section">
            <div className="homepage__section-header">
              <h2 className="homepage__section-title">
                {getTranslatedName(category)}
              </h2>
              {categoryProducts.length > 4 && (
                <a
                  href={`/category/${category.id}`}
                  className="homepage__view-all"
                >
                  {t("view_all")}
                </a>
              )}
            </div>
            <div className="homepage__product-grid">
              {categoryProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="homepage__product-card"
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;
