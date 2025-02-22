"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <div className=" text-white bg-neutral pb-4">
      <div className="h-[100vh] flex rounded-lg">
        <div className="w-1/2 flex items-center justify-center">
          <div>
            <p className="text-7xl mb-4">Want to ask anything?</p>
            <p className="text-xl ps-4">Lets ask the community</p>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center ">
          <div className="px-2">
            {/* Looks inside public folder  */}
            <img src="/images/landing-img.jpeg" className="image-full" />
          </div>
        </div>
      </div>
      <div className="h-[75vh] text-white bg-base-200 rounded-xl mx-2 flex items-center">
          <div className="text-center pt-6">
          <p className="text-7xl mb-8">Why choose us?</p>
          <p className="px-4 pt-7 text-balance text-xl sm:px-[30%]" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur itaque magnam harum minima, autem fuga nulla est qui voluptas nam atque esse ullam suscipit, temporibus porro quam molestiae ex expedita adipisci asperiores labore! Assumenda, rerum quos voluptate, dolore totam distinctio est itaque omnis ad, deserunt laudantium asperiores! Dolore vel quibusdam id fugit sed porro, consequuntur officiis, ex ducimus, nam optio.
          </p>
        </div>
      </div>
    </div>
  );
}
