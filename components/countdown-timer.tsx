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
    <div className="flex text-white bolder md:text-stone-600">
      <div className="flex flex-col items-center md:pl-0 px-6">
        <div className="text-2xl md:text-4xl font-bold md:font-light">
          {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
        </div>
        <div className="text-sm md:mt-2 uppercase tracking-wider mt-1 md:font-light font-black">
          ՕՐ
        </div>
      </div>
      <div className="flex flex-col items-center border-l-2 md:border-stone-600 px-6">
        <div className="text-2xl md:text-4xl font-bold md:font-light">
          {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
        </div>
        <div className="text-sm md:mt-2 uppercase tracking-wider mt-1 md:font-light font-black">
          ԺԱՄ
        </div>
      </div>
      <div className="flex flex-col items-center border-x-2 md:border-stone-600 px-6">
        <div className="text-2xl md:text-4xl font-bold md:font-light">
          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
        </div>
        <div className="text-sm md:mt-2 uppercase tracking-wider mt-1 md:font-light font-black">
          ՐՈՊԵ
        </div>
      </div>
      <div className="flex flex-col items-center md:pr-0 px-6">
        <div className="text-2xl md:text-4xl font-bold md:font-light">
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </div>
        <div className="text-sm md:mt-2 uppercase tracking-wider mt-1 md:font-light font-black">
          ՎԱՅՐԿՅԱՆ
        </div>
      </div>
    </div>
  );
}
