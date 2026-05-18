import { useEffect, useState } from 'react';
import { fetchCharacterDetails } from '../../api';
import { Loader } from '../loader';
import './module.css';

interface DetailPanelProps {
    characterId: string | null;
    onClose: () => void;
}

interface CharacterDetails {
    name: string;
    gender: string;
    species: string;
    status: string;
    organizations: string[];
    description: string;
    image?: string;
}

export const DetailPanel = ({ characterId, onClose }: DetailPanelProps) => {
    const [details, setDetails] = useState<CharacterDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDetails = async () => {
            if (!characterId) {
                setDetails(null);
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                const data = await fetchCharacterDetails(characterId);
                setDetails({
                    name: data.name,
                    gender: data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : data.gender || 'Unknown',
                    species: data.species?.name || 'Unknown',
                    status: data.deceased ? 'Deceased' : 'Alive',
                    organizations: data.organizations?.map(org => org.name) || [],
                    description: data.bio || 'No description available',
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load details');
            } finally {
                setLoading(false);
            }
        };

        loadDetails();       
    }, [characterId]);
    if (!characterId) return null;

    return (
        <div className="detail-panel">
            <div className="detail-panel-header">
                <h2>Character Details</h2>
                <button onClick={onClose} className="close-button" aria-label="Close details">
                    ✕
                </button>
            </div>
            
            {loading && <Loader size={40} speed={0.8} thickness={2} />}
            
            {error && (
                <div className="detail-error">
                    Error: {error}
                </div>
            )}
            
            {details && !loading && (
                <div className="detail-content">
                    <h3>{details.name}</h3>
                    
                    <div className="detail-field">
                        <strong>Gender:</strong> {details.gender}
                    </div>
                    
                    <div className="detail-field">
                        <strong>Species:</strong> {details.species}
                    </div>
                    
                    <div className="detail-field">
                        <strong>Status:</strong> 
                        <span className={`status-badge ${details.status === 'Alive' ? 'status-alive' : 'status-deceased'}`}>
                            {details.status}
                        </span>
                    </div>
                    
                    {details.organizations.length > 0 && (
                        <div className="detail-field">
                            <strong>Organizations:</strong>
                            <ul>
                                {details.organizations.map((org, idx) => (
                                    <li key={idx}>{org}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="detail-field">
                        <strong>Description:</strong>
                        <p>{details.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};