import { useEffect, useState } from 'react';
import { fetchCharacterDetails } from '../../api';
import type { StapiCharacter } from '../../types/types';
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
}

export const DetailPanel = ({ characterId, onClose }: DetailPanelProps) => {
    const [details, setDetails] = useState<CharacterDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!characterId) {        
            return;
        }

        const loadDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data: StapiCharacter = await fetchCharacterDetails(characterId);

                if (!data || !data.name) {
                    throw new Error('No detailed information available for this character');
                }

                setDetails({
                    name: data.name,
                    gender: data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : 'Unknown',
                    species: data.species?.name || 'Unknown',
                    status: data.deceased ? 'Deceased' : 'Alive',
                    organizations: data.organizations?.map((org) => org.name) || [],
                    description: data.bio || 'No description available for this character',
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load details');
                setDetails(null);
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
                <button onClick={onClose} className="close-button" aria-label="Close">
                    ✕
                </button>
            </div>
            
            {loading && <Loader size={40} speed={0.8} thickness={2} />}
            
            {error && (
                <div className="detail-error">
                    <strong>Information Unavailable</strong>
                    <p>{error}</p>
                    <p className="detail-hint">
                        Some characters may not have detailed information in the database.
                    </p>
                </div>
            )}
            
            {details && !loading && (
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