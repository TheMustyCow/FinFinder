export interface Catch {
    id: string;
    fish: string;
    weight: number;
    length: number;
    location: string;
    date: string;
    desc: string;
    userId: string;
    userName?: string;
}

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL

/**
 * Mediator service that handles sharing catches from mycatches.tsx to community.tsx
 */
export const catchesService = {
    /**
     * Fetches all catches posted to the community
     * Called by community.tsx to display cards
     */
    async getCommunityCatches(): Promise<Catch[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/catches/community`);
            if (!response.ok) {
                throw new Error('Failed to fetch community catches');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching community catches:', error);
            return [];
        }
    },

    /**
     * Posts a catch to the community
     * Called by mycatches.tsx when user clicks "post to community"
     */
    async postCatchToCommunity(catchData: Omit<Catch, 'id'>): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/catches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(catchData),
            });

            if (!response.ok) {
                throw new Error('Failed to post catch to community');
            }

            return { success: true };
        } catch (error) {
            console.error('Error posting catch to community:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    },
};
