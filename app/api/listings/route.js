import getCurrentUser from "@/app/actions/getCurrentUser";
import dbConnect from "@/lib/mongooseClient"; // Import your MongoDB connection function
import { NextResponse } from "next/server";

export async function POST(request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price,
    } = body;

    // Validate the request body to ensure all required fields are present
    for (const value of Object.values(body)) {
        if (!value) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }
    }

    try {
        await dbConnect(); // Connect to the MongoDB database

        const db = await dbConnect();
        const listingsCollection = db.collection("Listing");

        const newListing = {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id,
            minimumBookingLength: parseInt(price, 10),  // Assuming this is the intended logic
            crewCount,  // Make sure to define this variable or remove it if not needed
            areats,     // Make sure to define this variable or remove it if not needed
            createdAt: new Date(), // Optional: Add createdAt field for tracking
        };

        const result = await listingsCollection.insertOne(newListing); // Insert the new listing into MongoDB

        return NextResponse.json(result.ops[0]); // Return the newly created listing
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
