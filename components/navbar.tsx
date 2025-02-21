import { auth, signOut } from "@/auth";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton } from "@/components/buttons";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="">
      {!session?.user ? (
        <SignInButton />
      ) : (
        <div className="flex gap-2 items-center">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button variant={"ghost"}>Sign out</Button>
          </form>
          {session?.user?.role === "admin" && (
            <Link href={"/studio"}>
              <button className="mx-3 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8">
                Write a post
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
