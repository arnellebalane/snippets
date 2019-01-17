<template>
    <h1>HELLO WORLD</h1>
</template>

<script>
    import store from '../store';

    export default {
        beforeRouteEnter(to, from, next) {
            if (store.state.snippet) {
                return next();
            }

            store.dispatch('fetchSnippet', to.params.hash)
                .then(() => next())
                .catch(() => next('/'));
        }
    };
</script>
