// Згідно з вашою сутністю Case
export interface Case {
    id: number;
    startDate: string; // формат: YYYY-MM-DD
    endDate: string;   // формат: YYYY-MM-DD
    status: boolean;
    apply?: {
        id: number;
        date: string;
        request: string;
    };
    user?: {
        id: string;
        email: string;
        username: string;
    };
}

export interface CaseFormData {
    startDate: string;
    endDate: string;
    requestText: string;
    userId: number;
}
