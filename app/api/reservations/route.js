import getCurrentUser from "@/app/actions/getCurrentUser";
import dbConnect from "@/lib/mongooseClient"; // Import your MongoDB connection function
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("API call initiated...");

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    console.error("No current user found.");
    return NextResponse.error();
  }

  const body = await request.json();
  console.log("Request body:", body);

  const { listingId, startDate, endDate, totalPrice, startTime, endTime, totalHours, crewCount } = body;

  // Validate required fields
  if (!listingId || !startDate || !endDate || !startTime || !endTime || totalPrice === undefined || totalHours === undefined || crewCount === undefined) {
    console.error("Missing required fields:", {
      listingId, startDate, endDate, startTime, endTime, totalPrice, totalHours, crewCount,
    });
    return NextResponse.error();
  }

  // Convert startDate and endDate to Date objects
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  try {
    await dbConnect(); // Ensure the database connection is established
    const db = await dbConnect();
    const listingsCollection = db.collection("listings"); // Adjust collection name as necessary

    // Update the listing to add a reservation
    const reservation = await listingsCollection.findOneAndUpdate(
      { _id: listingId }, // Use MongoDB's _id field for the listing
      {
        $push: {
          reservations: {
            userId: currentUser.id,
            startDate: startDateTime,
            endDate: endDateTime,
            startTime, // Store time as string
            endTime,   // Store time as string
            totalHours, // Store total hours
            crewCount,
            totalPrice,
          },
        },
      },
      { returnOriginal: false, upsert: false } // Return the updated document, do not insert if not found
    );

    if (!reservation.value) {
      console.error("Reservation creation failed: Listing not found.");
      return NextResponse.error();
    }

    console.log("Reservation created successfully:", reservation.value);
    return NextResponse.json(reservation.value); // Return the updated listing with new reservation
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.error();
  }
}
