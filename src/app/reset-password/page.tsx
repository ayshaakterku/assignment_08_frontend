"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPassword = new FormData(e.currentTarget).get("password") as string;
    if (!token) return alert("Invalid or missing token");

    const { error } = await authClient.resetPassword({ newPassword, token });
    if (error) return alert(error.message);

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6 grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </CardContent>

          <CardFooter className="mt-6">
            <Button type="submit" className="w-full">
              Reset password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}


// // app/reset-password/ResetPasswordForm.tsx
// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";

// export default function ResetPasswordForm() {
//   const token = useSearchParams().get("token");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const newPassword = new FormData(e.currentTarget).get("password") as string;
//     if (!token) return alert("Invalid or missing token");

//     const { error } = await authClient.resetPassword({ newPassword, token });
//     if (error) return alert(error.message);

//     router.push("/login");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="password" type="password" minLength={6} required />
//       <button type="submit">Reset password</button>
//     </form>
//   );
// }