<template>
    <div class="snippet-create">
        <app-header></app-header>
        <code-snippet @input="onSnippetInput"></code-snippet>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Shortcuts from '../mixins/shortcuts';

    export default {
        mixins: [Shortcuts],

        data() {
            return {
                value: null,
                createSnippetEndpoint: 'http://www.mocky.io/v2/5a6971112e0000760a7a7461'
            };
        },

        methods: {
            getShortcuts() {
                return {
                    KeyS: this.save
                };
            },

            onSnippetInput(value) {
                this.value = value;
            },

            async save() {
                const response = await fetch(this.createSnippetEndpoint, {
                    method: 'POST',
                    body: JSON.stringify({
                        snippet: this.value
                    })
                }).then(response => response.json());
                console.log(response);
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
