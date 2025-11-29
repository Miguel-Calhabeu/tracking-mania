"use client";

import { useState } from 'react';
import { CHALLENGES } from '@/data/challenges';
import { Challenge } from '@/types/challenge';

interface DashboardProps {
    onSelectChallenge: (challengeId: string) => void;
}

type FilterType = 'all' | 'template' | 'custom';

const DIFFICULTY_COLORS = {
    'Easy': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Hard': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
};

const TYPE_COLORS = {
    'template': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'custom': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
};

const DIFFICULTY_LABELS = {
    'Easy': 'Iniciante',
    'Medium': 'Médio',
    'Hard': 'Avançado'
};

export default function Dashboard({ onSelectChallenge }: DashboardProps) {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredChallenges = CHALLENGES.filter(c =>
        filter === 'all' || c.type === filter
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
            {/* Header */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark"></div>
                <div className="relative container mx-auto px-6 py-20 lg:py-24">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-100">
                        TRACKING <span className="bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text">MANIA</span>
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto text-center text-lg text-muted-dark">
                        Domine a arte da análise web. Resolva desafios reais de tagueamento em ambientes simulados. De cliques básicos a eventos complexos em SPAs.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 pb-24">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Desafios Disponíveis</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-primary-light text-white' : 'bg-surface-light dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilter('template')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'template' ? 'bg-primary-light text-white' : 'bg-surface-light dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Templates
                        </button>
                        <button
                            onClick={() => setFilter('custom')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'custom' ? 'bg-primary-light text-white' : 'bg-surface-light dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            Customizados
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredChallenges.map((challenge) => (
                        <div
                            key={challenge.id}
                            onClick={() => onSelectChallenge(challenge.id)}
                            className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl flex flex-col border border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-dark/10 dark:hover:shadow-glow-violet hover:-translate-y-1 cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-semibold py-1 px-3 rounded-full ${TYPE_COLORS[challenge.type]}`}>
                                    {challenge.type === 'template' ? 'Template' : 'Custom'}
                                </span>
                                <span className={`text-xs font-semibold py-1 px-3 rounded-full ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                                    {DIFFICULTY_LABELS[challenge.difficulty]}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-light transition-colors">
                                {challenge.title}
                            </h3>
                            <p className="text-muted-light dark:text-muted-dark text-sm flex-grow mb-4">
                                {challenge.description}
                            </p>

                            {challenge.type === 'custom' && (
                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary-light dark:text-indigo-400">
                                        <span className="material-symbols-outlined text-base">code</span>
                                        Ver Código
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Coming Soon Card */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-6 text-center text-muted-light dark:text-muted-dark opacity-75">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Em Breve</h3>
                        <p className="text-sm">Mais cenários estão em desenvolvimento.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
