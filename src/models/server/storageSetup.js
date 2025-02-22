import { IndexType, Permission } from "node-appwrite";
import { db, questionAttachmentBucket } from "../name";
import { databases, storage } from "./config"; //* Configured server database

export default async function getOrCreateStorage() {
  try {
    //* Bucket means to store files
    //* If we failed to get bucket it will create a new bucket in catch
    
    await storage.getBucket(questionAttachmentBucket)
  } catch (error) {
    //create bucket
    await storage.createBucket(
      questionAttachmentBucket,
      questionAttachmentBucket,
      [
        Permission.read("any"),
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
      ],
      false,
      undefined,
      undefined,
      ["jpg","png","jpeg","webp","heic","gif"]
    );

    console.log("Storage create and connected");
    
  }
}
