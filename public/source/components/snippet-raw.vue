<template>
    <pre class="snippet-raw">
        <code>{{ snippet }}</code>
    </pre>
</template>

<script>
    import store from '../store';
    import { mapState } from 'vuex';
    import { get } from '../api';

    export default {
        props: {
            hash: {
                type: String,
                required: true
            }
        },

        computed: mapState(['snippet']),

        async beforeRouteEnter(to, from, next) {
            const response = await get('/snippets/' + to.params.hash);
            store.commit('setSnippet', response.snippet);
            next();
        }
    };
</script>
