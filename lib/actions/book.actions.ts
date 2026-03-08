"use server";

import { CreateBook } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import { generateSlug } from "@/lib/utils";
import { serializeData } from "@/lib/utils";
import { TextSegment } from "@/types";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";


export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();
        const existingBook = await Book.findOne({ title }).lean();

        if (existingBook) {
            return { exists: true, data: serializeData(existingBook) };
        }
        
    } catch (error) {
        console.error('Error checking book existence:', error);
        return { exists: false, error };
    }
}


export const createBook = async (data: CreateBook) => {

    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        const existingBook = await Book.findOne({ slug }).lean();

        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true
            };
        }

        // TODO: Check subscription limits before creating book

        const book = await Book.create({ ...data, slug, totalSegments: 0 });


        return {
            success: true,
            data: serializeData(book),
        };
    } catch (error) {
        console.error('Error creating book:', error);

        return { success: false, error };
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {

    try {

        await connectToDatabase();

        console.log('Saving book segments ...');

        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            clerkId,
            bookId,
            content: text,
            segmentIndex,
            pageNumber,
            wordCount
        }));

        await BookSegment.insertMany(segmentsToInsert);

        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

        console.log('Book segments saved successfully');

        return { 
            success: true,
            data: { segmentsCreated: segments.length }
         };

    } catch (error) {
        console.error('Error saving book segments:', error);

        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
    }


}