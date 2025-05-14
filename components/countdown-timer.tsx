"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8">
      <div className="flex flex-col items-center pr-4 border-r-2">
        <div className="text-4xl md:text-5xl font-light">
          {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
        </div>
        <div className="text-sm uppercase tracking-wider mt-1">ՕՐ</div>
      </div>
      <div className="flex flex-col items-center pr-4 border-r-2">
        <div className="text-4xl md:text-5xl font-light">
          {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
        </div>
        <div className="text-sm uppercase tracking-wider mt-1">ԺԱՄ</div>
      </div>
      <div className="flex flex-col items-center pr-4 border-r-2">
        <div className="text-4xl md:text-5xl font-light">
          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
        </div>
        <div className="text-sm uppercase tracking-wider mt-1">ՐՈՊԵ</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-4xl md:text-5xl font-light">
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </div>
        <div className="text-sm uppercase tracking-wider mt-1">ՎԱՅՐԿՅԱՆ</div>
      </div>
    </div>
  );
}
