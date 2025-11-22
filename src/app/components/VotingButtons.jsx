"use client";
import { db, votesCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function VotingButtons({ type, typeDetails }) {
  const [totalVotes,setTotalVotes] = useState(0)
  const {session} = useAuthStore()
  const handleVote = async (type,voteStatus) => {
    try {
      const res = await axios.post("/api/vote", {
        type,
        typeId: typeDetails.$id,
        voteById: session.userId,
        voteStatus
      })
      calculateVotes();
      toast.success(`${voteStatus} ${type} sucessfully`)
    } catch (error) {
      toast.error(error?.message || "Unable to vote")
    }
  }
  const calculateVotes = async () => {
    try {  
      const upvotes = await databases.listDocuments(db, votesCollection, [
        Query.equal("typeId", typeDetails.$id),
        Query.equal("type", type),
        Query.equal("voteStatus", "upvote"),
      ]);
      const downvotes = await databases.listDocuments(db, votesCollection, [
        Query.equal("typeId", typeDetails.$id),
        Query.equal("type", type),
        Query.equal("voteStatus", "downvote"),
      ]);

      setTotalVotes(Number(upvotes.total) - Number(downvotes.total))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(type && typeDetails) calculateVotes();
  },[])

  return (
    <div className="">
      <button
        className="btn block bg-transparent border-none hover:bg-transparent hover:border-none"
        onClick={() => {
          handleVote(type, "upvote");
        }}
      >
        <img src="/images/upvote.png" alt="" className="w-[40px]" />
      </button>
      <div>{totalVotes}</div>
      <button
        className="btn block bg-transparent border-none hover:bg-transparent hover:border-none"
        onClick={() => {
          handleVote(type, "downvote");
        }}
      >
        <img src="/images/downvote.png" alt="" className="w-[40px]" />
      </button>
    </div>
  );
}

export default VotingButtons;