import { ForwardedRef, forwardRef } from 'react';
import Highlight from 'react-highlight';
import s from './SnippetPreview.module.css';
import 'highlight.js/styles/monokai-sublime.css';

export type SnippetPreviewProps = {
    value: string;
};

export const SnippetPreview = forwardRef(({ value }: SnippetPreviewProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={s.preview}>
            <Highlight className={s.highlight}>{value}</Highlight>
        </div>
    );
});
