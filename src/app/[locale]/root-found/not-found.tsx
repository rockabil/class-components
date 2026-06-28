import { Link } from '@/i18n/navigation';
import styles from './not-found.module.css';
import { getTranslations } from 'next-intl/server';


export default async function NotFound() {
  const t = await getTranslations('NoteFound');
  return (
    <div className={styles['not-found-container']}>
      <div className={styles['not-found-content']} role="alert">
        <div className={styles['not-found-icon']}>404</div>
        <h2>{t('title')}</h2>
         <p>{t('warning')}</p>
        <Link href="/">{t('linkToHome')}</Link>  
      </div>          
    </div>
  );
};