import { IndexType, Permission } from "node-appwrite";
import { db, votesCollection } from "../name";
import { databases } from "./config"; //* Configured server database

export default async function createVoteCollection() {
  //create collection
  await databases.createCollection(db, votesCollection, votesCollection, [
    Permission.read("any"),
    Permission.create("users"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Votes collection created successfully");

  //creating attributes and indexes(searching)

  await Promise.all([
    databases.createStringAttribute(
      db,
      votesCollection,
      "voteById",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      votesCollection,
      "typeId",
      50,
      true
    ),
    databases.createEnumAttribute(db,votesCollection,"voteStatus",["upvote","downvote"],true),
    databases.createEnumAttribute(db,votesCollection,"type",["question","answer"],true)
  ]);
}
