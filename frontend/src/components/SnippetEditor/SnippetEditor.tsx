import { useEffect, useRef } from 'react';
import s from './SnippetEditor.module.css';
import { focusTextarea } from '~/utils/helpers';

export type SnippetEditorProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export const SnippetEditor = ({ value, onChange, disabled }: SnippetEditorProps) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const placeholder = `console.log('hello world');`;

    useEffect(() => {
        if (ref.current) {
            focusTextarea(ref.current);
        }
    }, [ref, value]);

    return (
        <textarea
            className={s.editor}
            ref={ref}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            spellCheck={false}
            data-testid="editor"
            autoFocus
        />
    );
};
