<template>
    <div class="snippets-app">
        <app-header></app-header>
    </div>
</template>

<script>
    export default {
        components: {
            'app-header': require('./app-header.vue').default
        }
    };
</script>
