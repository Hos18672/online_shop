import { supabase } from '../lib/supabaseClient';

// Fetch all categories from Supabase
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

// Fetch a single category by ID
export const getCategoryById = async (id) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching category:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Add a new category
export const addCategory = async (category) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding category:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Update an existing category
export const updateCategory = async (id, category) => {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message);
  }
  
  return data;
};

// Delete a category
export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(error.message);
  }
  
  return true;
};