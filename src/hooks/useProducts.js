import { useState, useEffect } from 'react';
import { getProducts, getProductById } from '../services/productService';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product');
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, fetchProductById };
};

export default useProducts;