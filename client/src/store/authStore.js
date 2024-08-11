// src/store/authStore.js
import { reactive } from 'vue'

export const authStore = reactive({
  user: null,
  session: null,
  
  setSession(session) {
    this.session = session
    this.user = session?.user ?? null
  },

  clearSession() {
    this.session = null
    this.user = null
  }
})