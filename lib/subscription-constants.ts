export type PlanSlug = 'free' | 'standard' | 'pro';

export interface PlanLimits {
    maxBooks: number;
    maxSessionsPerMonth: number;
    maxMinutesPerSession: number;
    hasSessionHistory: boolean;
}

export const PLAN_LIMITS: Record<PlanSlug, PlanLimits> = {
    free: {
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxMinutesPerSession: 5,
        hasSessionHistory: false,
    },
    standard: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxMinutesPerSession: 15,
        hasSessionHistory: true,
    },
    pro: {
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxMinutesPerSession: 60,
        hasSessionHistory: true,
    },
};

export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};