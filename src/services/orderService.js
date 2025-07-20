import { supabase } from '../lib/supabaseClient';

// Fetch all orders (for admin or specific user)
export const getOrders = async (userId = null) => {
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

  // If userId is provided, filter orders by user
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message);
  }
  return data;
};

// Fetch a single order by ID
export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw new Error(error.message);
  }
  return data;
};

// Create a new order
export const createOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(error.message);
  }
  return data;
};

// Update an order's status
export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.message);
  }
  return data;
};