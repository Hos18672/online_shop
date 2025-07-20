import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { getProducts, addProduct } from '../../services/productService';
import { useTranslation } from 'react-i18next';
import './../../styles/module.scss'; 

const schema = zod.object({
  category_id: zod.number().min(1),
  price: zod.number().min(0),
  stock: zod.number().min(0),
  name_en: zod.string().min(1),
  name_de: zod.string().min(1),
  name_fa: zod.string().min(1),
  description_en: zod.string().optional(),
  description_de: zod.string().optional(),
  description_fa: zod.string().optional(),
});

const ProductsManager = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const onSubmit = async (data) => {
    const newProduct = await addProduct(data);
    setProducts([...products, newProduct]);
    reset();
  };

  return (
    <div className={'container'}>
      <h1 className={'heading'}>{t('admin.products')}</h1>
      <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
        <input {...register('category_id', { valueAsNumber: true })} placeholder={t('category_id')} />
        <input {...register('price', { valueAsNumber: true })} placeholder={t('price')} />
        <input {...register('stock', { valueAsNumber: true })} placeholder={t('stock')} />
        <input {...register('name_en')} placeholder={t('name_en')} />
        <input {...register('name_de')} placeholder={t('name_de')} />
        <input {...register('name_fa')} placeholder={t('name_fa')} />
        <textarea {...register('description_en')} placeholder={t('description_en')} />
        <textarea {...register('description_de')} placeholder={t('description_de')} />
        <textarea {...register('description_fa')} placeholder={t('description_fa')} />
        <button className={'button'} type="submit">{t('add_product')}</button>
      </form>
      <ul className={'productList'}>
        {products.map((product) => (
          <li key={product.id} className={'productItem'}>
            <span>{product.name_en}</span>
            <span>${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsManager;
