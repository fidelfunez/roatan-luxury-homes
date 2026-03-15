import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create admin client
const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || supabaseAnonKey || '');

export const testDatabaseConnection = async () => {
  try {
    const { error: testError } = await supabaseAdmin
      .from('client_submissions')
      .select('count')
      .limit(1);
    
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('client_submissions')
      .select('*')
      .limit(5);
    
    return {
      success: !testError && !submissionsError,
      connection: !testError,
      submissions: submissions?.length || 0,
      error: testError || submissionsError
    };
  } catch (error) {
    console.error('Database test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testRLSPolicies = async () => {
  try {
    const regularClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
    const { error: regularError } = await regularClient
      .from('client_submissions')
      .select('*')
      .limit(1);
    
    const { error: adminError } = await supabaseAdmin
      .from('client_submissions')
      .select('*')
      .limit(1);
    
    return {
      regularClientWorks: !regularError,
      adminClientWorks: !adminError,
      regularError,
      adminError
    };
  } catch (error) {
    console.error('RLS test failed:', error);
    return {
      error: error.message
    };
  }
}; 