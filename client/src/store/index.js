import { createStore } from "vuex";
import { supabase } from "../supabase";
import axios from "axios";

export default createStore({
  state: {
    dbData: null,
    hasFilled: false,
    isLoading: false,
    error: null
  },
  mutations: {
    setDbData(state, data) {
      state.dbData = data;
    },
    setHasFilled(state, status) {
      state.hasFilled = status;
    },
    setLoading(state, status) {
      state.isLoading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    SET_BANNER_URL(state, url) {
      state.dbData.profile_banner = url;
    }
  },
  actions: {
    async fetchUserData({ commit, state }) {
      // If data is already loaded, don't fetch again
      if (state.dbData) return;

      commit('setLoading', true);
      commit('setError', null);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user && user.email) {
          const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/user`, {
            params: { email: user.email },
          });

          if (response.data) {
            console.log("Data retrieved:", response.data);
            commit("setDbData", response.data);
            commit("setHasFilled", response.data.hasFilled);
          } else {
            throw new Error("No data found for the given email");
          }
        } else {
          throw new Error("No authenticated user found");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
        commit('setError', error.message);
      } finally {
        commit('setLoading', false);
      }
    },
    updateBannerUrl({ commit }, url) {
      commit('SET_BANNER_URL', url);
    }
  }
});