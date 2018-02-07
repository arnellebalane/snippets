import Vue from 'vue';
import assert from 'assert';
import AppFooter from 'source/components/app-footer.vue';

describe('app-footer.vue', () => {
    it('renders the correct actions when hash is not available', () => {
        const Constructor = Vue.extend(AppFooter);
        const vm = new Constructor().$mount();

        const children = vm.$el.querySelector('ul').children;
        const actual = [];
        for (let i = 0; i < children.length; i++) {
            actual.push(children[i].textContent);
        }

        const expected = ['^S Save'];
        assert.deepStrictEqual(expected, actual);
    });

    it('render the correct actions when hash is available', () => {
        const Constructor = Vue.extend(AppFooter);
        const propsData = { hash: 'hello' };
        const vm = new Constructor({ propsData }).$mount();

        const children = vm.$el.querySelector('ul').children;
        const actual = [];
        for (let i = 0; i < children.length; i++) {
            actual.push(children[i].textContent);
        }

        const expected = ['^A Select All', '^E Edit New', '^D Duplicate', '^R Raw'];
        assert.deepStrictEqual(expected, actual);
    });
});
