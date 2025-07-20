import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { getCategories, addCategory } from './../../services/categoryService';
import  './../../styles/CategoriesManager.scss'; // ✅ SCSS Module

const schema = zod.object({
  name_en: zod.string().min(1, 'English name is required'),
  name_de: zod.string().min(1, 'German name is required'),
  name_fa: zod.string().min(1, 'Persian name is required'),
});

const CategoriesManager = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      const newCategory = await addCategory(data);
      setCategories([...categories, newCategory]);
      reset();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className={'container'} role="main" aria-label={t('admin_categories')}>
      <h1 className={'heading'}>{t('admin_categories')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={'form'}>
        <div className={'inputGroup'}>
          <label htmlFor="name_en">{t('name_en')}</label>
          <input
            id="name_en"
            {...register('name_en')}
            aria-invalid={errors.name_en ? 'true' : 'false'}
          />
          {errors.name_en && <p className={'error'}>{errors.name_en.message}</p>}
        </div>
        <div className={'inputGroup'}>
          <label htmlFor="name_de">{t('name_de')}</label>
          <input
            id="name_de"
            {...register('name_de')}
            aria-invalid={errors.name_de ? 'true' : 'false'}
          />
          {errors.name_de && <p className={'error'}>{errors.name_de.message}</p>}
        </div>
        <div className={'inputGroup'}>
          <label htmlFor="name_fa">{t('name_fa')}</label>
          <input
            id="name_fa"
            {...register('name_fa')}
            aria-invalid={errors.name_fa ? 'true' : 'false'}
          />
          {errors.name_fa && <p className={'error'}>{errors.name_fa.message}</p>}
        </div>
        <button type="submit" className={'button'} aria-label={t('add_category')}>
          {t('add_category')}
        </button>
      </form>
      <ul className={'categoryList'}>
        {categories.map((category) => (
          <li key={category.id} className={'categoryItem'} role="listitem">
            {category[`name_en`]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesManager;
