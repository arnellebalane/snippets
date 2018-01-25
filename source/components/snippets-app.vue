<template>
    <div class="snippets-app">
        <app-header></app-header>
        <app-snippet></app-snippet>
        <app-footer></app-footer>
    </div>
</template>

<script>
    export default {
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
