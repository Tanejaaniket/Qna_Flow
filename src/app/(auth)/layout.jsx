//* Wraps all the pages in the auth folder (Like master page in react)
"use client" //* Necessary for using react hooks
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Layout({ children }) {
  const { session } = useAuthStore();
  const router = useRouter()
  
  //* If there is any exsisting session push user out of auth
  useEffect(() => {
    if (session) router.push("/")
  },[session,router])

  if (session) return null;
  //* return children if no session
  return (
    <div className="">
      <div className="">{ children }</div>
    </div>
  );
}

export default Layout;