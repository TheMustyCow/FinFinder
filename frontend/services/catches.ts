import { authService } from './auth';

export interface Catch {
    id: string;
    fish: string;
    weight: number;
    length: number;
    location: string;
    latitude?: number;
    longitude?: number;
    date: string;
    desc: string;
    userId: string;
    userName?: string;
    bait?: string;
    isPostedToCommunity?: boolean;
}

export interface CreateCatchInput {
    fish: string;
    weight: number;
    length: number;
    location: string;
    latitude?: number;
    longitude?: number;
    desc: string;
    bait?: string;
}

const API_BASE_URL = 'https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com';

type CatchesListener = () => void;
const listeners = new Set<CatchesListener>();
let myCatchesCache: Catch[] | null = null;
let communityCatchesCache: Catch[] | null = null;
let cacheUserId: string | null = null;

const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

const getHeaders = async () => {
    const currentUser = await authService.getCurrentUser();

    if (cacheUserId && cacheUserId !== currentUser.userId) {
        myCatchesCache = null;
        communityCatchesCache = null;
    }

    cacheUserId = currentUser.userId;

    return {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json',
        'X-User-Id': currentUser.userId,
        'X-User-Name': currentUser.userName,
    };
};

const parseResponse = async <T>(response: Response): Promise<T> => {
    const body = await response.json().catch(() => null);

    if (!response.ok) {
        const message = body?.error ?? 'Request failed';
        throw new Error(message);
    }

    return body as T;
};

const upsertCatch = (catches: Catch[], catchData: Catch): Catch[] => {
    const existingIndex = catches.findIndex((item) => item.id === catchData.id);

    if (existingIndex === -1) {
        return [catchData, ...catches];
    }

    return catches.map((item) => (item.id === catchData.id ? catchData : item));
};

/**
 * Mediator service that handles sharing catches from mycatches.tsx to community.tsx
 */
export const catchesService = {
    subscribe(listener: CatchesListener): () => void {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },

    clearCache(): void {
        myCatchesCache = null;
        communityCatchesCache = null;
        cacheUserId = null;
    },

    async getMyCatches(forceRefresh = false): Promise<Catch[]> {
        const headers = await getHeaders();

        if (myCatchesCache && !forceRefresh) {
            return [...myCatchesCache];
        }

        const response = await fetch(`${API_BASE_URL}/catches/mine`, {
            headers,
        });

        myCatchesCache = await parseResponse<Catch[]>(response);

        return [...myCatchesCache];
    },

    /**
     * Creates a catch in the user's personal log.
     */
    async createCatch(input: CreateCatchInput): Promise<Catch> {
        const response = await fetch(`${API_BASE_URL}/catches`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(input),
        });

        const newCatch = await parseResponse<Catch>(response);
        myCatchesCache = upsertCatch(myCatchesCache ?? [], newCatch);

        if (newCatch.isPostedToCommunity) {
            communityCatchesCache = upsertCatch(communityCatchesCache ?? [], newCatch);
        }

        notifyListeners();

        return newCatch;
    },

    /**
     * Fetches all catches posted to the community
     * Called by community.tsx to display cards
     */
    async getCommunityCatches(forceRefresh = false): Promise<Catch[]> {
        const headers = await getHeaders();

        if (communityCatchesCache && !forceRefresh) {
            return [...communityCatchesCache];
        }

        const response = await fetch(`${API_BASE_URL}/catches/community`, {
            headers,
        });

        communityCatchesCache = await parseResponse<Catch[]>(response);

        return [...communityCatchesCache];
    },

    /**
     * Posts a catch to the community
     * Called by mycatches.tsx when user clicks "post to community"
     */
    async postCatchToCommunity(catchId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/catches/${catchId}/community`, {
                method: 'POST',
                headers: await getHeaders(),
            });

            const updatedCatch = await parseResponse<Catch>(response);

            if (myCatchesCache) {
                myCatchesCache = upsertCatch(myCatchesCache, updatedCatch);
            }

            if (updatedCatch.isPostedToCommunity) {
                communityCatchesCache = upsertCatch(communityCatchesCache ?? [], updatedCatch);
            }

            notifyListeners();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unable to share catch',
            };
        }
    },

    async deleteCatch(catchId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/catches/${catchId}`, {
                method: 'DELETE',
                headers: await getHeaders(),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                return {
                    success: false,
                    error: body?.error ?? 'Unable to delete catch',
                };
            }

            if (myCatchesCache) {
                myCatchesCache = myCatchesCache.filter((item) => item.id !== catchId);
            }

            if (communityCatchesCache) {
                communityCatchesCache = communityCatchesCache.filter((item) => item.id !== catchId);
            }

            notifyListeners();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unable to delete catch',
            };
        }
    },
};
