import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Landmark,
  Baby,
  Drama,
  Skull,
  Library,
} from "lucide-react";

const categories = [
  { name: "Fiction", icon: BookOpen, blurb: "Stories that pull you in" },
  { name: "Science", icon: FlaskConical, blurb: "Ideas that explain the world" },
  { name: "History", icon: Landmark, blurb: "Learn from the past" },
  { name: "Kids", icon: Baby, blurb: "Fun reads for young minds" },
  { name: "Drama", icon: Drama, blurb: "Emotion on every page" },
  { name: "Thriller", icon: Skull, blurb: "Edge-of-your-seat suspense" },
];

export default function TopCategories() {
  return (
    <section className="bg-white py-14 dark:bg-[#1a1a19]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl">
            Top Categories
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Pick a genre and start exploring.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/all-books?category=${c.name}`}
              className="group flex flex-col items-center rounded-3xl bg-[#fff4ef] p-6 text-center transition hover:-translate-y-1 hover:bg-[#ffe3da] hover:shadow-md dark:bg-[#141413] dark:hover:bg-[#2a1f1c]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#c8381a] shadow-sm transition group-hover:scale-110 dark:bg-neutral-800">
                <c.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-3 font-bold text-neutral-900 dark:text-white">
                {c.name}
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                {c.blurb}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}