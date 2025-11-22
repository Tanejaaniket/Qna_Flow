"use client";

import AnswerCard from "@/app/components/AnswerCard";
import CommentCard from "@/app/components/CommentCard";
import QuestionCard from "@/app/components/QuestionCard";
import {
  answerCollection,
  commentCollection,
  db,
  questionCollection,
  votesCollection,
} from "@/models/name";
import { databases } from "@/models/server/config";
import { useAuthStore } from "@/store/auth";
import MarkdownEditor from "@uiw/react-markdown-editor";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

function QuestionDetails() {
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [question, setQuestion] = useState({});
  const [asnwers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { session } = useAuthStore();
  const { questionId } = useParams();

  const fetchQuestion = async () => {
    try {
      const res = await databases.getDocument(db, questionCollection, questionId);
      setQuestion(res);
    } catch (error) {
      console.log(error)
    }
  };

  const fetchAnswers = async () => {
    try {
      const res = await databases.listDocuments(db, answerCollection, [
        Query.equal("questionId", questionId),
      ]);
      setAnswers(res.documents);
    } catch (error) {
      console.log(error)
    }
  };

  const fetchComments = async () => {
    try {
      const res = await databases.listDocuments(db, commentCollection, [
        Query.equal("typeId", questionId),
        Query.equal("type", "question"),
      ]);
      setComments(res.documents);
      setPageLoading(false);
    } catch (error) {
      console.log(error)
    }
  };

  const submitAnswer = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/answer", {
        authorId: session.userId,
        questionId,
        answer,
      });
      toast.success("Answer created successfully");
      setAnswer("");
    } catch (error) {
      toast.error(error?.error || "Error answering question");
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    try {
      setLoading(true);
      const res = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content: comment,
          typeId: questionId,
          type: "question",
          authorId: session.userId,
        }
      );
      toast.success("Comment created successfully");
      setComment("");
    } catch (error) {
      toast.error(error?.message || "Error commenting on question");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
    fetchComments();
  }, [questionId, loading]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral">
        <Loader2 className="h-[25vh] w-[25vh] animate-spin text-6xl"> </Loader2>
      </div>
    );
  }
  return (
    <div className="bg-neutral ">
      <h1 className="text-center text-3xl py-5">Question Details</h1>
      <QuestionCard question={question} />

      {/* Asnwer section */}
      <div>
        <h1 className="text-center text-3xl py-5">Answers</h1>

        {/* Getting asnwers from db  */}
        {asnwers.map((ans, index) => (
          <Fragment key={ans.$id}>
            <AnswerCard answer={ans} />
          </Fragment>
        ))}

        {/* Md editor */}
        <div className="flex justify-center">
          <div className="w-2/3 py-6 text-center">
            <MarkdownEditor
              previewWidth="50%"
              height="30vh"
              value={answer}
              onChange={(value, viewUpdate) => {
                setAnswer(value);
              }}
            />
            {loading ? (
              <button className="btn my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </button>
            ) : (
              <button className="btn my-4" onClick={submitAnswer}>
                Submit answer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comment section */}
      <div>
        <h1 className="text-center text-3xl py-5">Comments</h1>
        {comments.map((comment, index) => (
          <Fragment key={comment.$id}>
            <CommentCard comment={comment} />
          </Fragment>
        ))}
        <div className="flex justify-center py-4">
          <input
            type="text"
            placeholder="Add a comment"
            className="input input-bordered w-1/2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {loading ? (
            <button className="btn" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </button>
          ) : (
            <button className="btn" onClick={submitComment}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionDetails;
