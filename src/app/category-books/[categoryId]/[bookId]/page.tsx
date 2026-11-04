import { IBook } from '@/app/type/type';
import BookCard from '@/components/BookCard';
import { getTokenFromServer } from '@/lib/getTokenFromServer';
import React from 'react';



const CategoryBooKPage = async ({params, }: { params: Promise<{ categoryId: string; bookId: string }>;}) => {

    // Get authentication token
    const token = await getTokenFromServer();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    const { categoryId, bookId } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book-category/${encodeURIComponent(categoryId)}/${bookId}`, {
      headers: {
      authorization: `Bearer ${token}`, //convention
    },
    });

    if (!res.ok) throw new Error(`Failed to fetch books (${res.status})`);

    const books: IBook[] = await res.json();

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
              <h1 className="mb-8 text-3xl font-bold text-neutral-900 dark:text-white">
                {books?.[0]?.category} Books
                <span className="ml-3 text-lg font-medium text-neutral-500">
                  ({books.length})
                </span>
              </h1>
        
              {books.length === 0 ? (
                <p className="text-neutral-600 dark:text-neutral-400">
                  No books have been added yet.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {books.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              )}
            </main>
    );
};

export default CategoryBooKPage;