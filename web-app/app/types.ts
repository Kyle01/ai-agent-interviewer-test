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
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}
