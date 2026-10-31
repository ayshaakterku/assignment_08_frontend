"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Heart } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IBook } from "@/app/type/type";

export default function BookCard({ book }: { book: IBook }) {
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200 bg-[#fcfaf4] p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-rose-300 hover:shadow-xl dark:border-neutral-700 dark:bg-[#1a1a19] dark:hover:border-rose-800">
      {/* Cover */}
      <div className="flex items-center justify-center pt-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            imageError
              ? "https://placehold.co/400x600?text=Book+Cover+Unavailable"
              : book.image
          }
          alt={book.title}
          onError={() => setImageError(true)}
          className="h-80 w-56 rounded-sm object-cover shadow-[4px_6px_14px_rgba(0,0,0,0.35)] transition duration-300 group-hover:scale-105 group-hover:shadow-[6px_10px_22px_rgba(0,0,0,0.45)] sm:h-96 sm:w-64"
        />
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-1 flex-col items-center text-center">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-rose-700 dark:text-white dark:group-hover:text-rose-400">
          {book.title}
        </h3>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {book.author ?? "Unknown author"}
        </p>

        <p className="text-lg font-bold text-rose-700 dark:text-rose-400">
          {book.category}
        </p>

        <hr className="my-2.5 w-full border-gray-300 dark:border-neutral-700" />

        {/* Actions */}
        <div className="mt-auto flex items-center justify-center gap-3">
          <Link
            href={`/all-books/${book._id}`}
            className={cn(
              buttonVariants(),
              "h-10 gap-2 bg-rose-700 px-5 font-semibold text-white hover:bg-rose-800"
            )}
          >
            <BookOpen className="h-4 w-4" />
            View Details
          </Link>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={liked ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={liked}
            onClick={() => setLiked((l) => !l)}
            className="h-10 w-10 border-gray-300 bg-white text-rose-700 hover:bg-rose-50 dark:border-neutral-600 dark:bg-transparent dark:hover:bg-rose-950"
          >
            <Heart
              className={cn("h-5 w-5", liked && "fill-rose-700 dark:fill-rose-400")}
            />
          </Button>
        </div>
      </div>
    </article>
  );
}