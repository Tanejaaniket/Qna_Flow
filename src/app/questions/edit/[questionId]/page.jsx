"use client";

import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { databases, storage } from "@/models/server/config";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";
import { useParams,useRouter } from "next/navigation";
import { AppwriteException, ID } from "node-appwrite";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EditQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");
  const { questionId } = useParams();
  const { session } = useAuthStore();
  const router = useRouter()

  const fetchQuestion = async () => {
    const question = await databases.getDocument(db, questionCollection, questionId);
    if (!question) {
      toast.error("No question found");
    }
    setTitle(question.title)
    setContent(question.content);
    setTags(question.tags.join(","));
    // if (question.attachmentId) {
    //   const file = await storage.getFile(questionAttachmentBucket, question.attachmentId);
    //   setFile(file)
    // }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(() => true);
    setError(() => null);
    try {
      const id = ID.unique();
      console.log(file)
      // if (file) {
      //   const response = await storage.createFile(
      //     questionAttachmentBucket,
      //     id,
      //     file
      //   );
      //   setFile({});
      //   console.log(response);
      // }
      console.log("Here")
      const questionDocument = await databases.updateDocument(
        db,
        questionCollection,
        questionId,
        {
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          authorId: session.userId,
          attachmentId: file ? id : null,
        }
      );
      console.log("question: ", questionDocument)
      
      setTags(() => "");
      setTitle(() => "");
      setContent(() => "");
      setFileName(() => "");
      setLoading(() => false);
      setError(() => null);

      toast.success("Question updated successfully");
      router.push(`/questions/${questionId}`);
    } catch (err) {
      setLoading(() => false);
      setError(() =>
        err instanceof AppwriteException
          ? err?.message
          : "Something went wrong while updating question"
      );
      console.log(err)
      toast.error(error);
    }
  };

  useEffect(
    () => {
      fetchQuestion();
    },[]
  )

  return (
    <div className="min-h-screen bg-neutral">
      <h1 className="text-center text-4xl font-bold py-6">Ask a question</h1>
      {/* Markdown editor */}

      <div className="flex justify-center">
        <form className="w-1/2 py-6 text-center" onSubmit={handleSubmit}>
          <label className="label">Title: </label>
          <input
            type="text"
            className="input input-bordered block w-full mb-5"
            placeholder="Enter question title*"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            required
          />
          <label className="label">Question: </label>

          <textarea
            className="textarea textarea-bordered w-full mb-5"
            height="30vh"
            placeholder="Enter your question*"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            required
          />

          <label className="label">Attachments: </label>
          <input
            type="file"
            className="file-input file-input-bordered block w-full mb-5"
            value={fileName}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setFileName(e.target.files[0].name);
            }}
          />

          <label className="label">Tags: </label>

          <input
            type="text"
            className="input input-bordered block w-full"
            placeholder="Enter tags seprated by commas (,)*"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
            }}
            required
          />
          {loading ? (
            <button className="btn my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
            </button>
          ) : (
            <button className="btn my-4" type="submit">
              Submit Question
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditQuestion;
