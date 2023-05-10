export type SnippetsState = {
    snippetHash?: string;
    snippet: string;
};

export const initialSnippetState: SnippetsState = {
    snippet: '',
};
