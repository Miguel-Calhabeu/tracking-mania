"use client";

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useNetworkSpy } from '@/hooks/useNetworkSpy';
import DebugConsole from './DebugConsole';
import Injector from './Injector';
import ChallengeRenderer from './ChallengeRenderer';
import { CHALLENGES } from '@/data/challenges';

interface ChallengeWrapperProps {
    challengeId: string;
    onExit: () => void;
}

export default function ChallengeWrapper({ challengeId, onExit }: ChallengeWrapperProps) {
    useNetworkSpy();
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    const setActiveChallengeType = useStore((state) => state.setActiveChallengeType);

    useEffect(() => {
        if (challenge) {
            setActiveChallengeType(challenge.type);
        }
        return () => setActiveChallengeType(null);
    }, [challenge, setActiveChallengeType]);

    if (!challenge) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Desafio não encontrado</h1>
                    <button onClick={onExit} className="text-blue-400 hover:underline">Sair</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-gray-950">
            <header className="bg-gray-900 border-b border-gray-800 p-4 shadow-md flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onExit}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Sair da Missão
                    </button>
                    <div className="h-6 w-px bg-gray-700 mx-2" />
                    <h1 className="text-lg font-bold text-white tracking-tight">
                        Desafio: <span className="text-blue-400">{challenge.title}</span>
                    </h1>
                </div>

                {/* Status is now handled by Injector component */}
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area (Target Site) */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto relative flex flex-col items-center bg-gray-950">
                    <div className="w-full max-w-6xl space-y-6 h-full flex flex-col">
                        <Injector />
                        <div className="flex-1 w-full relative">
                            <ChallengeRenderer challenge={challenge} />
                        </div>
                    </div>
                </div>

                {/* Debug Console Sidebar */}
                <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col shadow-xl z-40">
                    <DebugConsole objectives={challenge.objectives} />
                </div>
            </div>
        </div>
    );
}
