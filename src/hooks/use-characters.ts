import { useQuery } from '@tanstack/react-query';
import { loadAllCharactersWithDetails } from '../api/api';

export const useCharacters = () => {
  return useQuery({
    queryKey: ['characters'],
    queryFn: loadAllCharactersWithDetails,
  });
};