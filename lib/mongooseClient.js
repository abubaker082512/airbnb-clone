// lib/mongooseClient.js
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/** 
 * Global is used here to maintain a cached connection in development, 
 * otherwise Next.js would reinitialize the connection on every request.
 */
let client;
let db;

async function dbConnect() {
  if (db) return db; // Return the existing db if connected

  try {
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    db = client.db(); // Use the database from the connection string
    return db; // Return the db instance
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw new Error("Database connection failed");
  }
}

export default dbConnect;
