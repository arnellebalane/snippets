import s from './Header.module.css';

export const Header = () => {
    const { hostname } = window.location;

    return (
        <header className={s.header}>
            <h1 className={s.title}>{hostname}</h1>
        </header>
    );
};
