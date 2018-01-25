<template>
    <section class="app-snippet">
        <textarea ref="snippet" placeholder="console.log('hello world')" spellcheck="false" autofocus></textarea>
    </section>
</template>

<script>
    export default {
        methods: {
            selectAll() {
                this.$refs.snippet.select();
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
