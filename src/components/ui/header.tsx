'use client';
import  Link from 'next/link';
import { useTheme } from '../../hooks/use-theme';
import styles from './header.module.css';
export const Header = () => {
    const { theme, toggleTheme } = useTheme()
    return (
        <header className={styles["app-header"]}>
            <h1>STAR TREK Heroes Search</h1>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/about-us">About Us</Link>
                <button onClick={toggleTheme} className={styles["theme-toggle-button"]}>{theme === 'light' ? 'dark' : 'light'} theme
                </button>
            </nav>
        </header>              
    );
};

