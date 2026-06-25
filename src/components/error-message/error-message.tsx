import { getTranslations } from 'next-intl/server';
interface ErrorMessageProps {
    message: string;
}

export default async function ErrorMessage({message}: ErrorMessageProps) {
   const t = await getTranslations('ErrorMessage');
    return (
            <div className="error-message" role="alert">
                <strong>{t('error')}:</strong> {message}
            </div>
        );
}