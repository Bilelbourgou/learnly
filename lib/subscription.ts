import { auth, clerkClient } from "@clerk/nextjs/server";
import { PlanSlug, PLAN_LIMITS, PlanLimits } from "./subscription-constants";

/**
 * Server-side utility to get the current user's plan slug.
 * Uses Clerk's native billing has() method, with clerkClient as a fallback.
 */
export async function getUserPlan(): Promise<PlanSlug> {
    const authData = await auth();
    const { userId, has, sessionClaims } = authData;

    if (!userId) return 'free';

    // 1. Check custom JWT claims (pla and fea) - This is where the logs showed data
    if (sessionClaims) {
        const planClaim = sessionClaims.pla as string | undefined;
        const featuresClaim = sessionClaims.fea as string | undefined;

        // In this app, plans seem to be prefixed with 'u:' in claims
        if (planClaim === 'u:pro' || planClaim === 'pro') return 'pro';
        if (planClaim === 'u:standard' || planClaim === 'standard') return 'standard';

        // Fallback: search for strings in features claim if 'pla' is missing
        if (featuresClaim) {
            if (featuresClaim.includes('up_to_100_books')) return 'pro';
            if (featuresClaim.includes('up_to_10_books')) return 'standard';
        }
    }

    // 2. Try Clerk Native Billing 'has' method (as backup)
    try {
        if (typeof has === 'function') {
            const isPro = await has({ product: 'pro' } as any);
            const isStandard = await has({ product: 'standard' } as any);
            
            if (isPro) return 'pro';
            if (isStandard) return 'standard';
        }
    } catch (error) {
        console.error("Error checking plan with has():", error);
    }

    // 3. Last Fallback: Direct Clerk API check via clerkClient
    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        
        const publicMetadata = (user.publicMetadata as any) || {};
        const privateMetadata = (user.privateMetadata as any) || {};
        
        const plan = publicMetadata.plan || publicMetadata.subscription || privateMetadata.plan || privateMetadata.subscription;
        
        if (plan === 'pro' || plan === 'u:pro') return 'pro';
        if (plan === 'standard' || plan === 'u:standard') return 'standard';
        
    } catch (error) {
        console.error("Error checking plan with clerkClient:", error);
    }
    
    return 'free';
}


/**
 * Server-side utility to get the limits associated with the current user's plan.
 */
export async function getPlanLimits(): Promise<PlanLimits> {
    const plan = await getUserPlan();
    return PLAN_LIMITS[plan];
}
