import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to retrieve the user's email address
export const getUserEmail = async () => {
    const { data, error } = await supabase.auth.getUser();
  
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
  
    return data?.user?.email || null;
  };