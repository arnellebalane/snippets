import Highlight from 'react-highlight';
import s from './SnippetPreview.module.css';
import 'highlight.js/styles/monokai-sublime.css';

export type SnippetPreviewProps = {
    value: string;
};

export const SnippetPreview = ({ value }: SnippetPreviewProps) => {
    return (
        <div className={s.preview}>
            <Highlight className={s.highlight}>{value}</Highlight>
        </div>
    );
};
