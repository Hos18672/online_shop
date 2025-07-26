import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { getProducts, addProduct } from '../../services/productService';
import './../../styles/ProductsManager.scss'; // Corrected SCSS path

const schema = zod.object({
  category_id: zod.number().min(1, 'Category ID is required'),
  price: zod.number().min(0, 'Price must be non-negative'),
  stock: zod.number().min(0, 'Stock must be non-negative'),
  name_en: zod.string().min(1, 'English name is required'),
  name_de: zod.string().min(1, 'German name is required'),
  name_fa: zod.string().min(1, 'Persian name is required'),
  description_en: zod.string().optional(),
  description_de: zod.string().optional(),
  description_fa: zod.string().optional(),
});

const ProductsManager = ({ product, onSave, onCancel }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product || {
      category_id: 0,
      price: 0,
      stock: 0,
      name_en: '',
      name_de: '',
      name_fa: '',
      description_en: '',
      description_de: '',
      description_fa: '',
    },
  });

  useEffect(() => {
    if (product) {
      setValue('category_id', product.category_id || 0);
      setValue('price', product.price || 0);
      setValue('stock', product.stock || 0);
      setValue('name_en', product.name_en || '');
      setValue('name_de', product.name_de || '');
      setValue('name_fa', product.name_fa || '');
      setValue('description_en', product.description_en || '');
      setValue('description_de', product.description_de || '');
      setValue('description_fa', product.description_fa || '');
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    try {
      await onSave(data);
      reset();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="container" role="main" aria-label={t('admin_products')}>
      <h1 className="heading">{product ? t('edit_product') : t('add_product')}</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="inputGroup">
          <label htmlFor="category_id">{t('category_id')}</label>
          <input
            id="category_id"
            {...register('category_id', { valueAsNumber: true })}
            aria-invalid={errors.category_id ? 'true' : 'false'}
          />
          {errors.category_id && <p className="error">{errors.category_id.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="price">{t('price')}</label>
          <input
            id="price"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={errors.price ? 'true' : 'false'}
          />
          {errors.price && <p className="error">{errors.price.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="stock">{t('stock')}</label>
          <input
            id="stock"
            {...register('stock', { valueAsNumber: true })}
            aria-invalid={errors.stock ? 'true' : 'false'}
          />
          {errors.stock && <p className="error">{errors.stock.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="name_en">{t('name_en')}</label>
          <input
            id="name_en"
            {...register('name_en')}
            aria-invalid={errors.name_en ? 'true' : 'false'}
          />
          {errors.name_en && <p className="error">{errors.name_en.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="name_de">{t('name_de')}</label>
          <input
            id="name_de"
            {...register('name_de')}
            aria-invalid={errors.name_de ? 'true' : 'false'}
          />
          {errors.name_de && <p className="error">{errors.name_de.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="name_fa">{t('name_fa')}</label>
          <input
            id="name_fa"
            {...register('name_fa')}
            aria-invalid={errors.name_fa ? 'true' : 'false'}
          />
          {errors.name_fa && <p className="error">{errors.name_fa.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="description_en">{t('description_en')}</label>
          <textarea
            id="description_en"
            {...register('description_en')}
            aria-invalid={errors.description_en ? 'true' : 'false'}
          />
          {errors.description_en && <p className="error">{errors.description_en.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="description_de">{t('description_de')}</label>
          <textarea
            id="description_de"
            {...register('description_de')}
            aria-invalid={errors.description_de ? 'true' : 'false'}
          />
          {errors.description_de && <p className="error">{errors.description_de.message}</p>}
        </div>
        <div className="inputGroup">
          <label htmlFor="description_fa">{t('description_fa')}</label>
          <textarea
            id="description_fa"
            {...register('description_fa')}
            aria-invalid={errors.description_fa ? 'true' : 'false'}
          />
          {errors.description_fa && <p className="error">{errors.description_fa.message}</p>}
        </div>
        <div className="buttonGroup">
          <button type="submit" className="button save" aria-label={product ? t('save_product') : t('add_product')}>
            {product ? t('save') : t('add_product')}
          </button>
          <button
            type="button"
            className="button cancel"
            onClick={onCancel}
            aria-label={t('cancel')}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsManager;