import Vue from 'vue';
import Vuex from 'vuex';
import {get} from './api';

Vue.use(Vuex);

export default () => new Vuex.Store({
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
        fetchSnippet(context, hash) {
            return get('/' + hash).then(response => {
                context.commit('setSnippet', response.body);
            });
        }
    }
});
