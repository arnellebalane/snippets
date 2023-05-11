import { useEffect } from 'react';
import { useHandleAction } from '~/utils/hooks';
import { useLoadingStatus, useSetSnippet, useSnippet } from '~/store/hooks';
import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
import { SnippetEditor } from '~/components/SnippetEditor/SnippetEditor';
import s from './CreateSnippet.module.css';

export const CreateSnippet = () => {
    const snippet = useSnippet();
    const setSnippet = useSetSnippet();
    const handleAction = useHandleAction();
    const { hasCalled, isComplete } = useLoadingStatus();

    useEffect(() => {
        if (isComplete) {
            console.log('saved!');
        }
    }, [isComplete]);

    return (
        <main className={s.main}>
            <Header />
            <SnippetEditor value={snippet} onChange={setSnippet} disabled={hasCalled} />
            <Footer onAction={handleAction} />
        </main>
    );
};
