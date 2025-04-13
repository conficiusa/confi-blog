import { auth, signOut } from "@/auth";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton } from "@/components/buttons";
import { User } from "lucide-react";

const Navbar = async () => {
	const session = await auth();
	const isAdmin = session?.user?.role === "admin";
	const isEditor = session?.user?.role === "editor";

	return (
		<nav className=''>
			{!session?.user ? (
				<SignInButton />
			) : (
				<div className='flex gap-2 items-center'>
					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>
						<Button variant={"ghost"}>Sign out</Button>
					</form>

					{/* Admin-only section */}
					{isAdmin && (
						<Link href={"/admin"} className='flex items-center'>
							<Button variant='ghost' className='gap-1'>
								<User className='h-4 w-4' />
								Admin
							</Button>
						</Link>
					)}

					{/* Available to both admin and editor */}
					{(isAdmin || isEditor) && (
						<Link href={"/studio"}>
							<button className='mx-3 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8'>
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
