import { mount } from '@vue/test-utils';
import assert from 'assert';
import AppHeader from 'source/components/app-header.vue';

describe('app-header.vue', () => {
    it('renders the correct title', () => {
        const { element } = mount(AppHeader);

        const expected = 'snippets.arnellebalane.com';
        const actual = element.querySelector('h1').textContent;
        assert.equal(expected, actual);
    });
});
