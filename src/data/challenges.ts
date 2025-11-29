import { Challenge } from '@/types/challenge';
import { CapturedRequest } from '@/store/useStore';

export const CHALLENGES: Challenge[] = [
    {
        id: 'global-travel',
        title: 'Global Travel Booker',
        description: 'Configure o rastreamento básico de visualização de página e cliques em botões em várias etapas de reserva.',
        type: 'template',
        difficulty: 'Easy',
        content: {
            templateId: 'travel-v1', // Placeholder
            config: {}
        },
        objectives: [
            {
                id: 'page_view',
                label: 'Rastrear Pageview',
                isMet: (requests: CapturedRequest[]) => requests.some(r => r.url.includes('page_view') || (r.body && JSON.stringify(r.body).includes('page_view')))
            }
        ]
    },
    {
        id: 'cyberpunk-store',
        title: 'Cyberpunk Gadget Store',
        description: 'Implemente rastreamento avançado de e-commerce em uma aplicação de página única (SPA) dinâmica.',
        type: 'template',
        difficulty: 'Medium',
        content: {
            templateId: 'ecommerce-v1',
            config: {
                theme: 'cyberpunk'
            }
        },
        objectives: [
            {
                id: 'page_view',
                label: "Rastrear Pageviews Virtuais (SPA)",
                isMet: (requests: CapturedRequest[]) => {
                    const pageViews = requests.filter(r => {
                        try {
                            if (r.url.includes('google-analytics.com')) {
                                const url = new URL(r.url);
                                return url.searchParams.get('en') === 'page_view' || url.searchParams.get('ep.event_name') === 'page_view';
                            }
                            const body = typeof r.body === 'string' ? JSON.parse(r.body) : r.body;
                            return body?.event === 'page_view';
                        } catch { return false; }
                    });
                    return pageViews.length >= 2;
                }
            },
            {
                id: 'add_to_cart',
                label: "Rastrear eventos de 'Adicionar ao Carrinho'",
                isMet: (requests: CapturedRequest[]) => requests.some(r => {
                    try {
                        const body = typeof r.body === 'string' ? JSON.parse(r.body) : r.body;
                        return body?.event === 'add_to_cart' || body?.event === 'AddToCart';
                    } catch { return false; }
                })
            },
            {
                id: 'product_data',
                label: "Capturar ID e Preço do Produto",
                isMet: (requests: CapturedRequest[]) => requests.some(r => {
                    try {
                        const body = typeof r.body === 'string' ? JSON.parse(r.body) : r.body;
                        if (body?.event === 'add_to_cart') {
                            const item = body.ecommerce?.items?.[0] || body.items?.[0];
                            return item?.item_id && item?.price;
                        }
                        return false;
                    } catch { return false; }
                })
            }
        ]
    },
    {
        id: 'saas-platform',
        title: 'Data Analytics Platform',
        description: 'Rastreie o engajamento do usuário e fluxos de assinatura em uma plataforma SaaS B2B complexa.',
        type: 'custom',
        difficulty: 'Hard',
        content: {
            html: `
                <div style="padding: 20px; font-family: sans-serif; color: #333;">
                    <h1>SaaS Dashboard</h1>
                    <button id="subscribe-btn" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Subscribe Now
                    </button>
                    <script>
                        document.getElementById('subscribe-btn').addEventListener('click', () => {
                            console.log('Subscribe clicked');
                            // Simulate a dataLayer push
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                event: 'subscribe',
                                plan: 'pro'
                            });
                        });
                    </script>
                </div>
            `,
            css: `body { background-color: #f3f4f6; }`,
            js: `console.log('Custom Challenge Loaded');`
        },
        objectives: [
            {
                id: 'subscribe_click',
                label: 'Rastrear Clique em Assinar',
                isMet: (requests: CapturedRequest[]) => requests.some(r => {
                    try {
                        const body = typeof r.body === 'string' ? JSON.parse(r.body) : r.body;
                        return body?.event === 'subscribe';
                    } catch { return false; }
                })
            }
        ]
    }
];
