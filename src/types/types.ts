export interface SearchResult {
  id: string;
  name: string;
  description: string;
  gender?: string;
  deceased?: boolean;
  hologram?: boolean;
  fictionalCharacter?: boolean;
  species?: string;
  organizations?: string[];
}

export interface StapiCharacter {
  uid: string;
  name: string;
  gender?: string;
  deceased?: boolean;
  hologram?: boolean;
  fictionalCharacter?: boolean;
  species?: { uid: string; name: string };
  organizations?: Array<{ uid: string; name: string }>;
  bio?: string;
}

export interface StapiSearchResponse {
  characters: StapiCharacter[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?:number;
}