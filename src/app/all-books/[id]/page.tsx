import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { IBook } from "@/app/type/type";
import BookCover from "@/components/BookCover";
import BorrowAction from "@/components/BorrowAction";
import { SaveShareButtons } from "@/components/BookAction";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getBook(id: string): Promise<IBook | null> {
  
  // Get authentication token
  const token = await getTokenFromServer();
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(`${API_URL}/single-book/${id}`, {
    // cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`, //convention
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data && data._id ? (data as IBook) : null;
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm dark:bg-neutral-800">
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="text-sm font-bold text-neutral-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

const BookDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const pages = Number(book.totalPages) || 0;
  const copies = Number(book.totalCopies) || 0;
  const author = book.author ?? "Unknown author";
  const readingHours = Math.max(1, Math.round((pages * 1.4) / 60));
  const published = book.publishedDate
    ? new Date(book.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "—";

  const handleBorrow = async () => {
    const resBook = await fetch(`${API_URL}/addtomycollection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!resBook.ok) {
      throw new Error("Failed to borrow book");
    }
  };

  const discover = [
    {
      label: `More ${book.category} books`,
      href: `/category-books/${book.category}/${book._id}`,
    },
    { label: "Add a book", href: "/add-book" },
    { label: "My borrows", href: "/my-borrow-books" },
  ];

  return (
    <main className="min-h-screen bg-[#fff4ef] dark:bg-[#141413]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/books" className="hover:underline">
            All Books
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900 dark:text-white">
            {book.title}
          </span>
        </nav>

        {/* Hero: cover + details + facts + actions */}
        <section className="flex flex-col items-center gap-8 rounded-3xl bg-[#ffe3da] p-6 dark:bg-[#2a1f1c] md:flex-row md:items-start md:p-10">
          <BookCover src={book.image} alt={book.title} />

          <div className="w-full flex-1">
            <span className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#c8381a] dark:bg-neutral-800">
              {book.category}
            </span>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-neutral-900 dark:text-white md:text-5xl">
              {book.title}
            </h1>

            <p className="mt-3 text-base text-neutral-700 dark:text-neutral-300">
              by <span className="font-bold text-[#c8381a]">{author}</span>
            </p>

            {/* Book facts */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact label="Publisher" value={book.publisher} />
              <Fact label="Published" value={published} />
              <Fact label="Language" value={book.language} />
              <Fact label="Pages" value={pages || book.totalPages} />
              <Fact
                label="Reading time"
                value={`About ${readingHours} ${readingHours === 1 ? "hour" : "hours"}`}
              />
              <Fact
                label="Copies available"
                value={copies > 0 ? copies : "None right now"}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <BorrowAction book={book} copies={copies} />

              <Link
                href="/all-books"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>

              <SaveShareButtons title={book.title} />
            </div>
          </div>
        </section>

        {/* Discover more */}
        <section className="overflow-hidden rounded-lg border border-sky-100 bg-white dark:border-neutral-700 dark:bg-[#1a1a19]">
          <h2 className="bg-sky-50 px-4 py-3 text-sm font-bold text-neutral-800 dark:bg-sky-950 dark:text-white">
            Discover more
          </h2>
          {discover.map((d) => (
            <Link
              key={d.label}
              href={d.href}
              className="flex items-center justify-between border-t border-gray-100 px-4 py-3.5 text-sm text-neutral-800 transition hover:bg-gray-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {d.label}
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </Link>
          ))}
        </section>

        {/* About */}
        <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-[#1a1a19]">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            About this{" "}
            <span className="text-[#c8381a] underline decoration-dotted">
              book
            </span>
          </h2>
          <p className="mt-3 whitespace-pre-line font-serif text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            {book.description}
          </p>
        </section>
      </div>
    </main>
  );
};

export default BookDetailsPage;
