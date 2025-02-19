import { auth, signIn, signOut } from "@/auth";
import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = async () => {
  const session = await auth();
  const initial = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <nav className="">
      {!session?.user ? (
        <Link href={"/sign-in"}>
          <button className="mx-3 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8">
            Sign in
          </button>
        </Link>
      ) : (
        <div className="flex gap-2">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant={"ghost"}>Sign out</Button>
          </form>
          {/* <Avatar className="rounded-full">
            {session?.user?.image && (
              <AvatarImage
                src={session?.user?.image}
                className=" rounded-full"
              />
            )}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar> */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
