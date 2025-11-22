//* Appwrite is similar to firebase
import { Client, Avatars, Databases, Storage, Users } from "node-appwrite";

let client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL) // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) // Your project ID
  .setKey(process.env.APPWRITE_API_KEY); // Your secret API key

//* They are like firebase utilities auth firestore storage etc.
export const users = new Users(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

export { client };
