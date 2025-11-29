"use client";

import { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: 'implants' | 'software' | 'hardware';
    specs: Record<string, string>;
}

const PRODUCTS: Product[] = [
    {
        id: 'NEURO-LNK-01',
        name: 'Interface Neural Link v4.0',
        price: 2499.00,
        description: 'Interface neural direta para transmissão de dados perfeita. Compatível com todos os principais cyberdecks.',
        category: 'implants',
        specs: {
            'Largura de Banda': '100 TB/s',
            'Latência': '< 1ms',
            'Conector': 'Cortex-X',
            'Bateria': 'Célula Nuclear (10a)'
        }
    },
    {
        id: 'OPTIC-EYE-X',
        name: 'Kiroshi Optics Mark III',
        price: 1250.00,
        description: 'Sistema de visão aprimorado com sobreposição de dados em tempo real e capacidades de imagem térmica.',
        category: 'implants',
        specs: {
            'Resolução': '32K',
            'Zoom': '50x Óptico',
            'Visão Noturna': 'IR Ativo',
            'Estabilização': 'Giroscópio de 6 Eixos'
        }
    },
    {
        id: 'DATA-SHARD-PRO',
        name: 'Data Shard Seguro 5TB',
        price: 199.00,
        description: 'Criptografia de nível militar para seus dados mais sensíveis. À prova de água, choque e EMP.',
        category: 'hardware',
        specs: {
            'Capacidade': '5 TB',
            'Criptografia': 'AES-4096',
            'Transferência': 'Link Quântico',
            'Durabilidade': 'Mil-Spec 810G'
        }
    }
];

export default function CyberpunkStore() {
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentView, setCurrentView] = useState<'home' | 'implants' | 'software' | 'hardware'>('home');

    // Simulate SPA Navigation
    const handleNavigation = (view: typeof currentView) => {
        setCurrentView(view);
        // Update URL without reload (SPA behavior)
        const newPath = view === 'home' ? '/challenge/cyberpunk' : `/challenge/cyberpunk/${view}`;
        window.history.pushState({ view }, '', newPath);
    };

    // Handle back button
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state?.view) {
                setCurrentView(event.state.view);
            } else {
                setCurrentView('home');
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const filteredProducts = currentView === 'home'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === currentView);

    return (
        <div className="w-full bg-gray-950 text-gray-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden rounded-xl border border-gray-800 shadow-2xl relative min-h-[800px] flex flex-col">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/images/cyberpunk_hero_bg.png')] bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/80 to-gray-950 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md p-4 flex justify-between items-center sticky top-0">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleNavigation('home')}
                >
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                    <span className="text-xl font-bold tracking-widest text-white">CYBER<span className="text-cyan-500">MARKET</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        {['IMPLANTES', 'SOFTWARE', 'HARDWARE'].map((item) => {
                            const view = (item === 'IMPLANTES' ? 'implants' : item.toLowerCase()) as typeof currentView;
                            return (
                                <button
                                    key={item}
                                    onClick={() => handleNavigation(view)}
                                    className={`transition-colors uppercase ${currentView === view ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400'}`}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="relative group cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-gray-900">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6 md:p-8 flex-1">
                {currentView === 'home' && (
                    <div className="flex flex-col md:flex-row gap-8 mb-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-full md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-cyan-500/10 rounded-xl blur-xl group-hover:bg-cyan-500/20 transition-all duration-500" />
                            <div className="relative bg-gray-900/50 border border-gray-700 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                                <Image
                                    src="/images/cyberpunk_product.png"
                                    alt="Featured Product"
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                                    <span className="inline-block px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold rounded mb-2">DESTAQUE</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                                    NEURAL LINK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">V4.0</span>
                                </h1>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    Experimente a próxima evolução da conectividade. Interface perfeita com a rede global na velocidade do pensamento. Agora com criptografia de nível militar.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold text-white">$2,499.00</div>
                                <div className="text-sm text-gray-500 line-through">$3,200.00</div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] active:scale-[0.98]"
                                    onClick={() => setSelectedProduct(PRODUCTS[0])}
                                >
                                    VER DETALHES
                                </button>
                                <button className="px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold rounded-lg transition-all">
                                    ESPECIFICAÇÕES
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase">
                    <span className="w-1 h-6 bg-pink-600 block" />
                    {currentView === 'home' ? 'Últimos Lançamentos' : `Catálogo de ${currentView === 'implants' ? 'Implantes' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}`}
                </h3>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-gray-900/40 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all group hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col">
                                <div className="h-40 bg-gray-800/50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-gray-600 font-mono text-xs">{product.id}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{product.name}</h4>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                                    <button
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        Inspecionar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                        <p className="text-lg">Nenhum produto encontrado neste setor.</p>
                        <button
                            onClick={() => handleNavigation('home')}
                            className="mt-4 text-cyan-500 hover:underline"
                        >
                            Voltar ao Hub
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800 mt-auto p-8 bg-gray-900/80 text-center">
                <p className="text-gray-500 text-sm">© 2077 CYBERMARKET SYSTEMS. TODOS OS DIREITOS RESERVADOS.</p>
                <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600 font-mono">
                    <span>CONEXÃO_SEGURA: CRIPTOGRAFADA</span>
                    <span>NÓ_SERVIDOR: TOKYO_03</span>
                </div>
            </footer>

            {/* Modals */}
            <ProductModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct!}
            />
        </div>
    );
}
