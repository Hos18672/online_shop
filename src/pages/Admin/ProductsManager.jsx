import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { addProduct } from '../../services/productService';
import './../../styles/ProductsManager.scss';

const schema = zod.object({
  category_id: zod.number({ invalid_type_error: 'category_id_must_be_number' }).min(1, 'category_id_required'),
  price: zod.number({ invalid_type_error: 'price_must_be_number' }).min(0, 'price_non_negative'),
  stock: zod.number({ invalid_type_error: 'stock_must_be_number' }).min(0, 'stock_non_negative'),
  name_en: zod.string().min(1, 'name_en_required'),
  name_de: zod.string().min(1, 'name_de_required'),
  name_fa: zod.string().min(1, 'name_fa_required'),
  description_en: zod.string().optional(),
  description_de: zod.string().optional(),
  description_fa: zod.string().optional(),
}).strict();

const ProductsManager = ({ product, onSave, onCancel }) => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
      reset(product); // Reset form with product data for editing
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSave(data);
      reset(); // Clear form after successful save
    } catch (error) {
      console.error('Error saving product:', error);
      setSubmitError(t('error_saving_product'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRtl = i18n.language === 'fa';

  return (
    <div className={`products-manager ${isRtl ? 'rtl' : 'ltr'}`} role="main" aria-label={t('admin_products')}>
      <h1 className="products-manager__heading">{product ? t('edit_product') : t('add_product')}</h1>
      {submitError && <p className="products-manager__error">{submitError}</p>}
      <form className="products-manager__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="products-manager__input-group">
          <label htmlFor="category_id">{t('category_id')}</label>
          <input
            id="category_id"
            type="number"
            {...register('category_id', { valueAsNumber: true })}
            aria-invalid={errors.category_id ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.category_id && <p className="products-manager__error">{t(errors.category_id.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="price">{t('price')}</label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={errors.price ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.price && <p className="products-manager__error">{t(errors.price.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="stock">{t('stock')}</label>
          <input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            aria-invalid={errors.stock ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.stock && <p className="products-manager__error">{t(errors.stock.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="name_en">{t('name_en')}</label>
          <input
            id="name_en"
            {...register('name_en')}
            aria-invalid={errors.name_en ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.name_en && <p className="products-manager__error">{t(errors.name_en.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="name_de">{t('name_de')}</label>
          <input
            id="name_de"
            {...register('name_de')}
            aria-invalid={errors.name_de ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.name_de && <p className="products-manager__error">{t(errors.name_de.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="name_fa">{t('name_fa')}</label>
          <input
            id="name_fa"
            {...register('name_fa')}
            aria-invalid={errors.name_fa ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.name_fa && <p className="products-manager__error">{t(errors.name_fa.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="description_en">{t('description_en')}</label>
          <textarea
            id="description_en"
            {...register('description_en')}
            aria-invalid={errors.description_en ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.description_en && <p className="products-manager__error">{t(errors.description_en.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="description_de">{t('description_de')}</label>
          <textarea
            id="description_de"
            {...register('description_de')}
            aria-invalid={errors.description_de ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.description_de && <p className="products-manager__error">{t(errors.description_de.message)}</p>}
        </div>
        <div className="products-manager__input-group">
          <label htmlFor="description_fa">{t('description_fa')}</label>
          <textarea
            id="description_fa"
            {...register('description_fa')}
            aria-invalid={errors.description_fa ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.description_fa && <p className="products-manager__error">{t(errors.description_fa.message)}</p>}
        </div>
        <div className="products-manager__button-group">
          <button
            type="submit"
            className="products-manager__button products-manager__button--save"
            aria-label={product ? t('save_product') : t('add_product')}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('saving') : product ? t('save') : t('add_product')}
          </button>
          <button
            type="button"
            className="products-manager__button products-manager__button--cancel"
            onClick={onCancel}
            aria-label={t('cancel')}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsManager;