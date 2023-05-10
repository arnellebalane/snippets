import { useEffect } from 'react';
import { SnippetActions } from '~/interfaces';
import { useShortcuts } from '~/utils/hooks';
import s from './Footer.module.css';

export type FooterProps = {
    onAction?: (action: SnippetActions) => void;
};

export const Footer = ({ onAction }: FooterProps) => {
    const shortcuts = useShortcuts();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            for (const { action, checkKey } of shortcuts) {
                if (checkKey(event)) {
                    onAction?.(action);
                }
            }
        };
        document.addEventListener('keydown', onKeyDown, { capture: true });

        return () => document.removeEventListener('keydown', onKeyDown, { capture: true });
    }, []);

    return (
        <footer className={s.footer}>
            <ul className={s.shortcuts}>
                {shortcuts.map(({ key, label }) => (
                    <li key={key} className={s.shortcut}>
                        <span>{key}</span>
                        {label}
                    </li>
                ))}
            </ul>
        </footer>
    );
};
