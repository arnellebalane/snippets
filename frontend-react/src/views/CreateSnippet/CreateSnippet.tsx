import { useHandleAction } from '~/utils/hooks';
import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
import { SnippetEditor } from '~/components/SnippetEditor/SnippetEditor';
import s from './CreateSnippet.module.css';

export const CreateSnippet = () => {
    const handleAction = useHandleAction();

    return (
        <main className={s.main}>
            <Header />
            <SnippetEditor />
            <Footer onAction={handleAction} />
        </main>
    );
};
