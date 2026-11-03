import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-added-books" },
  { label: "My Borrows", href: "/my-borrow-books" },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "GitHub", href: "https://github.com", icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#f3d3c8] bg-[#ffe3da] text-neutral-800 dark:border-neutral-800 dark:bg-[#1a1a19] dark:text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/footer-icon.png" alt="BookNook logo" width={36} height={36} />
            <span className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
              BookNook
            </span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-400">
            Your cozy online library. Discover, borrow and share great books, all
            in one place.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-[#c8381a] hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c8381a]" />
              <span>Badda, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#c8381a]" />
              <a href="tel:+8801700000000" className="hover:underline">
                +880 1700-000000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-[#c8381a]" />
              <a href="mailto:hello@booknook.com" className="hover:underline">
                ayshaku11@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
            Follow Us
          </h3>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#c8381a] hover:text-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#c8381a]"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#f3d3c8] py-4 text-center text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-500">
        © {new Date().getFullYear()} BookNook. All rights reserved.
      </div>
    </footer>
  );
}