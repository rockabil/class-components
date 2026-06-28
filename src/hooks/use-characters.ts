import { useQuery } from '@tanstack/react-query';
import { loadAllCharactersWithDetails } from '../api/api';
import type { SearchResult } from '@/types/types';

export const useCharacters = (initialData?: SearchResult[]) => {
  return useQuery({
    queryKey: ['characters'],
    queryFn: loadAllCharactersWithDetails,
    initialData,
  });
};