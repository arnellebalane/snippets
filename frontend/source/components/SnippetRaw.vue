<template>
    <code>
        <pre>{{ snippet }}</pre>
    </code>
</template>

<script>
import {mapState} from 'vuex';
import store from '../store';

export default {
    name: 'SnippetRaw',

    computed: mapState(['snippet']),

    beforeRouteEnter(to, from, next) {
        if (store.state.snippet) {
            return next();
        }

        return store.dispatch('fetchSnippet', to.params.hash)
            .then(() => next())
            .catch(() => next('/'));
    }
};
</script>

<style scoped>
code {
    display: block;
    min-height: 100vh;
    padding: 24px;
    font-size: 16px;
    line-height: initial;
    color: #222;
    background-color: #fff;
}

pre {
    margin: 0;
}
</style>
