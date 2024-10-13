export const getBaseUrl = () => {
  let origin;

  if (process.env.VUE_APP_SUPABASE_REDIRECT_URL) {
      // Create a URL object from the environment variable
      const envUrl = new URL(process.env.VUE_APP_SUPABASE_REDIRECT_URL);
      origin = envUrl.origin;
  } else {
      // Get the origin from the current window location
      origin = window.location.origin;
  }

  // Append '/profile/' to the origin
  return `${origin}`;
};