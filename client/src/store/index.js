// src/store/index.js
import { createStore } from "vuex";
import { supabase } from "../supabase";
import axios from "axios";

export default createStore({
  state: {
    dbData: null,
    hasFilled: false,
  },
  mutations: {
    setDbData(state, data) {
      state.dbData = data;
    },
    setHasFilled(state, status) {
      state.hasFilled = status;
    },
  },
  actions: {
    async fetchUserData({ commit }) {
      try {
        const { data: user, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user && user.email) {
          const response = await axios.get(
            `/api/user?email=${encodeURIComponent(user.email)}`
          );

          if (response.data) {
            console.log("Data retrieved:", response.data);
            commit("setDbData", response.data);
            commit("setHasFilled", response.data.hasFilled);
          } else {
            console.error("No data found for the given email");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
      }
    },
  },
});
