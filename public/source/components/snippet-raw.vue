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
            const getSnippetEndpoint = 'http://www.mocky.io/v2/5a6973672e0000030b7a7475';
            const response = await fetch(getSnippetEndpoint)
                .then(response => response.json());
            store.commit('setSnippet', response.snippet);
            next();
        }
    };
</script>
