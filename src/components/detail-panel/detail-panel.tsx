import { useCharacterDetails } from '../../hooks/use-character-details';
import { Loader } from '../loader';
import './module.css';

interface DetailPanelProps {
    characterId: string | null;
    onClose: () => void;
}

export const DetailPanel = ({ characterId, onClose }: DetailPanelProps) => {
    const { data: details, isLoading, error, refetch } = useCharacterDetails(characterId);    

    if (!characterId) return null;

    const errorMessage = error instanceof Error ? error.message : null;

    return (
        <div className="detail-panel">
            <button onClick={() => refetch()} className="refresh-details-button">
                Refresh Details
            </button>
            <div className="detail-panel-header">
                <h2>Character Details</h2>
                <button onClick={onClose} className="close-button" aria-label="Close">
                    ✕
                </button>
            </div>
            
            {isLoading && <Loader size={40} speed={0.8} thickness={2} />}
            
            {error && (
                <div className="detail-error">
                    <strong>Information Unavailable</strong>
                    <p>{errorMessage}</p>
                    <p className="detail-hint">
                        Some characters may not have detailed information in the database.
                    </p>
                </div>
            )}
            
            {details && ! isLoading && (
                <div className="detail-content">
                    <h3>{details.name}</h3>
                    <div>
                        <strong>Gender:</strong> {details.gender}
                    </div>
                    <div>
                        <strong>Species:</strong> {details.species}
                    </div>
                    <div>
                        <strong>Status:</strong> {details.status}
                    </div>
                    {details.organizations.length > 0 && (
                        <div>
                            <strong>Organizations:</strong> {details.organizations.join(', ')}
                        </div>
                    )}
                    <div>
                        <strong>Description:</strong> {details.description}
                    </div>
                </div>
            )}
        </div>
    );
};