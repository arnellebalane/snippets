import assert from 'assert';
import { mount, createLocalVue } from '@vue/test-utils';
import sinon from 'sinon';
import Vuex from 'vuex';
import SnippetDetail from 'source/components/SnippetDetail.vue';
import CodeSnippet from 'source/components/CodeSnippet.vue';
import AppFooter from 'source/components/AppFooter.vue';
import { createStore } from 'source/store';

const Vue = createLocalVue();
Vue.use(Vuex);

describe('SnippetDetail.vue', () => {
  let store;

  function mountComponent() {
    const $router = {
      push: sinon.stub()
    };
    return mount(SnippetDetail, {
      store,
      localVue: Vue,
      mocks: { $router }
    });
  }

  beforeEach(() => {
    store = createStore();
  });

  it('renders readonly CodeSnippet component', () => {
    const wrapper = mountComponent();
    const codeSnippet = wrapper.find(CodeSnippet);

    assert(codeSnippet.vm.readonly);
  });

  it('renders snippet value in CodeSnippet component', done => {
    const testValue = 'hello world';
    store.commit('setSnippet', testValue);

    const wrapper = mountComponent();
    const codeSnippet = wrapper.find(CodeSnippet);

    Vue.nextTick(() => {
      assert.equal(testValue, codeSnippet.vm.value);
      done();
    });
  });

  it('renders AppFooter component with hash prop', () => {
    const hash = 'hello-world';
    const wrapper = mountComponent();
    wrapper.setProps({ hash });

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

  /*
     * TODO: Update this test to support latest version of code-snippet
     * describe('#selectAll()', () => {
     *     it('highlights the contents of code-snippet textarea', done => {
     *         const testValue = 'hello world';
     *         store.commit('setSnippet', testValue);
     *
     *         const wrapper = mountComponent();
     *         const textarea = wrapper.find('textarea');
     *
     *         Vue.nextTick(() => {
     *             wrapper.vm.selectAll();
     *
     *             assert.equal(0, textarea.element.selectionStart);
     *             assert.equal(testValue.length, textarea.element.selectionEnd);
     *             done();
     *         });
     *     });
     * });
     */

  describe('#editNew()', () => {
    it('redirects to snippet-create route', () => {
      const wrapper = mountComponent();
      wrapper.vm.editNew();

      assert(wrapper.vm.$router.push.calledWith({ name: 'snippet-create' }));
    });

    it('resets the snippet state in the store', done => {
      const testValue = 'hello world';
      store.commit('setSnippet', testValue);

      const wrapper = mountComponent();
      wrapper.vm.editNew();

      Vue.nextTick(() => {
        assert.equal(null, store.state.snippet);
        done();
      });
    });
  });

  describe('#duplicate()', () => {
    it('redirects to snippet-create route', () => {
      const wrapper = mountComponent();
      wrapper.vm.duplicate();

      assert(wrapper.vm.$router.push.calledWith({ name: 'snippet-create' }));
    });

    it('keeps the snippet state in the store', done => {
      const testValue = 'hello world';
      store.commit('setSnippet', testValue);

      const wrapper = mountComponent();
      wrapper.vm.duplicate();

      Vue.nextTick(() => {
        assert.equal(testValue, store.state.snippet);
        done();
      });
    });
  });
});
