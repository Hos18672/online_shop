import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from './../../components/common/Spinner';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const OrdersManager = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(t('error_fetching_data'));
        setLoading(false);
      }
    };
    fetchOrders();
  }, [t]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)));
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(t('error_updating_status'));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto" role="main" aria-label={t('admin_orders')}>
      <h1 className="text-2xl font-bold mb-6">{t('admin_orders')}</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">{t('no_orders')}</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded shadow bg-white" role="listitem">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <span className="font-semibold">{t('order')} {order.id}</span>
                  <p className="text-gray-600">
                    {t('total')}: ${order.total_price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">{t('created_at')}: {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <label htmlFor={`status-${order.id}`} className="sr-only">{t('update_status')}</label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="border p-2 rounded"
                    aria-label={`Update status for order ${order.id}`}
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="shipped">{t('shipped')}</option>
                    <option value="delivered">{t('delivered')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                  </select>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{t('items')}:</p>
                <ul className="list-disc pl-5">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item[`name_${t('lang')}`] || item.name_en} - {t('quantity')}: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersManager;