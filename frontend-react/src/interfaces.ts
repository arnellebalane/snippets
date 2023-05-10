export enum SnippetActions {
    SAVE = 'SAVE',
    SELECT_ALL = 'SELECT_ALL',
    EDIT_NEW = 'EDIT_NEW',
    DUPLICATE = 'DUPLICATE',
}

export type ShortcutDefinition = {
    key: string;
    label: string;
    action: SnippetActions;
    checkKey: (event: KeyboardEvent) => boolean;
};
