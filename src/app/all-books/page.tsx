import BookCard from "@/components/BookCard";
import { IBook} from "../type/type";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getBooks(): Promise<IBook[]> {
  // no-store so newly added books show up right away
  const res = await fetch(`${API_URL}/all-book`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch books (${res.status})`);
  return res.json();
}

const AllBookPage = async () => {
  const books = await getBooks();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900 dark:text-white">
        All Books
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

export default AllBookPage;