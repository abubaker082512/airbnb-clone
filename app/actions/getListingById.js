import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongooseClient"; // Adjust the import path to your MongoDB client connection

async function getListingById(params) {
  try {
    const { listingId } = params;

    // Connect to the database
    const db = await dbConnect();

    // Find the listing by ID
    const listing = await db.collection("Listing").findOne({
      _id: new ObjectId(listingId),
    });

    if (!listing) {
      return null;
    }

    // Optionally include user information if required
    const user = await db.collection("users").findOne({
      _id: new ObjectId(listing.userId), // Assuming userId is stored in listing
    });
    console.log('Params:', params);

    return {
      ...listing,
      _id: listing._id.toString(), // Convert _id to string
      createdAt: listing.createdAt.toISOString(), // Convert Date to ISO string
      user: user
        ? {
            ...user,
            _id: user._id.toString(), // Convert _id to string
            createdAt: user.createdAt.toISOString(), // Convert Date to ISO string
            updatedAt: user.updatedAt.toISOString(), // Convert Date to ISO string
            emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null, // Convert optional Date to string or null
          }
        : null,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getListingById;
