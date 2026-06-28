'use client';
import { useRouter, usePathname } from '@/i18n/navigation';
import styles from './language-switcher.module.css';
import { useLocale } from 'next-intl';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className={styles['language-switcher']}>
      <button
        onClick={() => switchLanguage('en')}
        className={locale === 'en' ? styles.active : ''}
        disabled={locale === 'en'}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('ru')}
        className={locale === 'ru' ? styles.active : ''}
        disabled={locale === 'ru'}
      >
        Russian
      </button>
    </div>
  );
};