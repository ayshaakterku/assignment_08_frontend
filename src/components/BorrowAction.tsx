
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IBook } from "@/app/type/type";
import { useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  book: IBook;
  copies: number;
}

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

  // Minimum return date: Tomorrow
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check existing book in my collection
  useEffect(() => {
    const checkMyCollection = async () => {
      try {
        setChecking(true);

        const res = await fetch(
          "http://localhost:5000/showmycollection",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch my collection");
        }

        const bookCollection = await res.json();

        const alreadyBorrowed = bookCollection.some(
          (item: IBook) =>
            String(item._id) === String(book._id)
        );

        setIsBorrowed(alreadyBorrowed);
      } catch (error) {
        console.error("Collection checking error:", error);
      } finally {
        setChecking(false);
      }
    };

    checkMyCollection();
  }, [book._id]);

  // Confirm borrowing
  const handleBorrow = async () => {
    if (!returnDate) {
      alert("Please select a return date!");
      return;
    }

    try {
      setLoading(true);

      const borrowData = {
        ...book,
        borrowDate: formatDate(borrowDate),
        returnDate: formatDate(returnDate),
      };

      const res = await fetch(
        "http://localhost:5000/addtomycollection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(borrowData),
        }
      );

      if (!res.ok) {
        if (res.status === 409) {
          setIsBorrowed(true);
          alert("You have already borrowed this book!");
          setOpen(false);
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          disabled={
            copies <= 0 ||
            isBorrowed ||
            loading ||
            checking
          }
          className="rounded-xl py-5 px-10"
        >
          {checking
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

      <PopoverContent
        className="w-auto space-y-4 p-4"
        align="start"
      >
        <div>
          <h3 className="font-bold text-lg">
            Borrow Book
          </h3>
          <p className="text-sm text-muted-foreground">
            Select your expected return date.
          </p>
        </div>

        {/* Borrow Date */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Borrow Date
          </p>

          <div className="rounded-md border px-3 py-2 text-sm">
            {formatDate(borrowDate)}
          </div>
        </div>

        {/* Return Date */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Return Date
          </p>

          <Calendar
            mode="single"
            selected={returnDate}
            onSelect={setReturnDate}
            disabled={{ before: tomorrow }}
            // initialFocus
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
