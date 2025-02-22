import MarkdownEditor from "@uiw/react-markdown-editor";
import VotingButtons from "./VotingButtons";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

function AnswerCard({ answer }) {
  const { session } = useAuthStore();
  const { answerId } = useParams();
  const router = useRouter();
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/answer`, {
        data: {
          answerId: answer.$id,
        },
      })
      console.log(res)
      //TODO:Deleting all comments
      toast.success("Answer deleted successfully")
      router.push(`/questions/${answer.questionId}`)
    } catch (error) {
      console.log(error)
      toast.error("Unable to delete answer")
    }
  }

  if (!answer) return null;
  if (!answerId) {
    return (
      <Link href={`/answer/${answer.$id}`}>
        <div className="text-center flex justify-center mb-4">
          <VotingButtons type={"answer"} typeDetails={answer} />
          <div className=" bg-slate-600 w-[45vw] rounded-lg py-2">
            <MarkdownEditor.Markdown
              //So md editor doesn't allow links
              allowElement={
                (element) => {
                  if (element.tagName == "a") return false
                  return true
                }
              }
              source={answer.content}
              className="bg-slate-600"
            />
            <div className="flex justify-center">
              <p className="px-4">Answered on: {answer.$createdAt}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <div className="text-center flex justify-center mb-4">
        <VotingButtons type={"answer"} typeDetails={answer} />
        <div className=" bg-slate-600 w-[45vw] rounded-lg py-2">
          <MarkdownEditor.Markdown
            source={answer.content}
            className="bg-slate-600"
          />
          <div className="flex justify-center">
            <p className="px-4">Answered on: {answer.$createdAt}</p>
          </div>
          {session.userId == answer.authorId && (
            <div className="flex justify-center my-4">
              <button className="btn mx-4" onClick={handleDelete}>Delete</button>
              <Link href={`/answer/edit/${answer.$id}`} className="btn mx-4">Edit</Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AnswerCard;
