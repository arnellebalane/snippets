import { SnippetActions } from '../../interfaces';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import { SnippetEditor } from 'components/SnippetEditor/SnippetEditor';
import s from './CreateSnippet.module.css';

export const CreateSnippet = () => {
    const onAction = (action: SnippetActions) => {
        console.log({ action });
    };

    return (
        <main className={s.main}>
            <Header />
            <SnippetEditor />
            <Footer onAction={onAction} />
        </main>
    );
};
