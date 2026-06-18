import type { SearchResult, StapiCharacter } from "../types/types";

const STAPI_BASE_URL = 'https://stapi.co/api/v1/rest';

export const searchCharacters = async (name: string, pageNumber = 0, pageSize = 50): Promise<StapiCharacter[]> => {
    const url = `${STAPI_BASE_URL}/character/search`;

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('pageNumber', pageNumber.toString());
    formData.append('pageSize', pageSize.toString());
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.characters || [];
};

export const fetchCharacterDetails = async (uid: string): Promise<StapiCharacter> => {
    const url = `${STAPI_BASE_URL}/character?uid=${uid}`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Character ${uid} not found in database`);
        }
        throw new Error(`Failed to fetch details for ${uid}`);
    }

    const data = await response.json();

    if (!data || !data.character) {
        throw new Error(`No detailed data available for ${uid}`);
    }

    return data.character;
};

export const generateDescription = (character: StapiCharacter): string => {
    const details: string[] = [];
    
    if (character.gender) {
        const genderText = character.gender === 'M' ? 'Male' : 
                          character.gender === 'F' ? 'Female' : 
                          character.gender;
        details.push(`Gender: ${genderText}`);
    }
    
    if (character.deceased === true) {
        details.push('Deceased');
    }
    
    if (character.hologram === true) {
        details.push('Hologram');
    }
    
    if (character.fictionalCharacter === true) {
        details.push('Fictional character');
    }

    if (character.bio) {
        const shortBio = character.bio.length > 100 
            ? character.bio.slice(0, 100) + '...' 
            : character.bio;
        details.push(shortBio);
    }    
        
    if (details.length === 0) {
        return 'No additional information available';
    }
    
    return details.join(' • ');
};

export const loadAllCharactersWithDetails = async (): Promise<SearchResult[]> => {
    const characters = await searchCharacters('', 0, 500);

    if (!characters.length) {
        throw new Error('No characters found');
    }

    const results = await Promise.allSettled(
        characters.map(async (char) => {
            try {
                const details = await fetchCharacterDetails(char.uid);
                return {
                    id: details.uid,
                    name: details.name,
                    description: generateDescription(details),
                    gender: details.gender,
                    deceased: details.deceased,
                    hologram: details.hologram,
                    fictionalCharacter: details.fictionalCharacter,
                    species: details.species?.name,
                    organizations: details.organizations?.map((org: { name: string }) => org.name),
                } as SearchResult;
            } catch {
                return {
                    id: char.uid,
                    name: char.name,
                    description: 'Detailed information not available',
                    gender: char.gender,
                    deceased: char.deceased,
                    hologram: char.hologram,
                } as SearchResult;
            }
        })
    );
    
    return results
        .filter((result): result is PromiseFulfilledResult<SearchResult> => result.status === 'fulfilled')
        .map(result => result.value);
};