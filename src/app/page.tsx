import BannerPage from "@/components/banner";
import HowBorrowingWorks from "@/components/HowBorrowingWorks";
import TopCategories from "@/components/TopCategories";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1">
      <BannerPage/>
      <HowBorrowingWorks/>
      <TopCategories/>
    </main>
  );
}
