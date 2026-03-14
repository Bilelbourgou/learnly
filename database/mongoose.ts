import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

let cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });


export const connectToDatabase = async () => {
    if (!MONGODB_URI) {
        throw new Error("Please add your MongoDB URI to .env.local");
    }
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const sanitizedUri = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
        console.log(`[Mongoose] Connecting to: ${sanitizedUri}`);
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("[Mongoose] Successfully connected to database");
    } catch (e) {
        console.error("[Mongoose] Connection error:", e);
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};


