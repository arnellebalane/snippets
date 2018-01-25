<template>
    <div class="snippets-app">
        <app-header></app-header>
        <app-snippet ref="snippet"></app-snippet>
        <app-footer></app-footer>
    </div>
</template>

<script>
    export default {
        methods: {
            save() {
                console.log('save');
            },

            selectAll() {
                this.$refs.snippet.selectAll();
            },

            editNew() {
                console.log('edit new');
            },

            duplicate() {
                console.log('duplicate');
            },

            raw() {
                console.log('raw');
            }
        },

        created() {
            const keybindings = {
                KeyA: this.selectAll,
                KeyD: this.duplicate,
                KeyE: this.editNew,
                KeyR: this.raw,
                KeyS: this.save
            };

            window.addEventListener('keydown', e => {
                if (e.ctrlKey && e.code in keybindings) {
                    e.preventDefault();
                    keybindings[e.code]();
                }
            });
        },

        components: {
            'app-header': require('./app-header.vue').default,
            'app-snippet': require('./app-snippet.vue').default,
            'app-footer': require('./app-footer.vue').default
        }
    };
</script>

<style scoped>
    .app-snippet {
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
