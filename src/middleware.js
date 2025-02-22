import { NextResponse } from "next/server";
import getOrCreateDatabase from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";


// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  await Promise.all([
    getOrCreateDatabase(),
    getOrCreateStorage()
  ])

  //*Move to next middleware don't redirect anywhere 

  return NextResponse.next();
}

// See "Matching Paths" below to learn more

//* Where ever path match this middleware will NOT run
export const config = {
  matcher: [
    //*ChatGPT ka kmaal 

    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ]
};
