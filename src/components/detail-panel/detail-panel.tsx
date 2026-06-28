'use client'
import { useCharacterDetails } from '../../hooks/use-character-details';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from '../loader';
import { useTranslations } from 'next-intl';
import './module.css';

interface DetailPanelProps {
    characterId: string | null;
    onClose: () => void;
}

export default function DetailPanel ({ characterId, onClose }: DetailPanelProps) {
    const t = useTranslations('DetailPanel');
    const queryClient = useQueryClient();
    
    const { data: details, isLoading, isFetching, error } = useCharacterDetails(characterId);  

    if (!characterId) return null;

    const errorMessage = error instanceof Error ? error.message : null;
    const showLoader = isLoading || isFetching;

    

    const handleRefreshDetails = () => {
        if (characterId) {
            queryClient.invalidateQueries({ queryKey: ['character', characterId] });
        }
    };

    return (
        <div className="detail-panel">            
            <div className="detail-panel-header">
                <div className='detail-panel-block'>
                    <h2>{t('title')}</h2>
                    <button onClick={handleRefreshDetails} className="refresh-details-button">
                       {t('refreshing')}
                    </button>
                </div>
                <button onClick={onClose} className="close-button" aria-label="Close">
                    ✕
                </button>
            </div>
            
            {showLoader && <Loader size={40} speed={0.8} thickness={2} />}
            
            {error && (
                <div className="detail-error">
                    <strong>{t('informationWarning')}</strong>
                    <p>{errorMessage}</p>
                    <p className="detail-hint">
                        {t('informationWarningExplanation')}
                    </p>
                </div>
            )}
            
            {details && ! showLoader && (
                <div className="detail-content">
                    <h3>{details.name}</h3>
                    <div>
                        <strong>{t('gender')}</strong> {details.gender}
                    </div>
                    <div>
                        <strong>{t('species')}</strong> {details.species}
                    </div>
                    <div>
                        <strong>{t('status')}</strong> {details.status}
                    </div>
                    {details.organizations && details.organizations.length > 0 && (
                        <div>
                            <strong>{t('organizations')}</strong> {details.organizations.join(', ')}
                        </div>
                    )}
                    <div>
                        <strong>{t('description')}</strong> {details.description}
                    </div>
                </div>
            )}
        </div>
    );
};