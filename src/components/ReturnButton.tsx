"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export default function ReturnButton({
  recordId,
  onReturned,
}: {
  recordId: string;
  onReturned: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {

    // Get authentication token
    const token = await getTokenFromClient();
    // console.log(token);
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/returnbook/${recordId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`, //convention
        }
      });

      if (!res.ok) {
        throw new Error("Failed to return book");
      }

      // Remove the returned book immediately
      onReturned(recordId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleReturn}
      disabled={loading}
      variant="outline"
      className="rounded-xl"
    >
      {loading ? "Returning..." : "Return Book"}
    </Button>
  );
}
