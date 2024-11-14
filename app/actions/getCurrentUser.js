import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongooseClient"; // Adjust the path as necessary

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    // Connect to the database using the dbConnect function
    const db = await dbConnect(); // dbConnect already handles the connection
    const usersCollection = db.collection("users"); // Use the connected db instance

    const currentUser = await usersCollection.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return null;
    }

    /* // Log currentUser to inspect its structure
      console.log("Current User:", currentUser); */

    // Convert ObjectId to string and format dates
    return {
      _id: currentUser._id.toString(), // Convert ObjectId to string
      email: currentUser.email,
      name: currentUser.name,
      createdAt: currentUser.createdAt ? currentUser.createdAt.toISOString() : null,
      updatedAt: currentUser.updatedAt ? currentUser.updatedAt.toISOString() : null,
      emailVerified: currentUser.emailVerified ? currentUser.emailVerified.toISOString() : null,
    };
  } catch (error) {
    console.log("Error in getCurrentUser:", error);
  }
}
