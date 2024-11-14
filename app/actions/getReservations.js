import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongooseClient"; // Adjust the import path to your MongoDB client connection

async function getReservation(params) {
  try {
    const { listingId, userId, authorId } = params;

    const query = {};

    if (listingId) {
      query.listingId = new ObjectId(listingId);
    }

    if (userId) {
      query.userId = new ObjectId(userId);
    }

    if (authorId) {
      query.listing = { userId: new ObjectId(authorId) }; // Adjust based on your schema
    }

    console.log("Query:", query);

    // Connect to the database
    const db = await dbConnect();

    // Fetch reservations based on the query
    const reservations = await db.collection("Reservation").find(query).toArray();

    // Log the raw reservation data
    console.log("Reservations from DB:", reservations);

    const safeReservations = reservations.map((reservation) => {
      return {
        ...reservation,
        _id: reservation._id.toString(),
        userId: reservation.userId?.toString(),
        listingId: reservation.listingId?.toString(),
        createdAt: reservation.createdAt ? new Date(reservation.createdAt).toISOString() : null,
        startDate: reservation.startDate ? new Date(reservation.startDate).toISOString() : null,
        endDate: reservation.endDate ? new Date(reservation.endDate).toISOString() : null,
        listing: {
          ...(reservation.listing || {}),
          userId: reservation.listing?.userId?.toString(),
          createdAt: reservation.listing?.createdAt ? new Date(reservation.listing.createdAt).toISOString() : null,
        },
      };
    });
    
    
    return safeReservations;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getReservation;
