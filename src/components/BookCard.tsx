'use client'
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { IBook } from "@/app/type/type";

export default function BookCard({ book }: { book: IBook }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-[#1a1a19]">
      <div className="h-72 w-full bg-gray-100 dark:bg-neutral-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            imageError
              ? "https://placehold.co/400x600?text=Book+Cover+Unavailable"
              : book.image
          }
          alt={book.title}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-bold text-neutral-900 dark:text-white">
          {book.title}
        </h3>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          by {book.author ?? "Unknown author"}
        </p>

        <span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          {book.category}
        </span>

        <Button
        //   asChild
          className="mt-auto w-full bg-cyan-600 text-white hover:bg-cyan-700"
        >
          <Link href={`/books/${book._id}`}>View Details</Link>
        </Button>
      </div>
    </article>
  );
}
