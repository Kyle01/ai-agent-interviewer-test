export interface Message {
    content: string;
    role: 'user' | 'assistant';
    timestamp?: string;
}

export interface CandidateProfile {
    id: string;
    candidateName: string;
    desiredPosition: string;
    desiredSalary: number;
    hasAgreedToUpperSalaryRange: boolean;
    registrationNumber: string;
    registrationState: string;
    expectedRegistrationDate: string;
    hasTwoYearsExperience: boolean;
    experienceDescription: string;
}

export enum CandidateProfileStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
}
