"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Home", href: "/", protected: false },
  { label: "All Books", href: "/all-books", protected: false },
  { label: "Add Book", href: "/add-book", protected: true },
  { label: "My Books", href: "/my-added-books", protected: true },
  { label: "My Borrows", href: "/my-borrow-books", protected: true },
];

const btn =
  "inline-flex h-[38px] items-center justify-center rounded border border-white px-4 text-[13px] font-semibold text-white transition hover:bg-white hover:text-[#141413] md:min-w-[176px]";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Hide login-only links from logged-out visitors
  const visibleLinks = links.filter((l) => !l.protected || user);

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-t-2 border-[#3a2f3d] bg-[#141413] text-white">
      <nav className="relative mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-4 lg:gap-12 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[22px] font-medium"
        >
          <Image
            src="/nav-icon.png"
            alt="BookNook logo"
            width={40}
            height={40}
            priority
          />
          <span>BookNook</span>
        </Link>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-20 flex-col border-t border-neutral-700 bg-[#141413] lg:static lg:flex lg:flex-row lg:gap-7 lg:border-0 lg:bg-transparent`}
        >
          {visibleLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block border-b-2 px-5 py-3.5 text-[13px] font-semibold transition-colors hover:border-[#ff9f1b] lg:px-0 lg:py-1 ${
                  pathname === l.href
                    ? "border-[#ff9f1b]"
                    : "border-transparent"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger (mobile only) */}
        <button
          className="ml-auto p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="flex items-center gap-3 lg:ml-auto">
          {isPending ? null : user ? (
            <>
              <Popover>
                <PopoverTrigger className="rounded-full outline-none">
                  {/* <button className="rounded-full outline-none"> */}
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user.image ?? undefined}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* </button> */}
                </PopoverTrigger>

                <PopoverContent className="w-64">
                  <PopoverHeader>
                    <PopoverTitle>{user.name}</PopoverTitle>
                    <PopoverDescription>{user.email}</PopoverDescription>
                  </PopoverHeader>
                  <Link
                    href="/profile"
                    className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-cyan-400"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="mt-3 w-full"
                  >
                    Sign out
                  </Button>
                  <ThemeToggle/>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Link href="/login" className={btn}>
                Login
              </Link>
              <Link href="/signup" className={btn}>
                Register
              </Link>
              <ThemeToggle/>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
