"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const btn =
  "inline-flex h-[38px] items-center justify-center rounded border border-white px-4 text-[13px] font-semibold text-white transition hover:bg-white hover:text-[#141413] md:min-w-[176px]";

// Pass `user` ({ name, photo }) when logged in; leave it out to show Login/Register.
export default function Navbar({ user = null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-t-2 border-[#3a2f3d] bg-[#141413] text-white">
      <nav className="relative mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-4 lg:gap-12 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[22px] font-medium">
          <Image src="/nav-icon.png" alt="BookNook logo" width={40} height={40} priority />
          <span>BookNook</span>
        </Link>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-20 flex-col border-t border-neutral-700 bg-[#141413] lg:static lg:flex lg:flex-row lg:gap-7 lg:border-0 lg:bg-transparent`}
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block border-b-2 px-5 py-3.5 text-[13px] font-semibold transition-colors hover:border-[#ff9f1b] lg:px-0 lg:py-1 ${
                  pathname === l.href ? "border-[#ff9f1b]" : "border-transparent"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((m) => !m)}
                aria-label="User menu"
                className="h-[42px] w-[42px] overflow-hidden rounded-full border-2 border-white"
              >
                <img
                  src={user.photo || "/nav-icon.png"}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </button>
              {menu && (
                <div className="absolute right-0 top-[52px] flex min-w-[180px] flex-col gap-2 rounded-md border border-neutral-700 bg-[#1f1f1e] p-3">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <Link
                    href="/profile"
                    onClick={() => setMenu(false)}
                    className="text-[13px] hover:text-[#ff9f1b]"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => setMenu(false)}
                    className="text-left text-[13px] hover:text-[#ff9f1b]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={btn}>Login</Link>
              <Link href="/register" className={btn}>Register</Link>
            </>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex flex-col gap-[5px] lg:hidden"
          >
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-6 bg-white" />
          </button>
        </div>
      </nav>
    </header>
  );
}