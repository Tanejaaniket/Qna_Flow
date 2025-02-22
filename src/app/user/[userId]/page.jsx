"use client";
import ActivityCard from "@/app/components/ActivityCard";
import { account } from "@/models/client/config";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";
import { Query } from "node-appwrite";
import { useEffect, useState } from "react";

function Profile() {
  const { session } = useAuthStore();
  const [user, setUser] = useState({});
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [initials, setInitials] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchQuestion = async () => {
    const question = await databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", session?.userId),
    ]);
    setQuestions(question);
  };
  const fetchAnswer = async () => {
    const answer = await databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", session?.userId),
    ]);
    setAnswers(answer);
  };
  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await account.get(session?.userId);
      await fetchQuestion();
      await fetchAnswer();
      console.log(user);
      setUser(user);
      const name = user?.name;
      setInitials(name?.split(" ").map((n) => n.charAt(0).toUpperCase()));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (session) {
      console.log(session);
      fetchUser();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral">
        <Loader2 className="h-[25vh] w-[25vh] animate-spin text-6xl"> </Loader2>
      </div>
    );
  }
  return (
    <div className="bg-neutral">
      <div className="w-full grid grid-cols-3 bg-neutral min-h-[81vh]">
        {/* Profile pic and name section */}
        <div className="col-span-full py-6 md:col-span-1 ">
          {/* Image */}
          <div className="flex justify-center mb-5">
            <div className="h-[40vh] w-[40vh] rounded-full bg-orange-500 flex items-center justify-center text-6xl">
              {`${initials[0]}${initials[1]}`}
            </div>
          </div>

          {/* Name */}
          <div>
            <h1 className="text-center text-2xl py-4">{user.name}</h1>
          </div>

          {/* Joined */}
          <div>
            <p className="text-center">Joined on: {user.registration} </p>
          </div>
        </div>

        {/* Recent query section  */}
        <div className="col-span-full md:col-span-2">
          <h1 className="text-4xl font-bold text-center py-5">
            Your interactions
          </h1>

          {/* Recent queries as cards */}
          <div className="flex flex-col h-[50%] md:flex-row justify-evenly items-center">
            <div className="mb-5">
              <ActivityCard
                activityName="Reputation"
                activityDetails={user?.prefs?.reputation}
              />
            </div>
            <div className="mb-5">
              <ActivityCard
                activityName="Questions"
                activityDetails={questions?.total}
              />
            </div>
            <div className="mb-5">
              <ActivityCard
                activityName="Answered"
                activityDetails={answers?.total}
              />  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
