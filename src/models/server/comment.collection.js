import { IndexType, Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config"; //* Configured server database

export default async function createCommentCollection() {
  //create collection
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read("any"),
    Permission.create("users"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment collection created successfully");

  //creating attributes and indexes(searching)

  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
    //* Same as data types of C
    databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
  ]);
}
