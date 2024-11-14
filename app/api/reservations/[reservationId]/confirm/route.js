import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongooseClient"; // Adjust path to your MongoDB connection utility

export async function PUT(request, { params }) {
    const { reservationId } = params;

    try {
        const db = await dbConnect();
        const reservationsCollection = db.collection("Reservation");

        // Update the status of the reservation to "confirmed"
        const result = await reservationsCollection.updateOne(
            { _id: new ObjectId(reservationId) },
            { $set: { status: "confirmed" } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Reservation confirmed" }, { status: 200 });
    } catch (error) {
        console.error("Error confirming reservation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
