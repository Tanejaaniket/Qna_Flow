import VotingButtons from "./VotingButtons";


function CommentCard({ comment }) {
  if(!comment) return null
  return (
    <div className="text-center flex justify-center mb-4">
      <div className=" bg-slate-600 w-[45%] rounded-lg py-2">
        <p>{comment.content}</p>
        <div className="flex justify-center">
          <p className="px-4">Commented on: { comment.$createdAt} </p>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
