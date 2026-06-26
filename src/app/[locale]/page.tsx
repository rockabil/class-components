import { getTranslations } from 'next-intl/server';
import SearchView from '@/components/search-view/search-view';
import { loadAllCharactersWithDetails } from '@/api/api';

export default async function HomePage() {
    const t = await getTranslations('HomePage');
    const initialData = await loadAllCharactersWithDetails();
    return <SearchView initialData={initialData} />;
} 