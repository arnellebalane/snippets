<template>
    <section class="code-snippet">
        <pre v-if="readonly"><code class="snippet" ref="snippet">{{ snippet }}</code></pre>
        <textarea v-else ref="snippet" :placeholder="placeholder" spellcheck="false" autofocus v-model="snippet"></textarea>
    </section>
</template>

<script>
    import hljs from 'node_modules/highlightjs/highlight.pack.min';

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
            if (this.readonly) {
                hljs.highlightBlock(this.$refs.snippet);
            } else {
                this.$refs.snippet.focus();
            }
        }
    };
</script>

<style scoped src="node_modules/highlightjs/styles/railscasts.css"></style>
<style scoped>
    textarea, pre, code {
        display: block;
        width: 100%;
        height: 100%;
        font: inherit;
        line-height: 14px;
    }

    textarea {
        padding: 3px 5px;
        border: none;
        color: #c5c8c6;
        background-color: transparent;
        outline: none;
        resize: none;
    }

    pre {
        padding: 3px 5px;
        margin: 0;
    }

    .code-snippet code.snippet {  /* make specificity greater than hljs */
        padding: 0;
        background-color: transparent;
    }
</style>
