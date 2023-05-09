import s from './Footer.module.css';

type Shortcut = {
    key: string;
    label: string;
};

export const Footer = () => {
    const shortcuts: Shortcut[] = [
        { key: '^A', label: 'Select All' },
        { key: '^E', label: 'Edit New' },
        { key: '^D', label: 'Duplicate' },
        { key: '^R', label: 'Raw' },
    ];

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
