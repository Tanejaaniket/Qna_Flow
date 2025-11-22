"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //collect data

    //* Returns form data as an object
    const formData = new FormData(e.currentTarget);

    //* Get all the fields
    //? Note that name given inside .get is the name of the form element <input type="text" name="firstname">

    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const password = formData.get("password");

    //validate

    if (!firstname || !lastname || !email || !password)
      return setError(() => "All fields are required");

    //call the store func
    setLoading(() => true);
    setError(() => null);
    const response = await createAccount(
      `${firstname} ${lastname}`,
      email.toString(),
      password.toString()
    );
    console.log(response);
    
    if (response.error) {
      setError(() => response.error || "Error registering");
    }
    error ? toast.error(response.error || "Error registering"): toast.success("Registration successful");
    setLoading(() => false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-slate-900">
      <div className="w-full max-w-md px-6 sm:px-0 ">
        {error && <p>{error}</p>}
        <h1 className="text-2xl font-bold font-sans mb-6 text-slate-900 ps-3 dark:text-white">
          Sign up
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
          <Input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="mb-4 w-[48%] "
          />
            <Input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="mb-4 w-[48%]"
          />
          </div>
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
              Register
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
