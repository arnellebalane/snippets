import s from './SnippetPreview.module.css';

export type SnippetPreviewProps = {
    value: string;
};

export const SnippetPreview = ({ value }: SnippetPreviewProps) => {
    return (
        <div className={s.preview}>
            <pre>
                <code>{value}</code>
            </pre>
        </div>
    );
};
