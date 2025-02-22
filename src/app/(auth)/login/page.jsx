"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function LoginPage() {
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //collect data

    //* Returns form data as an object
    const formData = new FormData(e.currentTarget);

    //* Get all the fields
    //? Note that name given inside .get is the name of the form element <input type="text" name="firstname">

    const email = formData.get("email");
    const password = formData.get("password");

    //validate

    if (!email || !password) return setError(() => "All fields are required");

    //call the store func
    setLoading(() => true);
    setError(() => null);
    const response = await login(email.toString(), password.toString());
    
    //*This is my custom response sent from auth store
    if (response.error) {
      setError(() => response.error);
    }
    error
      ? toast.error(response.error || "Error registering")
      : toast.success("Login successful");

    setLoading(() => false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-slate-900">
      <div className="w-full max-w-md px-6 sm:px-0 ">
        {error && <p>{error}</p>}
        <h1 className="text-2xl font-bold font-sans mb-6 text-slate-900 ps-3 dark:text-white">Login</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="mb-4"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="mb-4"
          />
          {loading ? (
            <Button className="w-full " disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : (
            <Button type="submit" className="w-full ">
              Login
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
