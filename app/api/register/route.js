import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongooseClient"; // Import your MongoDB connection function
import { NextResponse } from "next/server";

export async function POST(request) {
    const body = await request.json();
    const { email, name, password } = body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await dbConnect(); // Connect to the MongoDB database

        const db = await dbConnect();
        const usersCollection = db.collection("users");

        // Create a new user in the MongoDB collection
        const user = await usersCollection.insertOne({
            email,
            name,
            hashedPassword,
            createdAt: new Date(), // Optional: Add createdAt field for tracking
        });

        // Return the newly created user
        return NextResponse.json({ id: user.insertedId, email, name, createdAt: new Date() });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
