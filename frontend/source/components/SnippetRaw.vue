<template>
    <h1>HELLO WORLD</h1>
</template>

<script>
import store from '../store';

export default {
    name: 'SnippetRaw',

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
