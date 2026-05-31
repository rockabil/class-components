import { useQuery } from '@tanstack/react-query';
import { fetchCharacterDetails } from '../api/api';

export const useCharacterDetails = (characterId: string | null) => {
  return useQuery({
    queryKey: ['character', characterId],
    queryFn: () => fetchCharacterDetails(characterId!),
    enabled: !!characterId,
  });
};