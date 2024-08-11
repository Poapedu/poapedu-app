// src/plugins/supabase.js
import { supabase } from '@/supabase'
import { authStore } from '@/store/authStore'
import router from '../router'

// Initialize the session
supabase.auth.getSession().then(({ data: { session } }) => {
  authStore.setSession(session)
})

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // delete any user data stored in localStorage
    localStorage.removeItem('user')
    // redirect to login page
    router.push('/signin')
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // you can store any needed user data in localStorage here
    const userData = session.user
    localStorage.setItem('user', JSON.stringify(userData))
    // optionally redirect to dashboard or home page
    router.push('/dashboard')
  }
})
export default {
  install: (app) => {
    app.config.globalProperties.$supabase = supabase
    app.provide('supabase', supabase)
  }
}