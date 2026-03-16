"use server";

import { StartSessionResult } from "@/types"
import { connectToDatabase } from "@/database/mongoose";
import  VoiceSession  from "@/database/models/voiceSession.model";
import { getCurrentBillingPeriodStart } from "@/lib/subscription-constants";
import { getPlanLimits } from "@/lib/subscription";


export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {

    try {
        await connectToDatabase();

        // Check subscription limits
        const limits = await getPlanLimits();
        const billingPeriodStart = getCurrentBillingPeriodStart();
        
        const sessionCount = await VoiceSession.countDocuments({
            clerkId,
            billingPeriodStart
        });

        if (sessionCount >= limits.maxSessionsPerMonth) {
            return {
                success: false,
                error: `You've reached your monthly session limit of ${limits.maxSessionsPerMonth}. Please upgrade for more sessions.`,
            };
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0,
        });

            
        return {
            success: true,
            sessionId: session._id.toString(),
            //SessionMinutes: check.maxSessionMinutes,
            
        }
    } catch (error) {
        console.error("Failed to start voice session", error);
        return {
            success: false,
            error: "Failed to start voice session. Please try again.",
        };
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<{ success: boolean }> => {
    try {
        await connectToDatabase();

        const updatedSession = await VoiceSession.findByIdAndUpdate(
            sessionId,
            {
                endedAt: new Date(),
                durationSeconds,
            },
            { new: true }
        );

        if (!updatedSession) {
            console.error("Voice session not found", sessionId);
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to end voice session", error);
        return { success: false };
    }
}
