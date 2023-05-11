import { useEffect } from 'react';
import { useHandleAction } from '~/utils/hooks';
import { useLoadingStatus, useSetSnippet, useSnippet, useSnippetHash } from '~/store/hooks';
import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
import { SnippetEditor } from '~/components/SnippetEditor/SnippetEditor';
import s from './CreateSnippet.module.css';
import { useNavigate } from 'react-router-dom';

export const CreateSnippet = () => {
    const navigate = useNavigate();
    const snippet = useSnippet();
    const setSnippet = useSetSnippet();
    const snippetHash = useSnippetHash();
    const handleAction = useHandleAction();
    const { hasCalled, isComplete } = useLoadingStatus();

    useEffect(() => {
        if (isComplete) {
            navigate(`/${snippetHash}`);
        }
    }, [isComplete, snippetHash, navigate]);

    return (
        <main className={s.main}>
            <Header />
            <SnippetEditor value={snippet} onChange={setSnippet} disabled={hasCalled} />
            <Footer onAction={handleAction} />
        </main>
    );
};
