<template>
    <section class="code-snippet">
        <pre v-if="readonly"><code :class="language" ref="snippet">{{ snippet }}</code></pre>
        <textarea v-else ref="snippet" :placeholder="placeholder" spellcheck="false" autofocus v-model="snippet"></textarea>
    </section>
</template>

<script>
    import hljs from 'nodeModules/highlightjs/highlight.pack.min';

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
            },
            language: String
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
                if (this.readonly) {
                    const range = document.createRange();
                    range.selectNode(this.$refs.snippet);

                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    this.$refs.snippet.select();
                }
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

<<<<<<< HEAD
<style src="nodeModules/highlightjs/styles/monokai-sublime.css"></style>
=======
<style src="node_modules/highlightjs/styles/monokai-sublime.css"></style>
>>>>>>> origin/master
<style scoped>
    textarea, pre, code {
        display: block;
        width: 100%;
        height: 100%;
        font: inherit;
        line-height: 14px;
        color: #c5c8c6;
    }

    textarea {
        padding: 3px 5px;
        border: none;
        background-color: transparent;
        outline: none;
        resize: none;
    }

    pre {
        padding: 3px 5px;
        margin: 0;
    }

    code {
        padding: 0;
        background-color: transparent;
    }
</style>
