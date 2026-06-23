import styles from './about.module.css';
import { getTranslations } from 'next-intl/server';


export default async function AboutPage() {
    const t = await getTranslations('AboutPage');
    return (
        <div className={styles['about-us-page']}>
            <div className={styles['about-us-container']}>
                <section className={styles['about-hero']}>
                    <h1>{t('title')}</h1>
                    <p className={styles['about-tagline']}>
                       {t('tagline')}
                    </p>
                </section>

                <section className={styles['about-description']}>
                    <h2>{t('aboutApp')}</h2>
                    <p>
                        {t('aboutAppText1')}
                    </p>
                    <p>
                        {t('aboutAppText2')}
                    </p>
                </section>

                <section className={styles['about-author']}>
                    <h2>{t('aboutAuthor')}</h2>
                    <div className={styles['author-info']}>
                        <div className={styles['author-details']}>
                            <h3>{t('developer')}</h3>
                            <p>
                                {t('developerDesc')}
                            </p>
                            <ul>
                                <li>{t('techReact')}</li>
                                <li>{t('techHoks')}</li>
                                <li>{t('techRooter')}</li>
                                <li>{t('techPagination')}</li>
                                <li>{t('techStorage')}</li>
                                <li>{t('techTesting')}</li>
                            </ul>
                            <div className={styles['author-links']}>
                                <a 
                                    href="https://github.com/rockabil" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles['author-link']}
                                >
                                    {t('githubProfile')}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles['about-rs-school']}>
                    <h2>{t('rsSchool')}</h2>
                    <div className={styles['rs-school-content']}>
                        <p>
                            {t('rsSchoolDesc1')}
                        </p>
                        <p>
                            {t('rsSchoolDesc2')}
                        </p>
                        <a 
                            href="https://rs.school/courses/reactjs" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles['rs-school-button']}
                        >
                           {t('learnMore')}
                            <span className={styles['button-arrow']}>→</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};