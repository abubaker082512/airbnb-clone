import getCurrentUser from "@/app/actions/getCurrentUser";
import dbConnect from "@/lib/mongooseClient"; // Import your MongoDB connection function
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== "string") {
    console.error("Invalid Id");
    return NextResponse.error();
  }

  try {
    await dbConnect(); // Ensure the database connection is established
    const db = await dbConnect();
    const listingsCollection = db.collection("listings"); // Adjust collection name as necessary

    // Delete the reservation
    const result = await listingsCollection.updateOne(
      { "reservations._id": reservationId, 
        $or: [
          { userId: currentUser.id }, 
          { "listing.userId": currentUser.id }
        ] 
      },
      { $pull: { reservations: { _id: reservationId } } }
    );

    if (result.modifiedCount === 0) {
      console.error("No reservation found or you don't have permission to delete this reservation.");
      return NextResponse.error();
    }

    return NextResponse.json({ message: "Reservation deleted successfully." });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.error();
  }
}
