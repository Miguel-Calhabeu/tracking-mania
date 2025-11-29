export type ChallengeType = 'template' | 'custom';
export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Objective {
    id: string;
    label: string;
    // For now, we keep the function for local validation.
    // In the future, this will be replaced by a JSON rule engine.
    isMet: (requests: any[]) => boolean;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    type: ChallengeType;
    content: TemplateContent | CustomContent;
    objectives: Objective[];
}

export interface TemplateContent {
    templateId: string;
    config?: any;
}

export interface CustomContent {
    html: string;
    css: string;
    js: string;
}
