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

// Function to retrieve the user's identifier (email or learner_id)
export const getUserIdentifier = async () => {
  // First, check if we have a learner_id in localStorage (for OCID)
  const learnerId = localStorage.getItem('learner_id');
  if (learnerId) {
    return { type: 'learner_id', value: learnerId };
  }

  // If no learner_id, try to get email from Supabase
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (data?.user?.email) {
      return { type: 'email', value: data.user.email };
    }
  } catch (error) {
    console.error('Error fetching Supabase user:', error.message);
  }

  // If we reach here, we couldn't get an identifier
  console.error('No user identifier found');
  return null;
};