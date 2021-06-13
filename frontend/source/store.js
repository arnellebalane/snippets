import Vue from 'vue';
import Vuex from 'vuex';
import { get } from './api';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      snippet: null
    },

    mutations: {
      setSnippet(state, snippet) {
        state.snippet = snippet;
      },

      clearSnippet(state) {
        state.snippet = null;
      }
    },

    actions: {
      fetchSnippet({ commit }, hash) {
        return get(`/${hash}`).then(response => {
          commit('setSnippet', response.body);
        });
      }
    }
  });
}

export default createStore();
