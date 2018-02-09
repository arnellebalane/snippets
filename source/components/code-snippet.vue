<template>
    <section class="code-snippet">
        <textarea ref="snippet" :placeholder="placeholder" :readonly="readonly" spellcheck="false" autofocus v-model="snippet"></textarea>
    </section>
</template>

<script>
    export default {
        props: {
            value: String,
            placeholder: {
                type: String,
                default: 'console.log(\'hello world\');'
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                snippet: this.value
            };
        },

        watch: {
            snippet(snippet) {
                this.$emit('input', snippet);
            }
        },

        methods: {
            select() {
                this.$refs.snippet.select();
            }
        },

        mounted() {
            if (!this.readonly) {
                this.$refs.snippet.focus();
            }
        }
    };
</script>

<style scoped>
    textarea {
        display: block;
        width: 100%;
        height: 100%;
        padding: 3px 5px;
        border: none;
        font: inherit;
        line-height: 14px;
        color: #c5c8c6;
        background-color: transparent;
        outline: none;
        resize: none;
    }
</style>
