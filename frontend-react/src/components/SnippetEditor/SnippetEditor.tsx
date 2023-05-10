import { useSetSnippet, useSnippet } from 'store/hooks';
import s from './SnippetEditor.module.css';

export const SnippetEditor = () => {
    const snippet = useSnippet();
    const setSnippet = useSetSnippet();
    const placeholder = `console.log('hello world');`;

    return (
        <textarea
            className={s.editor}
            value={snippet}
            onChange={(event) => setSnippet(event.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            autoFocus
        />
    );
};
