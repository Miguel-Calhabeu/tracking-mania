"use client";

import Image from 'next/image';

interface ChallengeCardProps {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    imageSrc: string;
    onClick: () => void;
}

export default function ChallengeCard({ title, description, difficulty, imageSrc, onClick }: ChallengeCardProps) {
    const difficultyColor = {
        'Easy': 'text-green-400 bg-green-400/10 border-green-400/20',
        'Medium': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        'Hard': 'text-red-400 bg-red-400/10 border-red-400/20'
    }[difficulty];

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
        >
            <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-3 right-3 z-20 px-2 py-1 rounded text-xs font-bold border ${difficultyColor}`}>
                    {difficulty}
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Start Challenge
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
