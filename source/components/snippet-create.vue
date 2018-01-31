<template>
    <div class="snippet-create">
        <app-header></app-header>
        <code-snippet :value="snippet" @input="onSnippetInput"></code-snippet>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        computed: mapState(['snippet']),

        methods: {
            onSnippetInput(snippet) {
                this.$store.commit('setSnippet', snippet);
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
