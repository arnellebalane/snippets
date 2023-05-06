<template>
  <header class="app-header">
    <h1>{{ hostname }}</h1>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',

  data() {
    const { hostname } = window.location;

    return { hostname };
  },
};
</script>

<style scoped>
.app-header {
  padding: 1px 5px;
  color: #1d1f21;
  background-color: #c5c8c6;
}

h1 {
  margin: 0;
  font-size: inherit;
  font-weight: 400;
}
</style>
