import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request) {
  try {
    const { questionId, answer, authorId } = await request.json();
    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        questionId,
        content: answer,
        authorId,
      }
    );
    // Inc author reputation(in prefs)
    const prefs = await users.getPrefs(authorId)
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { answerId } = await request.json();
    const answer = await databases.getDocument(db, answerCollection, answerId);
    if (!answer) {
      return NextResponse.json(
        {
          error: "Answer not found",
        },
        { status: 404 }
      );
    }
      
    const response = await databases.deleteDocument(db, answerCollection, answerId);
    
    // Dec author reputation(in prefs)
    const prefs = await users.getPrefs(answer.authorId);
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });
    
    return NextResponse.json(
      response,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || "Error deleting answer",
      },
      { status: 500 }
    );
  }
}
