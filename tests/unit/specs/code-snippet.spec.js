import { mount } from '@vue/test-utils';
import assert from 'assert';
import CodeSnippet from 'source/components/code-snippet.vue';

describe('code-snippet.vue', () => {
    function mountComponent(propsData={}) {
        return mount(CodeSnippet, { propsData });
    }

    it('renders a textarea element with default props', () => {
        const { element } = mountComponent();
        const textarea = element.querySelector('textarea');

        assert(textarea);
        assert.equal('', textarea.value);
        assert.equal(`console.log('hello world');`, textarea.placeholder);
        assert.equal(false, textarea.readOnly);
    });

    it('sets the textarea value based on the props', () => {
        const testCases = [
            ['hello world', { value: 'hello world' }],
            ['the value', { value: 'the value' }],
            ['', {}]
        ];

        testCases.forEach(([expected, propsData]) => {
            const { element } = mountComponent(propsData);
            const actual = element.querySelector('textarea').value;
            assert.equal(expected, actual);
        });
    });

    it('sets the textarea placeholder attribute based on the props', () => {
        const testCases = [
            ['hello world', { placeholder: 'hello world' }],
            ['a placeholder', { placeholder: 'a placeholder' }],
            [`console.log('hello world');`, {}]
        ];

        testCases.forEach(([expected, propsData]) => {
            const { element } = mountComponent(propsData);
            const actual = element.querySelector('textarea').placeholder;
            assert.equal(expected, actual);
        });
    });

    it('sets the textarea readonly attribute based on the props', () => {
        const testCases = [
            [true, { readonly: true }],
            [false, { readonly: false }],
            [false, {}],
        ];

        testCases.forEach(([expected, propsData]) => {
            const { element } = mountComponent(propsData);
            const actual = element.querySelector('textarea').readOnly;
            assert.equal(expected, actual);
        });
    });

    it('emits input event when textarea value changes', () => {
        const wrapper = mountComponent();
        const textarea = wrapper.find('textarea');

        const testCases = ['hello', 'world'];

        testCases.forEach((value, i) => {
            textarea.element.value = value;
            textarea.trigger('input');

            const emittedInput = wrapper.emitted().input;
            assert.equal(emittedInput[i][0], value);
        });

        assert.equal(testCases.length, wrapper.emitted().input.length);
    });
});
