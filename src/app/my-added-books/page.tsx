"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { IMyBook } from "../type/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Drama",
  "Thriller",
  "Others",
];

/* ---------------- Edit form (state starts from the old data) ---------------- */
function EditForm({
  book,
  onClose,
  onSaved,
}: {
  book: IMyBook;
  onClose: () => void;
  onSaved: (updated: IMyBook) => void;
}) {
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    image: book.image,
    publisher: book.publisher,
    publishedDate: book.publishedDate,
    language: book.language,
    totalPages: String(book.totalPages),
    totalCopies: String(book.totalCopies),
    description: book.description,
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get authentication token
    const token = await getTokenFromClient();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        totalPages: Number(form.totalPages),
        totalCopies: Number(form.totalCopies),
      };
      const res = await fetch(`${API_URL}/update-book/${book._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, //convention
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");

      onSaved({ ...book, ...payload } as IMyBook);
      toast.success("Book updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Could not update the book");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            required
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            required
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            id="publisher"
            value={form.publisher}
            onChange={(e) => set("publisher", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedDate">Published date</Label>
          <Input
            id="publishedDate"
            type="date"
            value={form.publishedDate}
            onChange={(e) => set("publishedDate", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            value={form.language}
            onChange={(e) => set("language", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="totalPages">Total pages</Label>
          <Input
            id="totalPages"
            type="number"
            min={1}
            value={form.totalPages}
            onChange={(e) => set("totalPages", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="totalCopies">Total copies</Label>
          <Input
            id="totalCopies"
            type="number"
            min={0}
            value={form.totalCopies}
            onChange={(e) => set("totalCopies", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;
  console.log("email:", email);

  const [books, setBooks] = useState<IMyBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IMyBook | null>(null);
  const [deleting, setDeleting] = useState<IMyBook | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Private route: send guests to login
  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  // Load only this user's books
  useEffect(() => {
    if (!email) return;
    (async () => {
      // Get authentication token
      const token = await getTokenFromClient();
      // console.log(token);
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      try {
        const res = await fetch(`${API_URL}/my-books/${email}`, {
          // cache: "no-store",
          headers: {
            authorization: `Bearer ${token}`, //convention
        }
      });

        setBooks(res.ok ? await res.json() : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  const handleDelete = async () => {
    // Get authentication token
      const token = await getTokenFromClient();

    if (!deleting) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`${API_URL}/delete-book/${deleting._id}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${token}`, //convention
        }
      });
      if (!res.ok) throw new Error("Delete failed");

      setBooks((prev) => prev.filter((b) => b._id !== deleting._id)); // remove from UI
      toast.success("Book deleted");
      setDeleting(null);
    } catch (err) {
      console.error(err);
      toast.error("Could not delete the book");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isPending || !session) {
    return <p className="p-10 text-center text-neutral-500">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] dark:bg-[#141413]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 font-serif text-3xl font-bold text-neutral-900 dark:text-white">
          My Books{" "}
          <span className="text-lg text-neutral-500">({books.length})</span>
        </h1>

        {loading ? (
          <p className="text-neutral-500">Loading your books...</p>
        ) : books.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-[#1a1a19]">
            <p className="text-neutral-600 dark:text-neutral-400">
              You haven&apos;t added any books yet.
            </p>
            <Link
              href="/add-book"
              className="mt-4 inline-block font-semibold text-[#c8381a] hover:underline"
            >
              Add a book
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-[#1a1a19]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#ffe3da] text-neutral-800 dark:bg-[#2a1f1c] dark:text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Copies</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="border-t border-gray-100 dark:border-neutral-800"
                  >
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-30 w-24 rounded-md object-cover shadow-sm"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">
                      {book.title}
                      <p className="text-xs font-normal text-neutral-500">
                        {book.author}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {book.category}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {book.totalCopies}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="rounded-xl px-5"
                          onClick={() => setEditing(book)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="rounded-xl px-5"
                          onClick={() => setDeleting(book)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit book</DialogTitle>
            <DialogDescription>Change the details and save.</DialogDescription>
          </DialogHeader>
          {editing && (
            <EditForm
              key={editing._id}
              book={editing}
              onClose={() => setEditing(null)}
              onSaved={(updated) =>
                setBooks((prev) =>
                  prev.map((b) => (b._id === updated._id ? updated : b)),
                )
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm modal */}
      <Dialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this book?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.title}&quot; will be permanently removed. This
              can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
