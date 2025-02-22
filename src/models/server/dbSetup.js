//*Calls all the functions of creating collection and creates a DB

import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import { databases } from "./config";
import createQuestionCollection from "./questions.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDatabase() {
  try {
    //*Checks if database exists
    await databases.get(db)
    console.log("Database connected");
    
  } catch (error) {
    try {
      // Created db and all collection in it
      await databases.create(db, db)
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ])
      console.log("Database created and connected");
      
    } catch (error) {
      console.log("Error creating database",error);
      
    }
  }
  return databases

}