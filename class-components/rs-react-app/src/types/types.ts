export interface SearchResult {
  id: string;
  name: string;
  description: string;
}

export interface StapiCharacter {
  uid: string;
  name: string;
}

export interface StapiSearchResponse {
  characters: StapiCharacter[];
  page: number;
  pageSize: number;
  total: number;
  totalPages:number;
}