export type SnippetsState = {
    loading?: boolean;
    error?: Error;
    snippetHash?: string;
    snippet: string;
};

export const initialSnippetState: SnippetsState = {
    snippet: '',
};
