type GTMEvent = {
    event: string;
    [key: string]: any;
};

export const sendGTMEvent = (data: GTMEvent) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push(data);
    } else {
        console.warn('GTM not initialized or running on server-side');
    }
};
