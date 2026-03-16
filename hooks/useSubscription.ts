'use client';

import { useAuth, useSession } from "@clerk/nextjs";
import { PlanSlug, PLAN_LIMITS, PlanLimits } from "@/lib/subscription-constants";

/**
 * Client-side hook to get the current user's plan and limits.
 * Uses Clerk's native billing has() method and session claims.
 */
export function useSubscription() {
    const { has, isLoaded, sessionClaims } = useAuth();
    
    if (!isLoaded) {
        return {
            isLoaded: false,
            plan: 'free' as PlanSlug,
            limits: PLAN_LIMITS['free'],
        };
    }

    let plan: PlanSlug = 'free';

    // 1. Check custom JWT claims (pla and fea) from sessionClaims
    if (sessionClaims) {
        const planClaim = (sessionClaims as any).pla || (sessionClaims as any).plan || (sessionClaims as any).subscription;
        
        if (planClaim === 'u:pro' || planClaim === 'pro') plan = 'pro';
        else if (planClaim === 'u:standard' || planClaim === 'standard') plan = 'standard';
        
        // Secondary check on fea if pla is missing
        const feaClaim = (sessionClaims as any).fea;
        if (plan === 'free' && feaClaim) {
            const fea = String(feaClaim);
            if (fea.includes('up_to_100_books')) plan = 'pro';
            else if (fea.includes('up_to_10_books')) plan = 'standard';
        }
    }

    // 2. Fallback to 'has' method
    if (plan === 'free' && has) {
        if (has({ product: 'pro' } as any)) plan = 'pro';
        else if (has({ product: 'standard' } as any)) plan = 'standard';
    }

    return {
        isLoaded: true,
        plan,
        limits: PLAN_LIMITS[plan],
    };
}
