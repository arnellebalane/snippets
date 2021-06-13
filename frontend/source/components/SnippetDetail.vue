<template>
  <div class="snippet-detail">
    <AppHeader />
    <CodeSnippet
      ref="snippet"
      :value="snippet"
      :language="extension"
      readonly
    />
    <AppFooter :hash="hash" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '../store';
import Shortcuts from '../mixins/shortcuts';
import AppHeader from './AppHeader.vue';
import AppFooter from './AppFooter.vue';
import CodeSnippet from './CodeSnippet.vue';

export default {
  name: 'SnippetDetail',

  components: {
    AppHeader,
    AppFooter,
    CodeSnippet
  },

  mixins: [Shortcuts],

  props: {
    hash: {
      type: String,
      required: true
    },
    extension: {
      type: String,
      default: ''
    }
  },

  computed: mapState(['snippet']),

  methods: {
    getShortcuts() {
      return {
        KeyA: this.selectAll,
        KeyE: this.editNew,
        KeyD: this.duplicate,
        KeyR: this.raw
      };
    },

    selectAll() {
      this.$refs.snippet.select();
    },

    editNew() {
      this.$store.commit('clearSnippet');
      this.$router.push({ name: 'snippet-create' });
    },

    duplicate() {
      this.$router.push({ name: 'snippet-create' });
    },

    raw() {
      this.$router.push({
        name: 'snippet-raw',
        params: {
          hash: this.hash
        }
      });
    }
  },

  beforeRouteEnter(to, from, next) {
    if (store.state.snippet) {
      return next();
    }

    return store
      .dispatch('fetchSnippet', to.params.hash)
      .then(() => next())
      .catch(() => next('/'));
  }
};
</script>

<style scoped>
.code-snippet {
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
