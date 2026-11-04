'use client'

import { authClient } from "@/lib/auth-client";

export default function Loading() {
  const {data:session} = authClient.useSession()
  const user = session?.user
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
        <p className="text-sm font-medium text-red-400">
         Please wait Mr/Mrs {user?.name}. Data is Loading...
        </p>
      </div>
    </div>
  );
}