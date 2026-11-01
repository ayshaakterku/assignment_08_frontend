"use client";

import { useState } from "react";
import { BookOpen, Bookmark, Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BorrowButton({
  available,
  className,
}: {
  available: boolean;
  className?: string;
}) {
  const handleBorrow = () => {
    // TODO: POST to your borrow endpoint with the book _id and the logged-in user.
  };

  return (
    <Button
      type="button"
      disabled={!available}
      onClick={handleBorrow}
      className={cn(
        "h-10 gap-2 bg-[#c8381a] px-5 font-semibold text-white hover:bg-[#a82d14]",
        className,
      )}
    >
      <BookOpen className="h-4 w-4" />
      {available ? "Borrow Book" : "Not available"}
    </Button>
  );
}

const soft =
  "h-10 gap-2 rounded-xl border-0 bg-white px-4 font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700";

export function SaveShareButtons({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled the share sheet
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-pressed={saved}
        onClick={() => setSaved((s) => !s)}
        className={soft}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save"}
      </Button>

      <Button type="button" variant="outline" onClick={share} className={soft}>
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied ? "Link copied" : "Share"}
      </Button>
    </>
  );
}
