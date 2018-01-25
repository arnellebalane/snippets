<template>
    <pre class="snippet-raw">
        <code>{{ snippet }}</code>
    </pre>
</template>

<script>
    import store from '../store';
    import { mapState } from 'vuex';

    export default {
        props: {
            hash: {
                type: String,
                required: true
            }
        },

        computed: mapState(['snippet']),

        async beforeRouteEnter(to, from, next) {
            const response = await fetch('/snippets/' + to.params.hash)
                .then(response => response.json());
            store.commit('setSnippet', response.snippet);
            next();
        }
    };
</script>
