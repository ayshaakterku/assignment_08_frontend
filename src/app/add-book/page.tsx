"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IBookForm } from "../type/type";
import { authClient } from "@/lib/auth-client";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Drama",
  "Thriller",
  "Others",
] as const;

const initial: IBookForm = {
  title: "",
  author: "",
  category: "Fiction",
  image: "",
  publisher: "",
  publishedDate: "",
  language: "",
  totalPages: "",
  totalCopies: "",
  description: "",
};

const input =
  "w-full rounded-lg bg-gray-100 px-3 py-3 text-sm text-neutral-900 placeholder-gray-400 outline-none ring-cyan-600 transition focus:ring-2 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500";

const labelClass =
  "mb-2 block text-sm font-semibold text-neutral-900 dark:text-white";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function Field({
  name,
  text,
  children,
}: {
  name: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {text}
      </label>
      {children}
    </div>
  );
}

const AddBookPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<IBookForm>(initial);
  const [imgOk, setImgOk] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setImgOk(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    const bookData = {
      username: user?.name,
      email: user?.email,
      ...formData,
      totalPages: Number(formData.totalPages),
      totalCopies: Number(formData.totalCopies),
    };

    try {
      const res = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const result = await res.json();
      console.log("Submitted Data: ", result);

      setFormData(initial);
      setImgOk(true);
      setMessage({ type: "success", text: "Book added successfully." });
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Could not add the book. Please check the server and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-white">
        Add New Book
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-[#1a1a19] md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="title" text="Book Title">
            <input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={onChange}
              placeholder="e.g., The Great Gatsby"
              className={input}
            />
          </Field>

          <Field name="author" text="Author">
            <input
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={onChange}
              placeholder="e.g., F. Scott Fitzgerald"
              className={input}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field name="category" text="Category">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onChange}
              className={input}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field name="language" text="Language">
            <input
              id="language"
              name="language"
              required
              value={formData.language}
              onChange={onChange}
              placeholder="e.g., English"
              className={input}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field name="publisher" text="Publisher">
            <input
              id="publisher"
              name="publisher"
              required
              value={formData.publisher}
              onChange={onChange}
              placeholder="e.g., Penguin Books"
              className={input}
            />
          </Field>

          <Field name="publishedDate" text="Published Date">
            <input
              id="publishedDate"
              name="publishedDate"
              type="date"
              required
              value={formData.publishedDate}
              onChange={onChange}
              className={`${input} dark:[color-scheme:dark]`}
            />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field name="totalPages" text="Total Pages">
            <input
              id="totalPages"
              name="totalPages"
              type="number"
              min="1"
              required
              value={formData.totalPages}
              onChange={onChange}
              placeholder="e.g., 320"
              className={input}
            />
          </Field>

          <Field name="totalCopies" text="Total Copies">
            <input
              id="totalCopies"
              name="totalCopies"
              type="number"
              min="1"
              required
              value={formData.totalCopies}
              onChange={onChange}
              placeholder="e.g., 5"
              className={input}
            />
          </Field>
        </div>

        <Field name="description" text="Description">
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={onChange}
            placeholder="e.g., When a quiet student receives a letter describing events..."
            rows={4}
            className={input}
          />
        </Field>

        <Field name="image" text="Book Image">
          <input
            id="image"
            name="image"
            type="url"
            required
            value={formData.image}
            onChange={onChange}
            placeholder="https://example.com/book-cover.jpg"
            className={input}
          />
          {formData.image && imgOk && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formData.image}
              alt="Book cover preview"
              onError={() => setImgOk(false)}
              className="mt-3 h-40 w-28 rounded-md object-cover shadow"
            />
          )}
          {formData.image && !imgOk && (
            <p className="mt-2 text-xs text-red-500">
              Could not load this image link.
            </p>
          )}
          
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field name="userName" text="User Name">
            <input
              id="userName"
              name="userName"
              type="string"
              readOnly
              value={user?.name}
              onChange={onChange}
              placeholder="e.g., 320"
              className={input}
            />
          </Field>

          <Field name="userEmail" text="User Email">
            <input
              id="userEmail"
              name="userEmail"
              type="string"
              readOnly
              value={user?.email}
              onChange={onChange}
              placeholder="e.g., 5"
              className={input}
            />
          </Field>
        </div>        

        {message && (
          <p
            role="status"
            className={`text-sm font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
          >
            <Trash2 />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className="bg-cyan-600 text-white hover:bg-cyan-700"
          >
            <Save />
            {submitting ? "Adding..." : "Add Book"}
          </Button>
        </div>
      </form>
    </main>
  );
};

export default AddBookPage;