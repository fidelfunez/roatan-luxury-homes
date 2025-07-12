import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Properties functions
export const getProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getProperties:', error);
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPropertyById:', error);
    return null;
  }
};

export const addProperty = async (newPropertyData) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([newPropertyData])
      .select()
      .single();

    if (error) {
      console.error('Error adding property:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addProperty:', error);
    throw error;
  }
};

export const updateProperty = async (propertyId, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(updatedData)
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateProperty:', error);
    throw error;
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error deleting property:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    return false;
  }
};

// Blog functions
export const getBlogPosts = async () => {
  try {
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    console.log('Supabase response:', { data, error });
    return data || [];
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return null;
  }
};

export const addBlogPost = async (newBlogData) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([newBlogData])
      .select()
      .single();

    if (error) {
      console.error('Error adding blog post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addBlogPost:', error);
    throw error;
  }
};

export const updateBlogPost = async (postId, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updatedData)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    return false;
  }
};

// Client submissions functions
export const getClientSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('client_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching client submissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getClientSubmissions:', error);
    return [];
  }
};

export const addClientSubmission = async (submissionData) => {
  try {
    const { data, error } = await supabase
      .from('client_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      console.error('Error adding client submission:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addClientSubmission:', error);
    throw error;
  }
};

export const updateClientSubmission = async (submissionId, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('client_submissions')
      .update(updatedData)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating client submission:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateClientSubmission:', error);
    throw error;
  }
};

export const deleteClientSubmission = async (submissionId) => {
  try {
    const { error } = await supabase
      .from('client_submissions')
      .delete()
      .eq('id', submissionId);

    if (error) {
      console.error('Error deleting client submission:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteClientSubmission:', error);
    return false;
  }
}; 