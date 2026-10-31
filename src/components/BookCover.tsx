"use client";

import { useState } from "react";

export default function BookCover({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="relative shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          error
            ? "https://placehold.co/400x600?text=Book+Cover+Unavailable"
            : src
        }
        alt={alt}
        onError={() => setError(true)}
        className="h-80 w-56 rounded-r-md rounded-l-sm object-cover shadow-[8px_12px_24px_rgba(0,0,0,0.35)] sm:h-[22rem] sm:w-60"
      />
      {/* spine highlight */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-2 rounded-l-sm bg-gradient-to-r from-black/25 to-transparent" />
    </div>
  );
}