"use client";

import { CustomContent } from '@/types/challenge';

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: CustomContent;
}

export default function CodeModal({ isOpen, onClose, content }: CodeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">code</span>
                        Código Fonte do Desafio
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-0 font-mono text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                        <div className="border-r border-gray-800 flex flex-col">
                            <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-bold uppercase">HTML</div>
                            <pre className="p-4 text-green-300 overflow-auto flex-1">{content.html}</pre>
                        </div>
                        <div className="flex flex-col">
                            <div className="h-1/2 flex flex-col border-b border-gray-800">
                                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-bold uppercase">CSS</div>
                                <pre className="p-4 text-blue-300 overflow-auto flex-1">{content.css}</pre>
                            </div>
                            <div className="h-1/2 flex flex-col">
                                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-bold uppercase">JavaScript</div>
                                <pre className="p-4 text-yellow-300 overflow-auto flex-1">{content.js}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
