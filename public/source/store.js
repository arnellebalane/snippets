import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default function createStore() {
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
        }
    })
};
