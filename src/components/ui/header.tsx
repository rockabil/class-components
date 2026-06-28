'use client';
import { Link } from '@/i18n/navigation';
import { useTheme } from '../../hooks/use-theme';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { useTranslations } from 'next-intl';
import styles from './header.module.css';
export const Header = () => {
    const t = useTranslations('Header');
    const { theme, toggleTheme } = useTheme()
    return (
        <header className={styles["app-header"]}>
            <h1>{t('title')}</h1>
            <nav>
                <Link href="/">{t('home')}</Link>
                <Link href="/about-us">{t('about')}</Link>
                <button onClick={toggleTheme} className={styles["theme-toggle-button"]}>{theme === 'light' ? t('themeDark') : t('themeLight')}
                </button>
                <LanguageSwitcher/>
            </nav>
        </header>              
    );
};

