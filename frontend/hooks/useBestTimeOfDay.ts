// Components/hooks/useBestTimeOfDay.ts

import { useState } from 'react';

//used to define the results array type
type timeOfDayResults = {
    timeOfDay: string;
    count: number;
};

type UseBestTimeOfDayReturn = {
    results: timeOfDayResults[];
    loading: boolean;
    error: string | null;
    fetchBestTimeOfDay: (species: string) => void;
};

export function useBestTimeOfDay(): UseBestTimeOfDayReturn {
    const [results, setResults] = useState<timeOfDayResults[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBestTimeOfDay = async (species: string) => {
        if (!species) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/bestTime?FishSpecies=${encodeURIComponent(species)}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: timeOfDayResults[] = await response.json();
            setResults(data);
        } catch (err) {
            setError('Could not load best time data data. Try again.');
        } finally {
            setLoading(false);
        }
    };

    //while the rendering function implicitly creates slots for these state variables in its fibre node,
    //it is still necessary to pass references to those slots back to the rendering function so that data can
    //actually be retrieved or modified.
    return {results, loading, error, fetchBestTimeOfDay };
}