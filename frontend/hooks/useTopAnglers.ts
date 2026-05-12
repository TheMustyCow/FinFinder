// Components/hooks/useTopAnglers.ts

import { useState } from 'react';

//used to define the results array type
type topAnglersResult = {
    username: string;
    count: number;
};

type UseTopAnglersReturn = {
    results: topAnglersResult[];
    loading: boolean;
    error: string | null;
    fetchTopAnglers: () => void;
};

export function useTopAnglers(): UseTopAnglersReturn {
    const [results, setResults] = useState<topAnglersResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopAnglers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/topAnglers`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: topAnglersResult[] = await response.json();
            setResults(data);
        } catch (err) {
            setError('Could not load top anglers data. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return {results, loading, error, fetchTopAnglers};
}