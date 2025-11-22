"use client";

import AnswerCard from "@/app/components/AnswerCard";
import CommentCard from "@/app/components/CommentCard";
import QuestionCard from "@/app/components/QuestionCard";
import { answerCollection, commentCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";
import { useAuthStore } from "@/store/auth";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

function AnswerDetails() {
  const [answer, setAnswer] = useState({});
  const [comments, setComments] = useState([]);
  const [content,setContent] = useState("")
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const {session} = useAuthStore()
  const { answerId } = useParams();
  const fetchAnswer = async () => {
    try {
      setPageLoading(true)
      const answer = await databases.getDocument(db, answerCollection, answerId);
      setAnswer(answer);
      console.log(answer)
    } catch (error) {
      console.log(error)
    }
  }
  const fetchComments = async () => {
    try {
      const comments = await databases.listDocuments(db, commentCollection, [
        Query.equal("type", "answer"),
        Query.equal("typeId",answerId)
      ]);
      setComments(comments.documents);
      console.log(comments);

    } catch (error) {
      console.log(error)
    } finally {
      setPageLoading(false)
    }
  }
  const handleSubmit = async (e) => { 
    setLoading(true)
    e.preventDefault();
    try {
      const res = await databases.createDocument(db, commentCollection, ID.unique(), {
        content,
        authorId:session.userId,
        type:"answer",
        typeId:answerId
      })
      toast.success("Comment added successfully")
      setContent("");
      fetchComments();
    } catch (error) {
      console.log(error)
      toast.error("Unable to comment on the answer")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnswer();
    fetchComments();
  }, [answerId])
  
  if (pageLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral">
        <Loader2 className="h-[25vh] w-[25vh] animate-spin text-6xl"> </Loader2>
      </div>
    );
  }
  return (
    <div className="bg-neutral min-h-screen">
      {/* Asnwer section */}
      <div>
        <h1 className="text-center text-3xl py-5">Answers</h1>
        {/* Getting asnwers from db  */}
        <AnswerCard answer={answer} />
      </div>

      {/* Comment section */}
      <div>
        <h1 className="text-center text-3xl py-5">Comments</h1>
        {comments.map((comment) => (
          <Fragment key={comment.$id}>
            <CommentCard comment={comment} />
          </Fragment>
        ))}
        <form className="flex justify-center py-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a comment"
            className="input input-bordered w-1/2"
            required
            value = {content}
            onChange={(e) => setContent(e.target.value)}
          />
          {loading ? (
            <button className="btn" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </button>
          ) : (
            <button className="btn" type="submit">
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AnswerDetails;
