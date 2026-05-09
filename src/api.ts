import type { SearchResult, StapiCharacter } from "./types/types";

const STAPI_BASE_URL = 'https://stapi.co/api/v1/rest';

const searchCharacters = async (name: string, pageNumber = 0, pageSize = 50): Promise<StapiCharacter[]> => {
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

const fetchCharacterDetails = async (uid: string): Promise<StapiCharacter> => {
    const url = `${STAPI_BASE_URL}/character/${uid}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch details for ${uid}`);
    }

    const data = await response.json();
    return data.character;
};

const generateDescription = (character: StapiCharacter): string => {
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
    const characters = await searchCharacters('q', 0, 100);

    if (!characters.length) {
        throw new Error ('No characters found');
    }

    const results: SearchResult[] = [];

    for (const char of characters) {
        try {
            const details = await fetchCharacterDetails(char.uid);

            results.push({
                id: details.uid,
                name: details.name,
                description: generateDescription(details),
                gender: details.gender,
                deceased: details.deceased,
                hologram: details.hologram,
                fictionalCharacter: details.fictionalCharacter,
                species: details.species?.name,
                organizations: details.organizations?.map(org => org.name),
            });
        } catch {
            results.push({
                id: char.uid,
                name: char.name,
                description: 'Information not available',
            });
        }
    }
    return results;
}
