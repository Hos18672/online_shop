import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import './../../styles/CategoriesManager.scss'; // ✅ SCSS Module

const schema = zod.object({
  name_en: zod.string().min(1, 'English name is required'),
  name_de: zod.string().min(1, 'German name is required'),
  name_fa: zod.string().min(1, 'Persian name is required'),
});

const CategoriesManager = ({ category, onSave, onCancel }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: category || { name_en: '', name_de: '', name_fa: '' },
  });

  useEffect(() => {
    if (category) {
      setValue('name_en', category.name_en || '');
      setValue('name_de', category.name_de || '');
      setValue('name_fa', category.name_fa || '');
    }
  }, [category, setValue]);

  const onSubmit = async (data) => {
    try {
      await onSave(data);
      reset();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="container" role="main" aria-label={t('admin_categories')}>
      <h1 className="heading">{category ? t('edit_category') : t('add_category')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
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
        <div className="buttonGroup">
          <button type="submit" className="button" aria-label={category ? t('save_category') : t('add_category')}>
            {category ? t('save') : t('add_category')}
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

export default CategoriesManager;