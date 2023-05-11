import s from './SnippetEditor.module.css';

export type SnippetEditorProps = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export const SnippetEditor = ({ value, onChange, disabled }: SnippetEditorProps) => {
    const placeholder = `console.log('hello world');`;

    return (
        <textarea
            className={s.editor}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            spellCheck={false}
            autoFocus
        />
    );
};
