//* How wil client connect to the appwrite
//* Appwrite is similar to firebase

import { Client, Account, Avatars, Databases, Storage } from "appwrite";

export const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
export { ID } from "appwrite";
