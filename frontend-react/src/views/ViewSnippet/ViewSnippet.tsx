import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHandleAction } from '~/utils/hooks';
import { useGetSnippet, useSetSnippet, useSnippet } from '~/store/hooks';
import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';
import { SnippetPreview } from '~/components/SnippetPreview/SnippetPreview';
import s from './ViewSnippet.module.css';

export const ViewSnippet = () => {
    const { hash } = useParams();
    const snippet = useSnippet();
    const setSnippetHash = useSetSnippet();
    const getSnippet = useGetSnippet();
    const handleAction = useHandleAction();

    useEffect(() => {
        if (hash) {
            setSnippetHash(hash);
            getSnippet(hash);
        }
    }, [hash, getSnippet]);

    return (
        <main className={s.main}>
            <Header />
            <SnippetPreview value={snippet} />
            <Footer onAction={handleAction} />
        </main>
    );
};
