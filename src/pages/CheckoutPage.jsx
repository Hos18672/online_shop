import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import useCartStore from '../store/cartStore';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const schema = zod.object({
  address: zod.string().min(1, 'Address is required'),
  paymentMethod: zod.string().min(1, 'Payment method is required'),
});

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const order = {
        user_id: 'current_user_id', // Replace with Clerk user ID
        items,
        total_price: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        status: 'pending',
      };
      await createOrder(order);
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto" role="main" aria-label={t('checkout')}>
      <h1 className="text-2xl font-bold mb-6">{t('checkout')}</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">{t('cart_empty')}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="address" className="block mb-1">{t('address')}</label>
            <input
              id="address"
              {...register('address')}
              className="border p-2 rounded w-full"
              aria-invalid={errors.address ? 'true' : 'false'}
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block mb-1">{t('payment_method')}</label>
            <select
              id="paymentMethod"
              {...register('paymentMethod')}
              className="border p-2 rounded w-full"
              aria-invalid={errors.paymentMethod ? 'true' : 'false'}
            >
              <option value="">{t('select_payment')}</option>
              <option value="credit_card">{t('credit_card')}</option>
              <option value="paypal">{t('paypal')}</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500">{errors.paymentMethod.message}</p>}
          </div>
          <p className="text-lg font-semibold">
            {t('total')}: ${items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </p>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
            aria-label={t('place_order')}
          >
            {t('place_order')}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;