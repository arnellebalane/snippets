import Vue from 'vue';
import assert from 'assert';
import AppHeader from 'source/components/app-header.vue';

describe('app-header.vue', () => {
    it('should render the correct title', () => {
        const Constructor = Vue.extend(AppHeader);
        const vm = new Constructor().$mount();

        const expected = 'snippets.arnellebalane.com';
        const actual = vm.$el.querySelector('h1').textContent;
        assert.equal(expected, actual);
    });
});
