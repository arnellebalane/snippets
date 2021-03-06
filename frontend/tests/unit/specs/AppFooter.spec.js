import assert from 'assert';
import { mount } from '@vue/test-utils';
import AppFooter from 'source/components/AppFooter.vue';

describe('AppFooter.vue', () => {
  function mountComponent(propsData = {}) {
    return mount(AppFooter, { propsData });
  }

  it('renders the correct actions when hash is not available', () => {
    const { element } = mountComponent();

    const children = element.querySelector('ul').children;
    const actual = [];
    for (let i = 0; i < children.length; i++) {
      actual.push(children[i].textContent);
    }

    const expected = ['^S Save'];
    assert.deepStrictEqual(expected, actual);
  });

  it('render the correct actions when hash is available', () => {
    const { element } = mountComponent({ hash: 'hello' });

    const children = element.querySelector('ul').children;
    const actual = [];
    for (let i = 0; i < children.length; i++) {
      actual.push(children[i].textContent);
    }

    const expected = ['^A Select All', '^E Edit New', '^D Duplicate', '^R Raw'];
    assert.deepStrictEqual(expected, actual);
  });
});
