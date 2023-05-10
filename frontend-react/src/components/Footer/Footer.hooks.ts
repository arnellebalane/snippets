import { ShortcutDefinition, SnippetActions } from '~/interfaces';
import { useSnippetHash } from '~/store/hooks';

export const useShortcuts = (): ShortcutDefinition[] => {
    const snippetHash = useSnippetHash();

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
};
