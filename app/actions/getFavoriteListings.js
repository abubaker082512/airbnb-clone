import dbConnect from "@/lib/mongoClient"; // Adjust the import path to your MongoDB client connection
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // Connect to the database
    const db = await dbConnect();

    const favorites = await db.collection("listings").find({
      _id: {
        $in: currentUser.favoriteIds.map(id => new ObjectId(id)), // Convert IDs to ObjectId
      },
    }).toArray();

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(), // Convert to ISO string
    }));

    return safeFavorites;
  } catch (error) {
    throw new Error(error.message);
  }
}
