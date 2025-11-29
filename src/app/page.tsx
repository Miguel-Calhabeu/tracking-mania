"use client";

import { useState, useEffect } from 'react';
import ChallengeWrapper from "@/components/ChallengeWrapper";
import Dashboard from "@/components/Dashboard";
import ChallengeDetail from "@/components/ChallengeDetail";

type ViewState = 'dashboard' | 'detail' | 'challenge';

export default function Home() {
    const [view, setView] = useState<ViewState>('dashboard');
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedView = localStorage.getItem('app_view') as ViewState;
        const savedChallenge = localStorage.getItem('app_challenge');

        if (savedView) setView(savedView);
        if (savedChallenge) setSelectedChallenge(savedChallenge);
        setIsInitialized(true);
    }, []);

    // Save state changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('app_view', view);
            if (selectedChallenge) {
                localStorage.setItem('app_challenge', selectedChallenge);
            } else {
                localStorage.removeItem('app_challenge');
            }
        }
    }, [view, selectedChallenge, isInitialized]);

    const handleSelectChallenge = (id: string) => {
        setSelectedChallenge(id);
        setView('detail');
    };

    const handleStartChallenge = () => {
        setView('challenge');
    };

    const handleBackToDashboard = () => {
        setView('dashboard');
        setSelectedChallenge(null);
        // Clear persisted state
        localStorage.removeItem('app_view');
        localStorage.removeItem('app_challenge');
    };

    if (!isInitialized) return null; // Prevent hydration mismatch

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            {view === 'dashboard' && (
                <Dashboard onSelectChallenge={handleSelectChallenge} />
            )}

            {view === 'detail' && selectedChallenge && (
                <ChallengeDetail
                    challengeId={selectedChallenge}
                    onStart={handleStartChallenge}
                    onBack={handleBackToDashboard}
                />
            )}

            {view === 'challenge' && selectedChallenge && (
                <ChallengeWrapper
                    challengeId={selectedChallenge}
                    onExit={handleBackToDashboard}
                />
            )}
        </main>
    );
}
