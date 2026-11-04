"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { IBook } from "@/app/type/type";
import { useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface Props {
  book: IBook;
  copies: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Format date as YYYY-MM-DD (local date)
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const BorrowAction = ({ book, copies }: Props) => {
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Date states
  const [borrowDate] = useState<Date>(() => new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  // Minimum return date: tomorrow (midnight)
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  // Hooks must be called at the top level of the component
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  // Check whether the book is already in my collection
  useEffect(() => {
    // Wait for the session to load
    if (isPending) return;

    // Logged out: nothing to check
    if (!email) {
      setIsBorrowed(false);
      setChecking(false);
      return;
    }

    const controller = new AbortController();

    const checkMyCollection = async () => {
      // Get authentication token
      const token = await getTokenFromClient();
      // console.log(token);
      if (!token) {
        throw new Error("Authentication token not found.");
      }      

      try {
        setChecking(true);

        const res = await fetch(
          `${API_URL}/showmycollection/${encodeURIComponent(email)}`,
          {
            cache: "no-store",
            signal: controller.signal,
            headers:{
            authorization: `Bearer ${token}`, //convention
          },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch my collection");
        }

        const bookCollection: IBook[] = await res.json();

        // The collection document may have its own _id, so also compare bookId
        const alreadyBorrowed = bookCollection.some((item) => {
          const entry = item as IBook & { bookId?: string };
          return (
            String(entry._id) === String(book._id) ||
            (entry.bookId !== undefined &&
              String(entry.bookId) === String(book._id))
          );
        });

        setIsBorrowed(alreadyBorrowed);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Collection checking error:", error);
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    };

    checkMyCollection();

    return () => controller.abort();
  }, [book._id, email, isPending]);

  // Open the popover only for logged-in users
  const handleOpenChange = (nextOpen: boolean) => {
    // Never open the popover if the book is already borrowed or unavailable
    if (nextOpen && (isBorrowed || copies <= 0 || checking)) return;

    if (nextOpen && !user) {
      router.push("/login");
      return;
    }
    setOpen(nextOpen);
  };

  // Confirm borrowing
  const handleBorrow = async () => {
    // Hard stop: never send a second request for the same book
    if (isBorrowed || loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!returnDate) {
      alert("Please select a return date!");
      return;
    }

    try {
      setLoading(true);

      const borrowData = {
        ...book,
        username: user.name,
        email: user.email,
        borrowDate: formatDate(borrowDate),
        returnDate: formatDate(returnDate),
      };
      // Get authentication token
      const token = await getTokenFromClient();
      // console.log(token);
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const res = await fetch(`${API_URL}/addtomycollection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, //convention
        },
        body: JSON.stringify(borrowData),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setIsBorrowed(true);
          setOpen(false);
          alert("You have already borrowed this book!");
          return;
        }

        throw new Error("Failed to borrow book");
      }

      setIsBorrowed(true);
      setOpen(false);
      alert("Book borrowed successfully!");

      router.refresh();
    } catch (error) {
      console.error("Borrowing error:", error);
      alert("Unable to borrow this book!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {/* asChild avoids nesting a <button> inside a <button> */}
      <PopoverTrigger>
        <Button
          disabled={
            copies <= 0 || isBorrowed || loading || checking || isPending
          }
          className="rounded-xl py-5 px-10"
        >
          {checking || isPending
            ? "Checking..."
            : isBorrowed
              ? "Borrowed"
              : loading
                ? "Borrowing..."
                : copies > 0
                  ? "Borrow"
                  : "Unavailable"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto space-y-4 p-4" align="start">
        <div>
          <h3 className="font-bold text-lg">Borrow Book</h3>
          <p className="text-sm text-muted-foreground">
            Select your expected return date.
          </p>
        </div>

        {/* Borrow Date */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">Borrow Date</p>

          <div className="rounded-md border px-3 py-2 text-sm">
            {formatDate(borrowDate)}
          </div>
        </div>

        {/* Return Date */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">Return Date</p>

          <Calendar
            mode="single"
            selected={returnDate}
            onSelect={setReturnDate}
            disabled={{ before: tomorrow }}
          />
        </div>

        <Button
          onClick={handleBorrow}
          disabled={!returnDate || loading}
          className="w-full rounded-xl"
        >
          {loading ? "Confirming..." : "Confirm Borrow"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BorrowAction;
