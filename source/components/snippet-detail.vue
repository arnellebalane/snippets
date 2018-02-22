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

    export default {
        mixins: [Shortcuts],

        props: {
            hash: {
                type: String,
                required: true
            },
            extension: String
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
                window.location.pathname = '/raw/' + this.hash;
            }
        },

        components: {
            'app-header': require('./app-header.vue').default,
            'app-footer': require('./app-footer.vue').default,
            'code-snippet': require('./code-snippet.vue').default
        },

        serverData(store, route) {
            return store.dispatch('fetchSnippet', route.params.hash);
        },

        beforeRouteLeave(to, from, next) {
            this.$store.commit('clearSnippet');
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
