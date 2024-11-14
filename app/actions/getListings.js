import dbConnect from "@/lib/mongooseClient"; // Adjust the import path as necessary

export default async function getListings(params) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        $gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        $gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        $gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.$expr = {
        $not: {
          $elemMatch: {
            reservations: {
              $or: [
                {
                  endDate: { $gte: new Date(startDate) },
                  startDate: { $lte: new Date(startDate) },
                },
                {
                  startDate: { $lte: new Date(endDate) },
                  endDate: { $gte: new Date(endDate) },
                },
              ],
            },
          },
        },
      };
    }

    const db = await dbConnect();
    const listingsCollection = db.collection("Listing"); // Replace with your actual collection name

    const listings = await listingsCollection.find(query).sort({ createdAt: -1 }).toArray();

    // Convert listings to plain objects
    const safeListings = listings.map((list) => ({
      ...list,
      _id: list._id.toString(), // Convert ObjectId to string
      createdAt: list.createdAt.toISOString(), // Convert Date to ISO string
      // Optionally convert other nested or complex fields if necessary
    }));

    return safeListings;
  } catch (error) {
    throw new Error(error.message);
  }
}
