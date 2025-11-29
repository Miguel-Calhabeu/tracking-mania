import { create } from 'zustand';

export type CapturedRequest = {
    id: string;
    timestamp: number;
    method: string;
    url: string;
    type: 'fetch' | 'xhr' | 'beacon' | 'image' | 'log' | 'custom';
    body?: any;
    headers?: Record<string, string>;
};

interface StoreState {
    capturedRequests: CapturedRequest[];
    addRequest: (request: CapturedRequest) => void;
    clearRequests: () => void;
    gtmId: string | null;
    setGtmId: (id: string | null) => void;
    activeChallengeType: 'template' | 'custom' | null;
    setActiveChallengeType: (type: 'template' | 'custom' | null) => void;
    gtmStatus: 'idle' | 'loading' | 'active' | 'error';
    setGtmStatus: (status: 'idle' | 'loading' | 'active' | 'error') => void;
}

export const useStore = create<StoreState>((set) => ({
    capturedRequests: [],
    addRequest: (req) => set((state) => {
        if (state.capturedRequests.some(r => r.id === req.id)) {
            return state;
        }
        return { capturedRequests: [req, ...state.capturedRequests] };
    }),
    clearRequests: () => set({ capturedRequests: [] }),
    gtmId: null,
    setGtmId: (id) => set({ gtmId: id }),
    activeChallengeType: null,
    setActiveChallengeType: (type) => set({ activeChallengeType: type }),
    gtmStatus: 'idle',
    setGtmStatus: (status) => set({ gtmStatus: status }),
}));
