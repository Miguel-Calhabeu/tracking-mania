import { create } from 'zustand';

export type CapturedRequest = {
    id: string;
    timestamp: number;
    method: string;
    url: string;
    type: 'fetch' | 'xhr' | 'beacon' | 'image' | 'log' | 'custom';
    body?: unknown;
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

const serializeBody = (body: unknown) => {
    if (body === undefined || body === null) return '';
    try {
        return JSON.stringify(body);
    } catch (e) {
        return String(body);
    }
};

export const useStore = create<StoreState>((set) => ({
    capturedRequests: [],
    addRequest: (req) => set((state) => {
        const duplicate = state.capturedRequests.some((r) => {
            if (r.type !== req.type || r.method !== req.method || r.url !== req.url) return false;
            const bodyMatches = serializeBody(r.body) === serializeBody(req.body);
            const isRecent = Math.abs(req.timestamp - r.timestamp) < 1000;
            return bodyMatches && isRecent;
        });

        if (duplicate) {
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
