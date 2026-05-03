import type { SearchResult, StapiSearchResponse } from "./types/types";

const STAPI_BASE_URL = 'https://stapi.co/api/v1/rest';

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

    return data.characters.map((char) => ({
        id: char.uid,
        name: char.name,
        description: char.name,
    }));
};