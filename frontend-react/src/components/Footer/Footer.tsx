import s from './Footer.module.css';

type Shortcut = {
    key: string;
    label: string;
};

export const Footer = () => {
    const shortcuts: Shortcut[] = [{ key: '^S', label: 'Save' }];

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
