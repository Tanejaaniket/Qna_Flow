"use client";

import { answerCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EditAnswer() {
  const { answerId } = useParams();
  const [answer,setAnswer] = useState({});
  const [content,setContent] = useState(answer.content);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter()
  const fetchAnswer = async () => {
    try {
      const answer = await databases.getDocument(db, answerCollection, answerId);
      console.log(answer);
      setAnswer(answer)
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await databases.updateDocument(db, answerCollection, answerId, {
        content
      });
      toast.success("Answer updated successfully")
      console.log(res);
      router.push(`/questions/${answer.questionId}`)
    } catch (error) {
      console.log(error);
      toast.error("Unable to update answer")
    }
  }
  useEffect(() => {
    fetchAnswer();
  }, [answerId]);

    if (pageLoading) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-neutral">
          <Loader2 className="h-[25vh] w-[25vh] animate-spin text-6xl">
            {" "}
          </Loader2>
        </div>
      );
    }
  return (
    <div className="min-h-screen bg-neutral">
      <h1 className="text-center text-4xl font-bold py-6">Edit your Asnwer</h1>
      {/* Markdown editor */}
      <div className="flex justify-center">
        <div className="w-2/3 py-6 text-center">
          <MarkdownEditor
            previewWidth="50%"
            height="30vh"
            value={content}
            onChange={(value) => setContent(value)}
          />
          <button className="btn my-4" onClick={handleSubmit}>Submit Answer</button>
        </div>
      </div>
    </div>
  );
}

export default EditAnswer;
