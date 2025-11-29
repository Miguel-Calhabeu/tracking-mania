"use client";

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { GET_SPY_SCRIPT } from '@/lib/spy-script';

interface SandboxedFrameProps {
    html: string;
    css: string;
    js: string;
    className?: string;
}

export default function SandboxedFrame({ html, css, js, className = "" }: SandboxedFrameProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const gtmId = useStore((state) => state.gtmId);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument;
        if (!doc) return;

        // GTM Snippets
        const gtmScript = gtmId ? `
            <script>
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;

                j.onload = function() {
                    window.parent.postMessage({ type: 'gtm_status', status: 'active' }, '*');
                };
                j.onerror = function() {
                    window.parent.postMessage({ type: 'gtm_status', status: 'error' }, '*');
                };

                f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
            </script>
        ` : '';

        const gtmNoScript = gtmId ? `
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        ` : '';

        // Network Proxy Script (Must run before anything else)
        const proxyScript = GET_SPY_SCRIPT();

        // Construct the full HTML content
        const fullContent = `
            <!DOCTYPE html>
            <html>
            <head>
                ${proxyScript}
                ${gtmScript}
                <style>
                    ${css}
                </style>
            </head>
            <body>
                ${gtmNoScript}
                ${html}
                <script>
                    // Execute user JS
                    try {
                        ${js}
                    } catch (e) {
                        console.error('Error in custom script:', e);
                        window.parent.postMessage({
                            type: 'error',
                            message: e.message
                        }, '*');
                    }
                </script>
            </body>
            </html>
        `;

        const timer = setTimeout(() => {
            doc.open();
            doc.write(fullContent);
            doc.close();
        }, 50);

        return () => clearTimeout(timer);
    }, [html, css, js, gtmId]);

    return (
        <iframe
            ref={iframeRef}
            className={`w-full h-full border-0 ${className}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Custom Challenge Sandbox"
        />
    );
}
