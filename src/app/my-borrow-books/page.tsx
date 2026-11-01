import Link from "next/link";
import ReturnButton from "@/components/ReturnButton";

const API_URL = "http://localhost:5000";

interface IBorrowRecord {
  _id: string;
  bookId?: string;
  title?: string;
  author?: string;
  image?: string;
  borrowDate?: string;
  returnDate?: string;
  book?: {
    _id?: string;
    title?: string;
    author?: string;
    image?: string;
  };
}

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : "—";

const BorrowBookPage = async () => {
  const res = await fetch(`${API_URL}/showmycollection`, {
    cache: "no-store",
  });
  const raw: IBorrowRecord[] = res.ok ? await res.json() : [];

  // Works with both the flat shape and the nested { book: {...} } shape
  const borrows = raw.map((item) => {
    const b = item.book ?? item;
    return {
      id: item._id,
      bookId: item.bookId ?? item.book?._id ?? item._id,
      title: b.title ?? "Untitled",
      author: b.author ?? "",
      image: b.image ?? "",
      borrowDate: item.borrowDate,
      returnDate: item.returnDate,
    };
  });

  return (
    <main className="min-h-screen bg-[#fff4ef] dark:bg-[#141413]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 font-serif text-3xl font-bold text-neutral-900 dark:text-white">
          My Borrows{" "}
          <span className="text-lg text-neutral-500">({borrows.length})</span>
        </h1>

        {borrows.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-[#1a1a19]">
            <p className="text-neutral-600 dark:text-neutral-400">
              You haven&apos;t borrowed any books yet.
            </p>
            <Link
              href="/books"
              className="mt-4 inline-block font-semibold text-[#c8381a] hover:underline"
            >
              Browse books
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-[#1a1a19]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#ffe3da] text-neutral-800 dark:bg-[#2a1f1c] dark:text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Borrow Date</th>
                  <th className="px-4 py-3 font-semibold">Return Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t gap-1 border-gray-100 dark:border-neutral-800"
                  >
                    <td className="px-4 py-3">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-30 w-24 rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-20 w-14 rounded-md bg-neutral-200 dark:bg-neutral-700" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                      <Link
                        href={`/books/${item.bookId}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                      {item.author && (
                        <p className="text-xs font-normal text-neutral-500">
                          {item.author}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {formatDate(item.borrowDate)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {formatDate(item.returnDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ReturnButton recordId={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default BorrowBookPage;
