import {
  answerCollection,
  db,
  questionCollection,
  votesCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request) {
  try {
    const { type, typeId, voteById, voteStatus } = await request.json();

    console.log(type,typeId,voteById,voteStatus)
    const response = await databases.listDocuments(db, votesCollection, [
      Query.equal("voteById", voteById),
      Query.equal("typeId", typeId),
      Query.equal("type", type),
    ]);

    //*No vote exist (response.documents.length === 0)
    //Create a new document for the vote and inc or dec authors reputation. Remember vote can be on question or answer

    if (response.documents.length === 0) {
      const doc = await databases.createDocument(
        db,
        votesCollection,
        ID.unique(),
        {
          type,
          typeId,
          voteById,
          voteStatus,
        }
      );

      //Get these to get authorId to update author reputation
      const questionOrAsnwer = await databases.listDocuments(
        db,
        type === "question" ? questionCollection : answerCollection,
        [Query.equal("$id", typeId)]
      );

      const prefs = await users.getPrefs(questionOrAsnwer.documents[0]?.authorId);

      await users.updatePrefs(questionOrAsnwer.documents[0]?.authorId, {
        reputation:
          voteStatus === "upvote"
            ? Number(prefs?.reputation) + 1
            : Number(prefs?.reputation) - 1,
      });

      return NextResponse.json({...doc,message: "Vote created successfully"}, { status: 200 });
    }

    //*Vote status changed (different button is clicked)
    if(response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.updateDocument(db, votesCollection, response.documents[0].$id, {
        voteStatus: voteStatus
      })
      const questionOrAsnwer = await databases.listDocuments(
        db,
        type === "question" ? questionCollection : answerCollection,
        [Query.equal("$id", typeId)]
      );

      const prefs = await users.getPrefs(
        questionOrAsnwer.documents[0]?.authorId
      );

      await users.updatePrefs(questionOrAsnwer.documents[0]?.authorId, {
        reputation:
          voteStatus === "upvote"
            ? Number(prefs?.reputation) + 1
            : Number(prefs?.reputation) - 1,
      });

      return NextResponse.json(
        { ...doc, message: "Vote updated successfully" },
        { status: 200 }
      );
    }

    //*Vote removed (same button is clicked twice)
    if(response.documents[0]?.voteStatus === voteStatus) {
      const doc = await databases.deleteDocument(db, votesCollection, response.documents[0]?.$id)
      const questionOrAsnwer = await databases.listDocuments(
        db,
        type === "question" ? questionCollection : answerCollection,
        [Query.equal("$id", typeId)]
      );

      const prefs = await users.getPrefs(
        questionOrAsnwer.documents[0]?.authorId
      );

      await users.updatePrefs(questionOrAsnwer.documents[0]?.authorId, {
        reputation:
          voteStatus === "upvote"
            ? Number(prefs?.reputation) - 1
            : Number(prefs?.reputation) + 1,
      });

      return NextResponse.json(
        { ...doc, message: "Vote deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Something went wrong while updating vote" },
      { status: 500 }
    );
  }
}
