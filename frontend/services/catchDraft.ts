export type CatchCoordinate = {
    latitude: number;
    longitude: number;
};

export type CatchDraft = {
    fish: string;
    location: string;
    weight: string;
    length: string;
    bait: string;
    notes: string;
    postToCommunity: boolean;
    coordinate: CatchCoordinate | null;
};

const emptyDraft: CatchDraft = {
    fish: '',
    location: '',
    weight: '',
    length: '',
    bait: '',
    notes: '',
    postToCommunity: false,
    coordinate: null,
};

type CatchDraftListener = () => void;

const listeners = new Set<CatchDraftListener>();
let draft: CatchDraft = { ...emptyDraft };
let selectingCoordinate = false;

const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

export const catchDraftService = {
    subscribe(listener: CatchDraftListener): () => void {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },

    getDraft(): CatchDraft {
        return {
            ...draft,
            coordinate: draft.coordinate ? { ...draft.coordinate } : null,
        };
    },

    saveDraft(nextDraft: CatchDraft): void {
        draft = {
            ...nextDraft,
            coordinate: nextDraft.coordinate ? { ...nextDraft.coordinate } : null,
        };
        notifyListeners();
    },

    clearDraft(): void {
        draft = { ...emptyDraft };
        selectingCoordinate = false;
        notifyListeners();
    },

    startCoordinateSelection(nextDraft: CatchDraft): void {
        draft = {
            ...nextDraft,
            coordinate: nextDraft.coordinate ? { ...nextDraft.coordinate } : null,
        };
        selectingCoordinate = true;
        notifyListeners();
    },

    completeCoordinateSelection(coordinate: CatchCoordinate): void {
        draft = {
            ...draft,
            coordinate: { ...coordinate },
        };
        selectingCoordinate = false;
        notifyListeners();
    },

    cancelCoordinateSelection(): void {
        selectingCoordinate = false;
        notifyListeners();
    },

    isSelectingCoordinate(): boolean {
        return selectingCoordinate;
    },
};
