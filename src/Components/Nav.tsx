"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton,UserButton,SignedIn,SignedOut } from "@clerk/nextjs";


export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center items-center gap-4 p-4 ">
      <Link 
      href="/"
      className={pathname === "/" ? "font-bold underline" : "text-indigo-600"}
      >Home</Link>
      <SignedOut>
           <SignInButton mode="modal"/>
      </SignedOut>
     <SignedIn>
     <UserButton/>
     </SignedIn>
       
    </nav>
  )}