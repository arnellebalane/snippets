<template>
    <div class="snippet-detail">
        <app-header></app-header>
        <code-snippet ref="snippet" :value="snippet" readonly></code-snippet>
        <app-footer :hash="hash"></app-footer>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Shortcuts from '../mixins/shortcuts';
    import store from '../store';

    export default {
        mixins: [Shortcuts],

        props: {
            hash: {
                type: String,
                required: true
            }
        },

        computed: mapState(['snippet']),

        methods: {
            getShortcuts() {
                return {
                    KeyA: this.selectAll,
                    KeyE: this.editNew,
                    KeyD: this.duplicate
                };
            },

            selectAll() {
                this.$refs.snippet.select();
            },

            editNew() {
                this.$router.push({ name: 'snippet-create' });
            },

            duplicate() {
                this.$router.push({
                    name: 'snippet-create',
                    query: {
                        hash: this.hash
                    }
                });
            }
        },

        components: {
            'app-header': require('./app-header.vue').default,
            'app-footer': require('./app-footer.vue').default,
            'code-snippet': require('./code-snippet.vue').default
        },

        async beforeRouteEnter(to, from, next) {
            const getSnippetEndpoint = 'http://www.mocky.io/v2/5a6973672e0000030b7a7475';
            const response = await fetch(getSnippetEndpoint)
                .then(response => response.json());
            store.commit('setSnippet', response.snippet);
            next();
        }
    };
</script>

<style scoped>
    .code-snippet {
        position: fixed;
        top: 16px;
        left: 0;
        right: 0;
        bottom: 16px;
    }

    .app-footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
