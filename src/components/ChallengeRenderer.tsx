"use client";

import { Challenge, TemplateContent, CustomContent } from '@/types/challenge';
import SandboxedFrame from './SandboxedFrame';
import CyberpunkStore from './ComplexChallenge/CyberpunkStore';

interface ChallengeRendererProps {
    challenge: Challenge;
}

export default function ChallengeRenderer({ challenge }: ChallengeRendererProps) {
    const { type, content } = challenge;

    if (type === 'template') {
        const templateContent = content as TemplateContent;

        switch (templateContent.templateId) {
            case 'ecommerce-v1':
                // TODO: Pass templateContent.config to CyberpunkStore to make it dynamic
                return <CyberpunkStore />;
            default:
                return (
                    <div className="flex items-center justify-center h-full text-red-400">
                        Unknown Template ID: {templateContent.templateId}
                    </div>
                );
        }
    }

    if (type === 'custom') {
        const customContent = content as CustomContent;
        return (
            <SandboxedFrame
                html={customContent.html}
                css={customContent.css}
                js={customContent.js}
                className="bg-white rounded-lg shadow-lg" // Default white bg for custom challenges
            />
        );
    }

    return (
        <div className="flex items-center justify-center h-full text-red-400">
            Unknown Challenge Type: {type}
        </div>
    );
}
