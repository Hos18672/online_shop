import { supabase } from '../lib/supabaseClient';


export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

// Fetch a single product by ID
export const getProductById = async (id) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// Search products by name, category, and price range
export const searchProducts = async ({ name, category, priceRange }) => {
  let query = supabase.from('products').select('*');

  if (name) {
    query = query.ilike('name_en', `%${name}%`);
  }

  if (category) {
    query = query.eq('category_id', category);
  }

  if (priceRange) {
    if (priceRange === '0-50') {
      query = query.gte('price', 0).lte('price', 50);
    } else if (priceRange === '50-100') {
      query = query.gt('price', 50).lte('price', 100);
    } else if (priceRange === '100+') {
      query = query.gt('price', 100);
    }
  }

  const { data, error } = await query.order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

// Add a new product
export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      category_id: product.category_id,
      name_en: product.name_en,
      name_de: product.name_de,
      name_fa: product.name_fa,
      description_en: product.description_en || null,
      description_de: product.description_de || null,
      description_fa: product.description_fa || null,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || null,
      sales_count: 0
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    throw new Error(error.message);
  }
  return data;
};

// Update an existing product
export const updateProduct = async (id, product) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      category_id: product.category_id,
      name_en: product.name_en,
      name_de: product.name_de,
      name_fa: product.name_fa,
      description_en: product.description_en || null,
      description_de: product.description_de || null,
      description_fa: product.description_fa || null,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message);
  }
  return data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.message);
  }
  return true;
};

// Fetch all categories (for compatibility with SearchBar and ProductsManager)
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Fetch all products
export const getOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};