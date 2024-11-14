import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import dbConnect from "@/lib/mongooseClient"; // Ensure you have your MongoDB connection function

export async function DELETE(request, { params }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
    }

    try {
        await dbConnect(); // Connect to the MongoDB database

        const db = await dbConnect();
        const listingsCollection = db.collection("Listing");

        const result = await listingsCollection.deleteMany({
            _id: new ObjectId(listingId), // Use ObjectId for the MongoDB ID
            userId: currentUser.id,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "No listing found or not authorized to delete" }, { status: 404 });
        }

        return NextResponse.json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.error("Error deleting listing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
