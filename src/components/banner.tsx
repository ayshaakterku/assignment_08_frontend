"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Free-to-use photos from Unsplash (Unsplash License).
// Plain CSS background images, so no next.config.js changes are needed.
const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

const slides = [
  {
    title: "Discover Your Next Great Read",
    text: "Explore a growing collection of fiction, science, history and more, all in one cozy corner.",
    image: img("photo-1673162802561-dd53ec4be651"), // Matthew Michael
  },
  {
    title: "Lose Yourself in a Story",
    text: "From timeless classics to fresh releases, there is a book here waiting to carry you away.",
    image: img("photo-1532012197267-da84d127e765"), // Jaredd Craig
  },
  {
    title: "Borrow, Read, Return",
    text: "Pick a book, enjoy it at your own pace, and pass it on to the next reader when you are done.",
    image: img("photo-1499447155021-4907f71b9ef5"), // CHUTTERSNAP
  },
  {
    title: "A Library for Everyone",
    text: "Browse shelves of every genre and find something that fits your mood, whatever it is today.",
    image: img("photo-1741795822895-efe35bad6761"), // Zoshua Colah
  },
  {
    title: "Share Books With Your Community",
    text: "Add your own books to BookNook and help fellow readers find their next favourite story.",
    image: img("photo-1431608660976-4fe5bcc2112c"), // Glen Noble
  },
];

const BannerPage = () => {
  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop
        speed={800}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[420px] md:h-[560px] [--swiper-pagination-bullet-inactive-color:#fff] [--swiper-pagination-bullet-inactive-opacity:0.6] [--swiper-pagination-color:#ff9f1b] [--swiper-navigation-color:#fff] [--swiper-navigation-size:28px] max-md:[&_.swiper-button-next]:hidden max-md:[&_.swiper-button-prev]:hidden"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.title}>
            <div
              className="relative flex h-full w-full items-center justify-center bg-neutral-800 bg-cover bg-center px-6"
              style={{ backgroundImage: `url(${s.image})` }}
            >
              {/* dark overlay keeps the text readable on any photo */}
              <div className="absolute inset-0 bg-black/55" />

              <div className="relative z-10 mx-auto max-w-3xl text-center text-white">
                <h2 className="text-3xl font-bold leading-tight drop-shadow md:text-5xl">
                  {s.title}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-white/90 md:text-lg">
                  {s.text}
                </p>
                <Link
                  href="/all-books"
                  className="mt-8 inline-flex h-11 items-center justify-center rounded border border-white bg-white px-8 text-sm font-semibold text-[#141413] transition hover:border-[#ff9f1b] hover:bg-[#ff9f1b] hover:text-white"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BannerPage;
