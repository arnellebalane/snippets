<template>
    <section class="code-snippet">
        <pre v-if="readonly"><code ref="snippet" :class="language">{{ snippet }}</code></pre>
        <textarea
            v-else
            ref="snippet"
            v-model="snippet"
            :placeholder="placeholder"
            spellcheck="false"
            autofocus
        ></textarea>
    </section>
</template>

<script>
import hljs from 'nodeModules/highlightjs/highlight.pack.min';

export default {
    name: 'CodeSnippet',

    props: {
        value: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: 'console.log(\'hello world\');'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: ''
        }
    },

    computed: {
        snippet: {
            get() {
                return this.value;
            },

            set(value) {
                this.$emit('input', value);
            }
        }
    },

    mounted() {
        if (this.readonly) {
            hljs.highlightBlock(this.$refs.snippet);
        } else {
            this.$refs.snippet.focus();
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
    }
};
</script>

<style src="nodeModules/highlightjs/styles/monokai-sublime.css"></style>
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
