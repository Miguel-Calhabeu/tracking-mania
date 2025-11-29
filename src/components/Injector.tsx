"use client";

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';

export default function Injector() {
    const [localGtmId, setLocalGtmId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

    const setGlobalGtmId = useStore((state) => state.setGtmId);
    const activeChallengeType = useStore((state) => state.activeChallengeType);
    const gtmStatus = useStore((state) => state.gtmStatus);
    const setGtmStatus = useStore((state) => state.setGtmStatus);

    const normalizeGtmId = (id: string) => id.trim().toUpperCase();
    const isValidGtmId = (id: string) => normalizeGtmId(id).startsWith('GTM-');

    const injectGTM = useCallback((id: string) => {
        const trimmedId = normalizeGtmId(id);

        // Double check to prevent manual injection in custom mode
        if (activeChallengeType === 'custom') {
            // Still update state/storage, just don't inject script
            localStorage.setItem("gtm_id", trimmedId);
            setGlobalGtmId(trimmedId);
            // For custom challenges, the status will be set by the iframe message
            setGtmStatus('loading');
            return;
        }

        if (!trimmedId.startsWith("GTM-")) return;

        // Remove existing GTM scripts if any
        const existingScript = document.getElementById("gtm-script");
        const existingNoScript = document.getElementById("gtm-noscript");
        if (existingScript) existingScript.remove();
        if (existingNoScript) existingNoScript.remove();

        // Ensure dataLayer exists
        window.dataLayer = window.dataLayer || [];

        // Push start event
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });

        setGtmStatus('loading');

        // Inject Script
        const script = document.createElement("script");
        script.id = "gtm-script";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${trimmedId}`;

        script.onload = () => {
            setGtmStatus('active');
        };

        script.onerror = () => {
            setGtmStatus('error');
        };

        document.head.insertBefore(script, document.head.firstChild);

        // Inject NoScript
        const noscript = document.createElement("noscript");
        noscript.id = "gtm-noscript";
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${trimmedId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);

        localStorage.setItem("gtm_id", trimmedId);
        setGlobalGtmId(trimmedId);
    }, [activeChallengeType, setGlobalGtmId, setGtmStatus]);

    useEffect(() => {
        const savedId = localStorage.getItem("gtm_id");
        if (savedId && isValidGtmId(savedId)) {
            const sanitizedId = normalizeGtmId(savedId);
            setLocalGtmId(sanitizedId);
            setGlobalGtmId(sanitizedId);

            // Only inject in main window if NOT a custom challenge AND type is determined
            if (!document.getElementById("gtm-script") && activeChallengeType !== 'custom' && activeChallengeType !== null) {
                injectGTM(sanitizedId);
            }
            setIsLoaded(true);
            setIsCollapsed(true); // Auto-collapse on load
        } else if (!savedId) {
            setGtmStatus('idle');
        } else {
            localStorage.removeItem('gtm_id');
            setGtmStatus('idle');
        }
    }, [activeChallengeType, injectGTM, setGlobalGtmId, setGtmStatus]);

    const handleInject = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidGtmId(localGtmId)) {
            alert('ID do GTM inválido. Deve começar com GTM-');
            return;
        }

        const sanitizedId = normalizeGtmId(localGtmId);
        const savedId = localStorage.getItem("gtm_id");

        // If the ID is exactly the same, do nothing (prevents loading status issue)
        if (savedId === sanitizedId) {
            setIsCollapsed(true);
            return;
        }

        // If ID has changed and we already have one loaded, ask for confirmation to reload
        // Exception: Custom challenges can update dynamically without reload
        if (savedId && savedId !== sanitizedId && activeChallengeType !== 'custom') {
            setShowUpdateConfirm(true);
            return;
        }

        injectGTM(sanitizedId);
        setIsLoaded(true);
        setIsCollapsed(true);
    };

    const confirmUpdate = () => {
        localStorage.setItem("gtm_id", normalizeGtmId(localGtmId));
        window.location.reload();
    };

    const handleReset = () => {
        // Remove scripts
        const existingScript = document.getElementById("gtm-script");
        const existingNoScript = document.getElementById("gtm-noscript");
        if (existingScript) existingScript.remove();
        if (existingNoScript) existingNoScript.remove();

        // Clear storage and state
        localStorage.removeItem("gtm_id");
        setLocalGtmId('');
        setGlobalGtmId(null);
        setGtmStatus('idle');
        setIsLoaded(false);
        setShowResetConfirm(false);

        // Force reload to ensure a truly clean environment (no lingering GTM objects).
        // Since we now persist the view state in page.tsx, the user will stay on the challenge page.
        window.location.reload();
    };

    const getStatusColor = () => {
        switch (gtmStatus) {
            case 'active': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'loading': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (gtmStatus) {
            case 'active': return 'ATIVO';
            case 'error': return 'ERRO';
            case 'loading': return 'CARREGANDO...';
            default: return 'INATIVO';
        }
    };

    const getStatusTextColor = () => {
        switch (gtmStatus) {
            case 'active': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'loading': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    if (isLoaded && isCollapsed) {
        return (
            <div className="bg-gray-900 border-b border-gray-800 p-2 flex justify-between items-center shadow-md mb-4 rounded-lg border">
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 bg-gray-900/30 rounded-full border border-gray-700`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor()}`}></span>
                        <span className={`text-xs font-mono font-bold ${getStatusTextColor()}`}>GTM: {getStatusText()}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{localGtmId}</span>

                    {/* Publish Warning Tooltip */}
                    <div className="group relative flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute left-full ml-2 w-64 p-2 bg-black border border-gray-700 rounded text-xs text-gray-300 hidden group-hover:block z-50 shadow-xl">
                            Lembre-se: O sistema vê apenas versões PUBLICADAS, não o modo Preview/Debug.
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="text-xs text-gray-400 hover:text-white"
                    >
                        Editar
                    </button>

                    {showResetConfirm ? (
                        <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                            <span className="text-xs text-red-400 font-bold mr-1">Tem certeza?</span>
                            <button
                                onClick={handleReset}
                                className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded"
                            >
                                Sim
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 rounded"
                            >
                                Não
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="text-xs text-red-400 hover:text-red-300 hover:underline px-2"
                        >
                            Resetar Ambiente
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Injeção do GTM</h3>
                    <p className="text-sm text-gray-400">Insira seu ID do Container para iniciar a missão.</p>
                </div>
                {isLoaded && (
                    <button onClick={() => setIsCollapsed(true)} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>

            <form onSubmit={handleInject} className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="GTM-XXXXXX"
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono text-lg"
                    value={localGtmId}
                    onChange={(e) => setLocalGtmId(e.target.value)}
                    disabled={showUpdateConfirm}
                />

                {showUpdateConfirm ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Recarregamento Necessário</span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={confirmUpdate}
                                    className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-1 rounded font-bold text-sm"
                                >
                                    CONFIRMAR
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateConfirm(false)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded font-bold text-sm"
                                >
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20"
                    >
                        {isLoaded ? 'ATUALIZAR' : 'INJETAR'}
                    </button>
                )}
            </form>
        </div>
    );
}
