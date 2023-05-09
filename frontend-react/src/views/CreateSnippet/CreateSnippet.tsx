import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import { SnippetEditor } from 'components/SnippetEditor/SnippetEditor';
import s from './CreateSnippet.module.css';

export const CreateSnippet = () => {
    return (
        <main className={s.main}>
            <Header />
            <SnippetEditor />
            <Footer />
        </main>
    );
};
