import { UserPlus, Search, BookMarked, Undo2 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create an account",
    text: "Register for free or log in to unlock borrowing and your own shelf.",
  },
  {
    icon: Search,
    title: "Find a book",
    text: "Browse all books or filter by category to find your next read.",
  },
  {
    icon: BookMarked,
    title: "Borrow it",
    text: "Hit Borrow on the details page. It lands in My Borrows right away.",
  },
  {
    icon: Undo2,
    title: "Return when done",
    text: "Finished reading? Return it in one click so others can enjoy it.",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="bg-[#fff4ef] py-14 dark:bg-[#141413]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl">
            How Borrowing Works
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            From sign-up to return in four simple steps.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-3xl bg-white p-6 shadow-sm dark:bg-[#1a1a19]"
            >
              <span className="absolute right-5 top-4 font-serif text-5xl font-bold text-[#ffe3da] dark:text-[#2a1f1c]">
                {i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe3da] text-[#c8381a] dark:bg-[#2a1f1c]">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}