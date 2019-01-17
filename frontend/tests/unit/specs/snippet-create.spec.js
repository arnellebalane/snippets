import assert from 'assert';
import {mount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import SnippetCreate from 'source/components/snippet-create.vue';
import CodeSnippet from 'source/components/code-snippet.vue';
import {createStore} from 'source/store';

const Vue = createLocalVue();
Vue.use(Vuex);

describe('snippet-create.vue', () => {
    let store;

    function mountComponent() {
        return mount(SnippetCreate, {store, localVue: Vue});
    }

    beforeEach(() => {
        store = createStore();
    });

    it('renders a textarea element for inputting snippets', () => {
        const wrapper = mountComponent();
        const textarea = wrapper.find('textarea:focus');

        assert(textarea.exists());
    });

    it('disables the textarea when saving', () => {
        const wrapper = mountComponent();
        const codeSnippet = wrapper.find(CodeSnippet);
        assert.equal(false, codeSnippet.vm.readonly);

        wrapper.setData({isSaving: true});
        assert(codeSnippet.vm.readonly);
    });

    it('defines its corresponding keyboard shortcuts', () => {
        const wrapper = mountComponent();
        const shortcuts = wrapper.vm.getShortcuts();

        const expected = ['KeyS'];
        const actual = Object.keys(shortcuts);

        assert.deepEqual(expected, actual);
    });

    it('updates the store snippet state on input', done => {
        const wrapper = mountComponent();
        const codeSnippet = wrapper.find(CodeSnippet);

        const testValue = 'hello world';
        codeSnippet.vm.snippet = testValue;

        Vue.nextTick(() => {
            assert.equal(testValue, store.state.snippet);
            done();
        });
    });
});
