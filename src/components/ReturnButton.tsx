"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ReturnButton({ recordId }: { recordId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/returnbook/${recordId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to return book");
      router.refresh();
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


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// export default function ReturnButton({ bookId }: { bookId: string }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleReturn = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`http://localhost:5000/returnbook/${bookId}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Failed to return book");
//       router.refresh(); // reload the table
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button
//       onClick={handleReturn}
//       disabled={loading}
//       variant="outline"
//       className="rounded-xl"
//     >
//       {loading ? "Returning..." : "Return Book"}
//     </Button>
//   );
// }