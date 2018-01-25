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
                    KeyD: this.duplicate,
                    KeyR: this.raw
                };
            },

            selectAll() {
                this.$refs.snippet.select();
            },

            editNew() {
                this.$store.commit('clearSnippet');
                this.$router.push({ name: 'snippet-create' });
            },

            duplicate() {
                this.$router.push({ name: 'snippet-create' });
            },

            raw() {
                // TODO: This should ideally redirect to a page not controlled
                // by vue-router.
                this.$router.push({
                    name: 'snippet-raw',
                    params: {
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
            const response = await fetch('/snippets/' + to.params.hash)
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
