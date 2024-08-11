import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabase'

export function useAuth() {
  const user = ref(null)
  let subscription = null

  onMounted(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      user.value = session?.user ?? null
    })

    // Set up listener for auth state changes
    subscription = supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null
    })
  })

  onUnmounted(() => {
    if (subscription) {
      subscription.unsubscribe()
    }
  })

  return { user }
}