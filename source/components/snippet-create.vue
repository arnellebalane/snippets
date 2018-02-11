<template>
    <div class="snippet-create">
        <app-header></app-header>
        <code-snippet :value="snippet" :readonly="isSaving" @input="onSnippetInput"></code-snippet>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Shortcuts from '../mixins/shortcuts';
    import { post } from '../api';

    export default {
        mixins: [Shortcuts],

        data() {
            return {
                isSaving: false
            };
        },

        computed: mapState(['snippet']),

        methods: {
            getShortcuts() {
                return {
                    KeyS: () => {
                        if (!this.snippet) return;

                        this.isSaving = true;
                        this.save().then(response => {
                            this.$store.commit('clearSnippet');

                            this.$router.push({
                                name: 'snippet-detail',
                                params: {
                                    hash: response.hash
                                }
                            });
                        });
                    }
                };
            },

            onSnippetInput(snippet) {
                this.$store.commit('setSnippet', snippet);
            },

            save() {
                return this.snippet
                    ? post('/snippets', { snippet: this.snippet })
                    : null;
            }
        },

        components: {
            'app-header': require('./app-header.vue').default,
            'app-footer': require('./app-footer.vue').default,
            'code-snippet': require('./code-snippet.vue').default
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
