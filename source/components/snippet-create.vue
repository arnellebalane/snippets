<template>
    <div class="snippet-create">
        <app-header></app-header>
        <code-snippet :readonly="isSaving" @input="onSnippetInput"></code-snippet>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Shortcuts from '../mixins/shortcuts';

    export default {
        mixins: [Shortcuts],

        data() {
            return {
                snippet: null,
                isSaving: false,
                createSnippetEndpoint: 'http://www.mocky.io/v2/5a6973672e0000030b7a7475'
            };
        },

        methods: {
            getShortcuts() {
                return {
                    KeyS: async () => {
                        this.isSaving = true;
                        const response = await this.save();

                        this.$router.push({
                            name: 'snippet-detail',
                            params: {
                                hash: response.hash
                            }
                        });
                    }
                };
            },

            onSnippetInput(snippet) {
                this.snippet = snippet;
            },

            save() {
                return fetch(this.createSnippetEndpoint, {
                    method: 'POST',
                    body: JSON.stringify({
                        snippet: this.snippet
                    })
                }).then(response => response.json());
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
