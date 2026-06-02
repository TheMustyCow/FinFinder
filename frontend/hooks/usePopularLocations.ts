// Components/hooks/usePopularLocations.ts

import { useState } from 'react';

//used to define the results array type
type LocationResult = {
    location: string;
    count: number;
};

type UsePopularLocationsReturn = {
    species: string;
    setSpecies: (s: string) => void;
    results: LocationResult[];
    loading: boolean;
    error: string | null;
    fetchPopularLocations: (species: string) => void;
};

export function usePopularLocations(): UsePopularLocationsReturn {
    const [species, setSpecies] = useState<string>('');
    const [results, setResults] = useState<LocationResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPopularLocations = async (species: string) => {
        if (!species) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/topLocations?FishSpecies=${encodeURIComponent(species)}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: LocationResult[] = await response.json();
            setResults(data);
        } catch (err) {
            setError('Could not load location data. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return { species, setSpecies, results, loading, error, fetchPopularLocations };
}