import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleAction } from '~/utils/hooks';
import { useGetSnippet, useLoadingStatus, useSetSnippetHash, useSnippet } from '~/store/hooks';
import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
import { SnippetPreview } from '~/components/SnippetPreview/SnippetPreview';
import s from './ViewSnippet.module.css';

export const ViewSnippet = () => {
    const { hash } = useParams();
    const preview = useRef<HTMLDivElement>(null);
    const snippet = useSnippet();
    const setSnippetHash = useSetSnippetHash();
    const getSnippet = useGetSnippet();
    const { isComplete, hasError } = useLoadingStatus();
    const handleAction = useHandleAction({ preview });

    useEffect(() => {
        if (hash) {
            setSnippetHash(hash);
            getSnippet(hash);
        }
    }, [hash, setSnippetHash, getSnippet]);

    return (
        <main className={s.main}>
            <Header />
            <SnippetPreview ref={preview} value={snippet} />
            {isComplete && !hasError && <Footer onAction={handleAction} />}
        </main>
    );
};
