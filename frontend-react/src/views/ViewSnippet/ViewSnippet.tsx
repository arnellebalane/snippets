import { useHandleAction } from '~/utils/hooks';
import { useSnippet } from '~/store/hooks';
import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
import s from './ViewSnippet.module.css';
import { SnippetPreview } from '~/components/SnippetPreview/SnippetPreview';

export const ViewSnippet = () => {
    const snippet = useSnippet();
    const handleAction = useHandleAction();

    return (
        <main className={s.main}>
            <Header />
            <SnippetPreview value={snippet} />
            <Footer onAction={handleAction} />
        </main>
    );
};
