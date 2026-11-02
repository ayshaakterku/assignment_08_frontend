import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-7xl font-extrabold text-gray-900">404</h2>

      <h3 className="mt-4 text-2xl font-bold text-gray-800">
        Oops! Page Not Found
      </h3>

      <p className="mt-2 max-w-md text-gray-500">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-full bg-[#C2F800] px-6 py-3 font-semibold text-black transition hover:bg-[#b5e800]"
      >
        Back to Home
      </Link>
    </div>
  );
}
