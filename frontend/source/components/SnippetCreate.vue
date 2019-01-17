<template>
    <div class="snippet-create">
        <AppHeader />
        <CodeSnippet :value="snippet" :readonly="isSaving" @input="onSnippetInput" />
        <AppFooter />
    </div>
</template>

<script>
import {mapState} from 'vuex';
import {post} from '../api';
import Shortcuts from '../mixins/shortcuts';
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import CodeSnippet from './CodeSnippet.vue';

export default {
    name: 'SnippetCreate',

    components: {
        AppHeader,
        AppFooter,
        CodeSnippet
    },

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
                    if (!this.snippet) { return; }

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
                ? post('/snippets', {snippet: this.snippet})
                : null;
        }
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
