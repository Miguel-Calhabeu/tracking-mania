"use client";

import { useState } from 'react';
import { CHALLENGES } from '@/data/challenges';
import { CustomContent } from '@/types/challenge';
import CodeModal from './CodeModal';

interface ChallengeDetailProps {
    challengeId: string;
    onStart: () => void;
    onBack: () => void;
}

const DIFFICULTY_LABELS = {
    'Easy': 'Iniciante',
    'Medium': 'Médio',
    'Hard': 'Avançado'
};

const DIFFICULTY_COLORS = {
    'Easy': 'bg-green-100 text-green-800 border-green-200',
    'Medium': 'bg-orange-100 text-orange-800 border-orange-200',
    'Hard': 'bg-red-100 text-red-800 border-red-200'
};

export default function ChallengeDetail({ challengeId, onStart, onBack }: ChallengeDetailProps) {
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const challenge = CHALLENGES.find(c => c.id === challengeId);

    if (!challenge) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Desafio não encontrado</h1>
                    <button onClick={onBack} className="text-blue-400 hover:underline">Voltar ao Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Header Image */}
            <div className="h-64 md:h-80 relative w-full">
                <div className="absolute inset-0 bg-[url('/images/cyberpunk_hero_bg.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur rounded-lg hover:bg-black/70 transition-colors text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar ao Dashboard
                </button>
            </div>

            <div className="flex-1 max-w-5xl mx-auto w-full px-6 -mt-20 relative z-10 pb-12">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                                        {DIFFICULTY_LABELS[challenge.difficulty]}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-bold uppercase tracking-wider">
                                        {challenge.type === 'template' ? 'Template' : 'Customizado'}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-black text-white mb-4">{challenge.title}</h1>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                                    {challenge.description}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onStart}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1 active:scale-[0.98] whitespace-nowrap"
                                >
                                    Iniciar Missão
                                </button>
                                {challenge.type === 'custom' && (
                                    <button
                                        onClick={() => setIsCodeModalOpen(true)}
                                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">code</span>
                                        Ver Código
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-800 pt-12">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </span>
                                    Objetivos
                                </h3>
                                <ul className="space-y-4">
                                    {challenge.objectives.map((objective, i) => (
                                        <li key={i} className="flex gap-3 items-start text-gray-300">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                            {objective.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </span>
                                    Conceitos Chave
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Rastreamento SPA', 'Eventos Personalizados', 'Data Layer', 'Scraping de DOM', 'Grupos de Acionadores'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {challenge.type === 'custom' && (
                <CodeModal
                    isOpen={isCodeModalOpen}
                    onClose={() => setIsCodeModalOpen(false)}
                    content={challenge.content as CustomContent}
                />
            )}
        </div>
    );
}
