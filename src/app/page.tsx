"use client";

import { useEffect, useState } from "react";

export default function ComingSoon() {
  // 2 weeks from now
 const targetDate = new Date("2025-10-14T00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🚧 Ashirovinc
        </h1>
        <p className="text-xl mb-8">Our website is under construction.</p>

        <div className="grid grid-cols-4 gap-3 mb-8 text-center">
          {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => {
            const keys = ["days", "hours", "minutes", "seconds"] as const;
            const val = timeLeft[keys[i]];
            return (
              <div key={label} className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold">{val}</div>
                <div className="text-sm uppercase">{label}</div>
              </div>
            );
          })}
        </div>

        <p className="text-lg">
          We’ll be live in about 2 weeks. Stay tuned!
        </p>
      </div>
    </main>
  );
}
