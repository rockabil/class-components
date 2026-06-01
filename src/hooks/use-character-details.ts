import { useQuery } from '@tanstack/react-query';
import { fetchCharacterDetails } from '../api/api';
import type { StapiCharacter } from '../types/types';

export interface CharacterDetails {
    name: string;
    gender: string;
    species: string;
    status: string;
    organizations: string[];
    description: string;
}

const transformToCharacterDetails = (character: StapiCharacter): CharacterDetails => {
    return {
        name: character.name,
        gender: character.gender === 'M' ? 'Male' : character.gender === 'F' ? 'Female' : 'Unknown',
        species: character.species?.name || 'Unknown',
        status: character.deceased ? 'Deceased' : 'Alive',
        organizations: character.organizations?.map(org => org.name) || [],
        description: character.bio || 'No description available',
    };
};

export const useCharacterDetails = (characterId: string | null) => {
    return useQuery({
        queryKey: ['character', characterId],
        queryFn: async () => {
            if (!characterId) throw new Error('No character ID provided');
            const data = await fetchCharacterDetails(characterId);
            return transformToCharacterDetails(data);
        },
        enabled: !!characterId,
    });
};