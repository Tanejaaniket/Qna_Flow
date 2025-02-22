"use client";

import { useEffect, useState } from "react";
import VotingButtons from "./VotingButtons";
import { databases } from "@/models/server/config";
import { answerCollection, db, votesCollection } from "@/models/name";
import { Query } from "node-appwrite";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useParams, useRouter } from "next/navigation";

function QuestionCard({ question }) {
  const [answers, setAnswers] = useState([]);
  const [votes, setVotes] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const { questionId } = useParams();
  const { session } = useAuthStore();
  const router = useRouter();

  const fetchVotes = async () => {
    try {
      const votes = await databases.listDocuments(db, votesCollection, [
        Query.equal("type", "question"),
        Query.equal("typeId", question.$id),
      ]);

      if (votes) {
        setVotes(votes.documents);
      } else {
        setVotes([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAnswers = async () => {
    try {
      const answer = await databases.listDocuments(db, answerCollection, [
        Query.equal("authorId", question.authorId),
        Query.equal("questionId", question.$id),
      ]);
      if (answer) {
        setAnswers(answer.documents);
      } else {
        setAnswers([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (question) {
      fetchVotes();
      fetchAnswers();
      if (question.authorId === session.userId) {
        setIsAuthor(true);
      }
    }
  }, [question]);
  if (!questionId) {
    return (
      <Link href={`/questions/${question.$id}`}>
        <div className="text-center flex justify-center">
          <VotingButtons type={"question"} typeDetails={question} />
          <div className="bg-slate-600 grid grid-cols-6 text-white w-1/2 rounded-lg py-5 mb-4">
            <div className="col-span-1 py-3">
              <p>Answers: {answers.length}</p>
              <p>Votes: {votes.length}</p>
            </div>
            <div className="col-span-5">
              <h1 className="text-2xl py-3">{question.title}</h1>
              <div className="flex justify-center">
                <p className="px-4">Asked on: {question.$createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <div className="text-center flex justify-center">
        <VotingButtons type={"question"} typeDetails={question} />
        <div className="bg-slate-600 grid grid-cols-6 text-white w-1/2 rounded-lg py-5 mb-4">
          <div className={isAuthor ? "col-span-5" : "col-span-6"}>
            <h1 className="text-4xl py-3">{question.title}</h1>
            <p className="pb-5 text-lg">{question.content}</p>
            <div className="flex justify-center border-t-2 pt-5">
              <p className="px-4">Asked on: {question.$createdAt}</p>
              <p className="px-4">Answers: {answers.length}</p>
              <p className="px-4">Votes: {votes.length}</p>
            </div>
          </div>
          {isAuthor && (
            <div className="col-span-1 flex items-center justify-center">
              <button
                className="btn z-50"
                onClick={() => {
                  router.push(`/questions/edit/${question.$id}`);
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default QuestionCard;
