"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  initial: string;
  avatarClassName: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Pratikleştir sayesinde PDF işlerimi artık dakikalar içinde hallediyorum, hiç uğraştırmıyor.",
    name: "Sami Y.",
    initial: "S",
    avatarClassName: "bg-linear-to-br from-purple-500 to-indigo-500",
  },
  {
    quote:
      "Arka plan silme aracı çok işime yaradı, ürün fotoğraflarımı artık çok daha hızlı hazırlıyorum.",
    name: "Mehmet S.",
    initial: "M",
    avatarClassName: "bg-linear-to-br from-indigo-500 to-pink-500",
  },
  {
    quote:
      "Çok memnun kaldım, tamamen ücretsiz olması ve kayıt gerektirmeden hızlıca kullanabilmek büyük artı.",
    name: "Uğur S.",
    initial: "U",
    avatarClassName: "bg-linear-to-br from-pink-500 to-orange-500",
  },
  {
    quote:
      "Öğrenciyim ve sürekli QR kod, PDF birleştirme gibi işlere ihtiyacım oluyor. Bu site tam kurtarıcı oldu.",
    name: "Efe B.",
    initial: "E",
    avatarClassName: "bg-linear-to-br from-green-500 to-emerald-400",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function Testimonials() {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);

  const paginate = (dir: number) => {
    setCurrent(([c]) => [(c + dir + testimonials.length) % testimonials.length, dir]);
  };

  const goTo = (index: number) => {
    setCurrent(([c]) => [index, index >= c ? 1 : -1]);
  };

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto mt-16 w-full max-w-2xl overflow-hidden px-6 py-16 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 m-auto h-64 w-full max-w-md rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/25"
      />

      <p className="relative text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        Müşteri Memnuniyeti
      </p>
      <p className="relative mt-2.5 mb-11 text-4xl font-extrabold tracking-tight text-black sm:text-5xl dark:text-zinc-50">
        <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
          +1000
        </span>{" "}
        Aktif Üye
      </p>

      <div className="relative flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Önceki yorum"
          onClick={() => paginate(-1)}
          className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[.03] text-black transition-all! duration-200! hover:scale-105 hover:border-purple-400/50 hover:bg-purple-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-50"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="relative min-h-47.5 flex-1">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-black/[.08] bg-white p-8 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#1c1c1f] dark:shadow-black/40"
            >
              <p className="mb-4.5 text-sm font-medium leading-relaxed text-zinc-700 sm:text-base dark:text-zinc-300">
                <span className="font-extrabold text-purple-400">&ldquo;</span>
                {testimonials[current].quote}
                <span className="font-extrabold text-purple-400">&rdquo;</span>
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8.5 w-8.5 items-center justify-center rounded-full text-xs font-bold text-white ${testimonials[current].avatarClassName}`}
                >
                  {testimonials[current].initial}
                </div>
                <span className="text-sm font-bold text-black dark:text-zinc-50">
                  {testimonials[current].name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Sonraki yorum"
          onClick={() => paginate(1)}
          className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[.03] text-black transition-all! duration-200! hover:scale-105 hover:border-purple-400/50 hover:bg-purple-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-50"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="relative mt-5.5 flex justify-center gap-1.5">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.name}
            type="button"
            aria-label={`${testimonial.name} yorumuna git`}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all! duration-250! ${
              index === current
                ? "w-5.5 bg-linear-to-r from-purple-500 to-indigo-500"
                : "w-1.5 bg-black/15 dark:bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
