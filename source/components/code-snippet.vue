<template>
    <section class="code-snippet">
        <textarea ref="snippet" placeholder="console.log('hello world')" spellcheck="false" autofocus @input="onInput">{{ value }}</textarea>
    </section>
</template>

<script>
    export default {
        props: ['value'],

        methods: {
            selectAll() {
                this.$refs.snippet.select();
            },

            onInput(e) {
                this.$emit('input', e.target.value);
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
