import Vue from 'vue';
import assert from 'assert';
import CodeSnippet from 'source/components/code-snippet.vue';

describe('code-snippet.vue', () => {
    function renderComponent(propsData={}) {
        const Constructor = Vue.extend(CodeSnippet);
        return new Constructor({ propsData }).$mount();
    }

    it('renders a textarea element with default props', () => {
        const vm = renderComponent();
        const textarea = vm.$el.querySelector('textarea');

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
            const vm = renderComponent(propsData);
            const actual = vm.$el.querySelector('textarea').value;
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
            const vm = renderComponent(propsData);
            const actual = vm.$el.querySelector('textarea').placeholder;
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
            const vm = renderComponent(propsData);
            const actual = vm.$el.querySelector('textarea').readOnly;
            assert.equal(expected, actual);
        });
    });
});
