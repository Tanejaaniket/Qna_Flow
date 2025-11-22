"use client";

import MarkdownEditor from "@uiw/react-markdown-editor";
import QuestionCard from "../components/QuestionCard";
import { Fragment, useEffect, useState } from "react";
import { databases } from "@/models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  votesCollection,
} from "@/models/name";
import { Equal, Loader2 } from "lucide-react";
import { Query } from "node-appwrite";
import NoContentFound from "../components/NoContentFound";
import { account } from "@/models/client/config";

function Question() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  const fetchQuestion = async () => {
    try {
      setLoading(true)
      const ques = await databases.listDocuments(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.orderDesc("$updatedAt"),
        Query.limit(10),
      ]);
      setQuestions(ques.documents);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchQuestion();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral">
        <Loader2 className="h-[25vh] w-[25vh] animate-spin text-6xl"> </Loader2>
      </div>
    );
  }
  return (
    <div className="bg-neutral min-h-screen">
      {/* Search bar */}
      <div>
        <div className="form-control text-center inline-block w-full py-5">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-1/3 py-2"
          />
          <button className="btn">Search</button>
        </div>
      </div>

      <h1 className="text-center text-3xl py-4 mb-5">Explore questions</h1>
      {/* Questions  Props todo*/}
      {questions.length > 0 ? (
        questions.map((ques, index) => (
          <Fragment key={index}>
            <QuestionCard
              question={ques}
            />
          </Fragment>
        ))
      ) : (
        <NoContentFound />
      )}
    </div>
  );
}

export default Question;
