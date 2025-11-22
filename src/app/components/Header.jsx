"use client";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import toast from "react-hot-toast";

function Header() {
  const { logout, session } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Error logging out");
    }
  };
  return (
    <div className="navbar bg-base-100 py-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/questions">Questions</Link>
            </li>

            {/* Logout button if session is there else login button */}
            {session ? (
              <>
                {" "}
                <li>
                  <Link href={`/question/ask`}>Ask question</Link>
                </li>
                <li>
                  <Link href={`/user/${session.$id}`}>Profile</Link>
                </li>
                <li>
                  <button
                    className="btn btn-error text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          QnaFlow
        </Link>
      </div>
      <div className="navbar-center hidden w-[40%] lg:flex ">
        <ul className="menu menu-horizontal text-xl flex w-full justify-evenly">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/questions">Questions</Link>
          </li>
          {session && (
            <>
              <li>
                <Link href={`/question/ask`}>Ask question</Link>
              </li>
              <li>
                <Link href={`/user/${session.userId}`}>Profile</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="navbar-end">
        {session ? (
          <button className="btn bg-red-600 text-white" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link className=" text-white me-3" href="/login">
              Login
            </Link>

            <Link className="btn btn-s btn-info text-white" href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
