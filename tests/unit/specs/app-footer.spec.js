import Vue from 'vue';
import assert from 'assert';
import AppFooter from 'source/components/app-footer.vue';

describe('app-footer.vue', () => {
    function renderComponent(propsData={}) {
        const Constructor = Vue.extend(AppFooter);
        return new Constructor({ propsData }).$mount();
    }

    it('renders the correct actions when hash is not available', () => {
        const vm = renderComponent();

        const children = vm.$el.querySelector('ul').children;
        const actual = [];
        for (let i = 0; i < children.length; i++) {
            actual.push(children[i].textContent);
        }

        const expected = ['^S Save'];
        assert.deepStrictEqual(expected, actual);
    });

    it('render the correct actions when hash is available', () => {
        const vm = renderComponent({ hash: 'hello' });

        const children = vm.$el.querySelector('ul').children;
        const actual = [];
        for (let i = 0; i < children.length; i++) {
            actual.push(children[i].textContent);
        }

        const expected = ['^A Select All', '^E Edit New', '^D Duplicate', '^R Raw'];
        assert.deepStrictEqual(expected, actual);
    });
});
