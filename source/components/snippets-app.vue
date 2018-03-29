<template>
    <div id="app" class="app">
        <app-header></app-header>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        components: {
            'app-header': require('./app-header.vue').default
        }
    };
</script>
