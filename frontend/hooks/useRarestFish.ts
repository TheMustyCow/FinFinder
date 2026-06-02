// Components/hooks/useRarestFish.ts

import { useState } from 'react';

//used to define the results array type
type RarestFishResult = {
    species: string;
    count: number;
};

type UseRarestFishReturn = {
    results: RarestFishResult[];
    loading: boolean;
    error: string | null;
    fetchRarestFish: () => void;
};

//This function returns all relevant state to the fishData page.
export function useRarestFish(): UseRarestFishReturn {
    const [results, setResults] = useState<RarestFishResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRarestFish = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                'https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/rarestFish'
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: RarestFishResult[] = await response.json();
            setResults(data);
        } catch (err) {
            setError('Could not load rarest fish data. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return {results, loading, error, fetchRarestFish};
}