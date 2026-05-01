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
    bait?: string;
    isPostedToCommunity?: boolean;
}

const currentUserId = 'user-001';
const currentUserName = 'Thomas';

const myCatches: Catch[] = [
    {
        id: 'catch-001',
        fish: 'Largemouth Bass',
        weight: 4.8,
        length: 21,
        location: 'Lake Washington',
        date: '2026-04-28',
        desc: 'Caught near the reeds right before sunset. The jig bite finally turned on.',
        userId: currentUserId,
        userName: currentUserName,
        bait: 'Jig',
        isPostedToCommunity: true,
    },
    {
        id: 'catch-002',
        fish: 'Rainbow Trout',
        weight: 2.3,
        length: 16,
        location: 'Green Lake',
        date: '2026-04-22',
        desc: 'First cast after switching to a small spinner.',
        userId: currentUserId,
        userName: currentUserName,
        bait: 'Spinner',
        isPostedToCommunity: false,
    },
    {
        id: 'catch-003',
        fish: 'Smallmouth Bass',
        weight: 3.1,
        length: 18,
        location: 'Sammamish River',
        date: '2026-04-15',
        desc: 'Pulled from a rocky bank in clear water.',
        userId: currentUserId,
        userName: currentUserName,
        bait: 'Live worm',
        isPostedToCommunity: false,
    },
];

let communityCatches: Catch[] = [
    myCatches[0],
    {
        id: 'catch-101',
        fish: 'Coho Salmon',
        weight: 7.6,
        length: 27,
        location: 'Puget Sound',
        date: '2026-04-26',
        desc: 'Trolling along the drop-off paid off after a slow morning.',
        userId: 'user-002',
        userName: 'Joe',
        bait: 'Spoon',
        isPostedToCommunity: true,
    },
    {
        id: 'catch-102',
        fish: 'Channel Catfish',
        weight: 9.4,
        length: 30,
        location: 'Columbia River',
        date: '2026-04-20',
        desc: 'Night fishing from the dock with cut bait.',
        userId: 'user-003',
        userName: 'Bob',
        bait: 'Cut bait',
        isPostedToCommunity: true,
    },
];

type CatchesListener = () => void;
const listeners = new Set<CatchesListener>();

const notifyListeners = () => {
    listeners.forEach((listener) => listener());
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

    async getMyCatches(): Promise<Catch[]> {
        return [...myCatches];
    },

    /**
     * Fetches all catches posted to the community
     * Called by community.tsx to display cards
     */
    async getCommunityCatches(): Promise<Catch[]> {
        return [...communityCatches];
    },

    /**
     * Posts a catch to the community
     * Called by mycatches.tsx when user clicks "post to community"
     */
    async postCatchToCommunity(catchId: string): Promise<{ success: boolean; error?: string }> {
        const catchToPost = myCatches.find((catchData) => catchData.id === catchId);

        if (!catchToPost) {
            return {
                success: false,
                error: 'Catch not found',
            };
        }

        catchToPost.isPostedToCommunity = true;
        communityCatches = [
            { ...catchToPost, isPostedToCommunity: true },
            ...communityCatches.filter((catchData) => catchData.id !== catchId),
        ];
        notifyListeners();

        return { success: true };
    },
};
