import Link from 'next/link';
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles['not-found-container']}>
      <div className={styles['not-found-content']} role="alert">
        <div className={styles['not-found-icon']}>404</div>
        <h2>Page Not Found</h2>
         <p>The page you are looking for does not exist or has been moved.</p>
        <Link href="/">← Back to Home</Link>  
      </div>          
    </div>
  );
};