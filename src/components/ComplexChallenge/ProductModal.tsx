"use client";

import { useState } from 'react';
import { sendGTMEvent } from '@/lib/gtm';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        specs: Record<string, string>;
    };
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-xl w-full max-w-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{product.name}</h2>
                        <p className="text-cyan-400 font-mono mt-1 text-sm">ID: {product.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex gap-6 mb-8">
                        <div className="w-1/3 aspect-square bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                            {/* Placeholder for modal specific image if needed, or reuse main */}
                            <div className="text-cyan-900/40">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-300 leading-relaxed mb-4">
                                {product.description}
                            </p>
                            <div className="text-3xl font-bold text-white mb-6">
                                ${product.price.toFixed(2)}
                            </div>
                            <button
                                id="modal-add-to-cart"
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] active:scale-[0.98]"
                                onClick={() => {
                                    sendGTMEvent({
                                        event: 'add_to_cart',
                                        currency: 'USD',
                                        value: product.price,
                                        items: [{
                                            item_id: product.id,
                                            item_name: product.name,
                                            price: product.price
                                        }]
                                    });
                                    onClose();
                                }}
                            >
                                INICIAR TRANSFERÊNCIA
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div>
                        <div className="flex border-b border-gray-800 mb-4">
                            <button
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'specs' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab('specs')}
                            >
                                ESPECIFICAÇÕES TÉCNICAS
                                {activeTab === 'specs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
                            </button>
                            <button
                                className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === 'reviews' ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                LOGS DE USUÁRIO
                                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
                            </button>
                        </div>

                        <div className="min-h-[150px]">
                            {activeTab === 'specs' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase tracking-wider">{key}</span>
                                            <span className="text-gray-300 font-mono">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-cyan-300 text-sm font-bold">User_7734</span>
                                            <span className="text-gray-500 text-xs">2h atrás</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">Latência inexistente. Melhor link neural que já usei.</p>
                                    </div>
                                    <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-cyan-300 text-sm font-bold">NetRunner_X</span>
                                            <span className="text-gray-500 text-xs">5h atrás</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">Requer o patch de firmware mais recente, mas fora isso é sólido.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
