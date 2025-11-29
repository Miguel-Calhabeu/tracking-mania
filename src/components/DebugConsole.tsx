"use client";

import { useStore, CapturedRequest } from '@/store/useStore';
import { useState, useMemo } from 'react';

export interface Objective {
    id: string;
    label: string;
    isMet: (requests: CapturedRequest[]) => boolean;
}

interface DebugConsoleProps {
    objectives?: Objective[];
}

export default function DebugConsole({ objectives = [] }: DebugConsoleProps) {
    const requests = useStore((state) => state.capturedRequests);
    const clearRequests = useStore((state) => state.clearRequests);
    const [activeTab, setActiveTab] = useState<'console' | 'objectives'>('console');
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const selectedRequest = useMemo(() =>
        requests.find(r => r.id === selectedRequestId),
        [requests, selectedRequestId]
    );

    // Calculate completed objectives
    const completedObjectives = useMemo(() => {
        return objectives.map(obj => ({
            ...obj,
            completed: obj.isMet(requests)
        }));
    }, [objectives, requests]);

    return (
        <div className="flex flex-col h-full bg-gray-900 text-gray-300 text-xs font-mono">
            {/* Header / Tabs */}
            <div className="flex border-b border-gray-700 bg-gray-900">
                <button
                    onClick={() => setActiveTab('console')}
                    className={`px-4 py-2 border-r border-gray-700 hover:bg-gray-800 transition-colors ${activeTab === 'console' ? 'bg-gray-800 text-white font-bold' : 'text-gray-500'}`}
                >
                    Console
                </button>
                <button
                    onClick={() => setActiveTab('objectives')}
                    className={`px-4 py-2 border-r border-gray-700 hover:bg-gray-800 transition-colors flex items-center gap-2 ${activeTab === 'objectives' ? 'bg-gray-800 text-white font-bold' : 'text-gray-500'}`}
                >
                    Objetivos
                    {completedObjectives.every(o => o.completed) && (
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                </button>
                <div className="flex-1 flex justify-end items-center px-2">
                    <button
                        onClick={clearRequests}
                        className="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20 transition-colors"
                    >
                        Limpar
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'console' ? (
                    <div className="flex-1 flex flex-col h-full">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 p-2 border-b border-gray-700 bg-gray-800/50 font-bold text-gray-400">
                            <div className="col-span-2">Hora</div>
                            <div className="col-span-2">Método</div>
                            <div className="col-span-2">Tipo</div>
                            <div className="col-span-6">Nome/URL</div>
                        </div>

                        {/* Request List */}
                        <div className="flex-1 overflow-y-auto">
                            {requests.length === 0 && (
                                <div className="p-4 text-center text-gray-500 italic">
                                    Aguardando sinais...
                                </div>
                            )}
                            {requests.map((req) => (
                                <div
                                    key={req.id}
                                    onClick={() => setSelectedRequestId(req.id === selectedRequestId ? null : req.id)}
                                    className={`grid grid-cols-12 gap-2 p-2 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${selectedRequestId === req.id ? 'bg-blue-900/20 border-l-2 border-l-blue-500' : ''}`}
                                >
                                    <div className="col-span-2 text-gray-500 truncate">
                                        {new Date(req.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                    <div className={`col-span-2 font-bold ${getMethodColor(req.method)}`}>
                                        {req.method}
                                    </div>
                                    <div className="col-span-2 text-gray-400 truncate">
                                        {req.type}
                                    </div>
                                    <div className="col-span-6 truncate text-gray-300" title={req.url}>
                                        {getEventName(req) || req.url}
                                    </div>

                                    {/* Payload Inspector (Inline) */}
                                    {selectedRequestId === req.id && (
                                        <div className="col-span-12 mt-2 bg-gray-950 p-2 rounded border border-gray-700 overflow-x-auto">
                                            <PayloadInspector request={req} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-4 overflow-y-auto">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Objetivos da Missão</h3>
                        {completedObjectives.map((obj) => (
                            <div
                                key={obj.id}
                                className={`p-3 rounded border transition-all duration-500 ${obj.completed ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-800 border-gray-700'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border ${obj.completed ? 'bg-green-500 border-green-500 text-black' : 'border-gray-600 text-transparent'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${obj.completed ? 'text-green-100' : 'text-gray-300'}`}>
                                            {obj.label}
                                        </p>
                                        {obj.completed && (
                                            <p className="text-xs text-green-400 mt-1 animate-pulse">
                                                Sinal Verificado
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getMethodColor(method: string) {
    switch (method) {
        case 'POST': return 'text-green-400';
        case 'GET': return 'text-blue-400';
        case 'LOG': return 'text-yellow-400';
        case 'CLICK': return 'text-purple-400';
        case 'ERROR': return 'text-red-500';
        default: return 'text-gray-400';
    }
}

function getEventName(req: CapturedRequest): string | null {
    // Handle Custom Logs/Events
    if (req.type === 'log' || req.type === 'custom') {
        if (req.body?.type === 'log') {
            return `Console: ${req.body.args?.[0]}`;
        }
        if (req.body?.type === 'click') {
            return `Click: ${req.body.target}#${req.body.id}`;
        }
        if (req.body?.type === 'error') {
            return `Error: ${req.body.message}`;
        }
        return `Custom: ${req.body?.type}`;
    }

    // Try to parse GA4/GTM event name from body or URL
    try {
        if (req.body) {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            // GA4 often sends 'en' (event name) parameter
            if (req.url.includes('google-analytics.com')) {
                // Check for 'en' in query params first
                const url = new URL(req.url);
                if (url.searchParams.get('en')) return `GA4: ${url.searchParams.get('en')}`;
            }
            if (body.event) return `Event: ${body.event}`;
            if (body.events && body.events[0] && body.events[0].name) return `GA4: ${body.events[0].name}`;
        }

        // Check URL params for common vendors
        const url = new URL(req.url);
        if (url.pathname.includes('collect')) {
            if (url.searchParams.get('en')) return `GA4: ${url.searchParams.get('en')}`;
            if (url.searchParams.get('ep.event_name')) return `GA4: ${url.searchParams.get('ep.event_name')}`;
        }
    } catch (e) {
        // Ignore parsing errors
    }
    return null;
}

function PayloadInspector({ request }: { request: CapturedRequest }) {
    let content = null;
    let isJson = false;

    // Try to parse body
    if (request.body) {
        try {
            const parsed = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
            content = parsed;
            isJson = true;
        } catch (e) {
            content = request.body;
        }
    } else {
        // If no body, show URL params
        try {
            const url = new URL(request.url);
            const params: Record<string, string> = {};
            url.searchParams.forEach((value, key) => {
                params[key] = value;
            });
            if (Object.keys(params).length > 0) {
                content = params;
                isJson = true;
            }
        } catch (e) {
            // Invalid URL
        }
    }

    if (!content) return <div className="text-gray-500 italic">Sem dados de payload</div>;

    if (isJson) {
        return (
            <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap">
                {JSON.stringify(content, null, 2)}
            </pre>
        );
    }

    return (
        <div className="text-xs text-gray-300 font-mono break-all">
            {String(content)}
        </div>
    );
}
