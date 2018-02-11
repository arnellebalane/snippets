import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import assert from 'assert';
import SnippetDetail from 'source/components/snippet-detail.vue';
import CodeSnippet from 'source/components/code-snippet.vue';
import AppFooter from 'source/components/app-footer.vue';
import createStore from 'source/store';

const Vue = createLocalVue();
Vue.use(Vuex);

describe('snippet-detail.vue', () => {
    let store;

    function mountComponent(mountData={}) {
        return mount(SnippetDetail, { store, localVue: Vue });
    }

    beforeEach(() => {
        store = createStore();
    });

    it('renders readonly code-snippet component', () => {
        const wrapper = mountComponent();
        const codeSnippet = wrapper.find(CodeSnippet);

        assert(codeSnippet.vm.readonly);
    });

    it('renders snippet value in code-snippet component', done => {
        const testValue = 'hello world';
        store.commit('setSnippet', testValue);

        const wrapper = mountComponent();
        const codeSnippet = wrapper.find(CodeSnippet);

        Vue.nextTick(() => {
            assert.equal(testValue, codeSnippet.vm.value);
            done();
        });
    });

    it('renders app-footer component with hash prop', () => {
        const hash = 'hello-world';
        const wrapper = mountComponent();
        wrapper.setProps({ hash });

        const appFooter = wrapper.find(AppFooter);
        assert.equal(hash, appFooter.vm.hash);
    });

    it('defines its corresponding keyboard shortcuts', () => {
        const wrapper = mountComponent();
        const shortcuts = wrapper.vm.getShortcuts();

        const expected = ['KeyA', 'KeyE', 'KeyD', 'KeyR'];
        const actual = Object.keys(shortcuts);

        assert.deepEqual(expected, actual);
    });
});
