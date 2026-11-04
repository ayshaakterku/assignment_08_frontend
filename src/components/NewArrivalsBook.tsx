
import React from "react";
import BookCard from "./BookCard";
import { IBook } from "@/app/type/type";
import { Button } from "./ui/button";
import Link from "next/link";

const NewArrivalsBookPage = async () => {
  let result: IBook[] = [];

  try {
    const API = `${process.env.NEXT_PUBLIC_API_URL}/newest-books`;

    const res = await fetch(API, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch newest books");
    }

    result = await res.json();
  } catch (error) {
    console.error("Error fetching newest books:", error);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900 dark:text-white">
        New Arrivals
      </h1>

      {result.length === 0 ? (
        <p className="text-center text-neutral-600 dark:text-neutral-400">
          No books have been added yet.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.map((item) => (
              <BookCard book={item} key={item._id} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/all-books">
              <Button variant="outline">See All Books</Button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

export default NewArrivalsBookPage;
