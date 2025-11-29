import { useEffect, useRef } from 'react';
import { useStore, CapturedRequest } from '@/store/useStore';

declare global {
    interface Window {
        __NETWORK_SPY_PATCHED__?: boolean;
    }
}

export const useNetworkSpy = () => {
    const addRequest = useStore((state) => state.addRequest);
    const setGtmStatus = useStore((state) => state.setGtmStatus);

    // Use refs to access latest store functions
    const addRequestRef = useRef(addRequest);
    const setGtmStatusRef = useRef(setGtmStatus);

    // Keep refs up to date
    useEffect(() => {
        addRequestRef.current = addRequest;
        setGtmStatusRef.current = setGtmStatus;
    }, [addRequest, setGtmStatus]);

    // Single initialization - runs once globally
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.__NETWORK_SPY_PATCHED__) return;

        window.__NETWORK_SPY_PATCHED__ = true;

        const originalFetch = window.fetch;
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        const originalSendBeacon = navigator.sendBeacon;
        const originalImageSrcDescriptor = Object.getOwnPropertyDescriptor(Image.prototype, 'src');

        // --- Monkey Patch: fetch ---
        window.fetch = async (...args) => {
            const [resource, config] = args;
            const url = resource.toString();

            if (shouldCapture(url)) {
                addRequestRef.current({
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    method: config?.method || 'GET',
                    url: url,
                    type: 'fetch',
                    body: config?.body,
                    headers: config?.headers as any,
                });
            }

            return originalFetch.apply(window, args);
        };

        // --- Monkey Patch: XMLHttpRequest ---
        XMLHttpRequest.prototype.open = function (
            method: string,
            url: string | URL,
            async: boolean = true,
            username?: string | null,
            password?: string | null
        ) {
            // @ts-ignore
            this._spyData = { method, url: url.toString() };
            return originalOpen.apply(this, [method, url, async, username, password]);
        };

        XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
            // @ts-ignore
            const { method, url } = this._spyData || {};

            if (url && shouldCapture(url)) {
                addRequestRef.current({
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    method: method || 'GET',
                    url: url,
                    type: 'xhr',
                    body: body,
                });
            }

            return originalSend.apply(this, [body]);
        };

        // --- Monkey Patch: navigator.sendBeacon ---
        navigator.sendBeacon = (url: string | URL, data?: BodyInit | null) => {
            const urlStr = url.toString();
            if (shouldCapture(urlStr)) {
                addRequestRef.current({
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    method: 'POST',
                    url: urlStr,
                    type: 'beacon',
                    body: data,
                });
            }
            return originalSendBeacon.apply(navigator, [url, data]);
        };

        // --- Monkey Patch: Image (Pixel Tracking) ---
        if (originalImageSrcDescriptor && originalImageSrcDescriptor.set) {
            Object.defineProperty(Image.prototype, 'src', {
                ...originalImageSrcDescriptor,
                set: function (value) {
                    const url = value.toString();
                    if (shouldCapture(url)) {
                        addRequestRef.current({
                            id: crypto.randomUUID(),
                            timestamp: Date.now(),
                            method: 'GET',
                            url: url,
                            type: 'image',
                        });
                    }
                    originalImageSrcDescriptor.set!.call(this, value);
                }
            });
        }

        // --- PostMessage Listener (for iframe communication) ---
        const handleIframeMessage = (event: MessageEvent) => {
            const data = event.data;
            if (!data) return;

            if (data.type === 'network_proxy' && data.data) {
                const req = data.data;
                addRequestRef.current({
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    method: req.method,
                    url: req.url,
                    type: req.type,
                    body: req.body,
                });
            } else if (data.type === 'log' || data.type === 'click' || data.type === 'error') {
                addRequestRef.current({
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    method: data.type.toUpperCase(),
                    url: 'iframe-sandbox',
                    type: data.type === 'log' ? 'log' : 'custom',
                    body: data,
                });
            } else if (data.type === 'gtm_status') {
                setGtmStatusRef.current(data.status);
            }
        };

        window.addEventListener('message', handleIframeMessage);

        // No cleanup - we want this to persist for the entire application lifetime
    }, []);
};

// Helper to filter relevant requests
function shouldCapture(url: string): boolean {
    const targets = [
        'google-analytics.com',
        'facebook.com',
        'doubleclick.net',
        'googletagmanager.com'
    ];
    return targets.some((t) => url.includes(t));
}
