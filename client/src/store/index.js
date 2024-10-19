import { createStore } from "vuex";
import { supabase } from "../supabase";
import axios from "axios";

export default createStore({
  state: {
    dbData: null,
    hasFilled: false,
    isLoading: false,
    error: null,
    dataLoaded: false
  },
  getters: {
    isDataLoaded: state => state.dataLoaded
  },
  mutations: {
    setDbData(state, data) {
      state.dbData = data;
      state.dataLoaded = true;
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

      if (state.dbData) return;

      commit('setLoading', true);
      commit('setError', null);

      try {
        let userData;
        const learnerId = localStorage.getItem('learner_id');

        if (learnerId) {
          // Fetch user data by learner_id
          const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/user-by-id`, {
            params: { learner_id: learnerId },
          });
          userData = response.data;
        } else {
          // Fallback to fetching by email
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;

          if (user && user.email) {
            const response = await axios.get(`${process.env.VUE_APP_LOCAL_SERVER_URL}/api/user`, {
              params: { email: user.email },
            });
            userData = response.data;
          } else {
            throw new Error("No authenticated user found");
          }
        }

        if (userData) {
          //console.log("Data retrieved:", userData);
          commit("setDbData", userData);
          commit("setHasFilled", userData.hasFilled);
        } else {
          throw new Error("No data found for the user");
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