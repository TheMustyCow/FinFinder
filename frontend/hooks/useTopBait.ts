import { useState } from 'react';

//shape of result from backend query
type BaitResult = {
    bait: string
    count: number;
}


//shape of data returned by useTopBaits to its caller
type UseTopBaitReturn = {
    species: string;
    setSpecies: (species: string) => void;
    results: BaitResult[];
    loading: boolean;
    error: string | null;
    fetchTopBait: (species: string) => void;
}

export function useTopBait(): UseTopBaitReturn {
    const [species, setSpecies] = useState<string>('');
    const [results, setResults] = useState<BaitResult[]>([]);//array consisting of objects of type BaitResult
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTopBait = async (species: string) => {
        if(!species) return;

        setLoading(true);//set loading to true because fetch about to be performed
        setError(null); //set to null in case fetch is unsuccessful

        try{
            //encodeURIComponent fills in blank and other special characters in the input string so they don't
            //disrupt the URL address structure. For example, blank spaces will be replaced with %.
            const response = await fetch(`https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com/top-bait?FishSpecies=${encodeURIComponent(species)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: BaitResult[] = await response.json();
            setResults(data);
        } catch (err) {
            setError('could not load bait data try again.');
        } finally {
            setLoading(false);
        }
    };

    return { species, setSpecies, results, loading, error, fetchTopBait};
}