'use server';

import { StartSessionResult } from "@/types"
import { connectToDatabase } from "@/database/mongoose";
import  VoiceSession  from "@/database/models/voiceSession.model";
import { getCurrentBillingPeriodStart } from "@/lib/subscription-constants";

export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {

    try {
        await connectToDatabase();

        // Limits/Plan to see whether the user can start a session
        

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart: getCurrentBillingPeriodStart(),
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
