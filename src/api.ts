import type { SearchResult, StapiCharacter, StapiSearchResponse } from "./types/types";

const STAPI_BASE_URL = 'https://stapi.co/api/v1/rest';

const generateDescription = (character: StapiCharacter): string => {
    const details: string[] = [];
    
    if (character.gender) {
        details.push(`Gender: ${character.gender === 'M' ? 'Male' : character.gender === 'F' ? 'Female' : character.gender}`);
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
    
    if (character.species?.name) {
        details.push(`Species: ${character.species.name}`);
    }
    
    if (character.organizations?.length) {
        const orgNames = character.organizations.slice(0, 2).map(org => org.name).join(', ');
        details.push(`Organizations: ${orgNames}${character.organizations.length > 2 ? '...' : ''}`);
    }
    
    if (details.length === 0) {
        return 'No additional information available';
    }
    
    return details.join(' • ');
};

export const searchAPI = async (
    query: string,
    pageNumber = 0,
    pageSize = 10
): Promise<SearchResult[]> => {
    const url = new URL(`${STAPI_BASE_URL}/character/search`);
    url.searchParams.append('name', query);
    url.searchParams.append('pageNumber', pageNumber.toString());
    url.searchParams.append('pageSize', pageSize.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const data: StapiSearchResponse = await response.json();

    if (!data.characters?.length) {
        throw new Error('Nothing found');
    }

    return data.characters.map((char: StapiCharacter) => ({
        id: char.uid,
        name: char.name,
        description: generateDescription(char),
        gender: char.gender,
         deceased: char.deceased,
        hologram: char.hologram,
        fictionalCharacter: char.fictionalCharacter,
        species: char.species?.name,
        organizations: char.organizations?.map(org => org.name),
    }));
};