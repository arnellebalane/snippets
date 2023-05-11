import { RefObject, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShortcutDefinition, SnippetActions } from '~/interfaces';
import { useClearSnippet, useClearSnippetHash, useSaveSnippet, useSnippet, useSnippetHash } from '~/store/hooks';

export const useShortcuts = (): ShortcutDefinition[] => {
    const snippetHash = useSnippetHash();

    return useMemo(() => {
        if (snippetHash) {
            return [
                {
                    key: '^A',
                    label: 'Select All',
                    action: SnippetActions.SELECT_ALL,
                    checkKey: (event) => event.ctrlKey && event.key === 'a',
                },
                {
                    key: '^E',
                    label: 'Edit New',
                    action: SnippetActions.EDIT_NEW,
                    checkKey: (event) => event.ctrlKey && event.key === 'e',
                },
                {
                    key: '^D',
                    label: 'Duplicate',
                    action: SnippetActions.DUPLICATE,
                    checkKey: (event) => event.ctrlKey && event.key === 'd',
                },
            ];
        }

        return [
            {
                key: '^S',
                label: 'Save',
                action: SnippetActions.SAVE,
                checkKey: (event) => event.ctrlKey && event.key === 's',
            },
        ];
    }, [snippetHash]);
};

export type UseHandleActionProps = {
    preview?: RefObject<HTMLDivElement>;
};

export const useHandleAction = ({ preview }: UseHandleActionProps = {}) => {
    const navigate = useNavigate();
    const snippet = useSnippet();
    const saveSnippet = useSaveSnippet();
    const clearSnippet = useClearSnippet();
    const clearSnippetHash = useClearSnippetHash();

    return (action: SnippetActions) => {
        type HandlersType = Record<SnippetActions, () => void>;

        const handlers: HandlersType = {
            [SnippetActions.SAVE]: () => {
                if (!snippet) return;
                saveSnippet();
            },

            [SnippetActions.SELECT_ALL]: () => {
                if (!preview?.current) return;

                const range = document.createRange();
                range.selectNode(preview.current);

                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
            },

            [SnippetActions.EDIT_NEW]: () => {
                clearSnippet();
                clearSnippetHash();
                navigate('/');
            },

            [SnippetActions.DUPLICATE]: () => {
                clearSnippetHash();
                navigate('/');
            },
        };

        handlers[action]();
    };
};
