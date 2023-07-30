export const ctrlKey = (key: string) => {
    return (event: KeyboardEvent) => {
        return event.ctrlKey && event.key === key;
    };
};

export const selectElementContent = (element: HTMLElement) => {
    const range = document.createRange();
    range.selectNode(element);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
};

export const focusTextarea = (textarea: HTMLTextAreaElement) => {
    setTimeout(() => {
        const length = textarea.value.length;
        textarea.focus();
        textarea.setSelectionRange(length, length);
    }, 0);
};
