import assert from 'assert';
import {mount} from '@vue/test-utils';
import AppHeader from 'source/components/AppHeader.vue';

describe('AppHeader.vue', () => {
    it('renders the correct title', () => {
        const {element} = mount(AppHeader);

        const expected = 'snippets.arnellebalane.com';
        const actual = element.querySelector('h1').textContent;
        assert.equal(expected, actual);
    });
});
