import s from './SnippetEditor.module.css';

export const SnippetEditor = () => {
    const placeholder = `console.log('hello world');`;

    return <textarea className={s.editor} placeholder={placeholder} spellCheck={false} autoFocus />;
};
