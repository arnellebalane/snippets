import Vuex from 'vuex';

const store = new Vuex.Store({
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
});

export default store;
