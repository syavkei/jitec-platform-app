"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  isRunning?: boolean;
}

export function ExamTimer({ initialSeconds, onTimeUp, isRunning = true }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, onTimeUp]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isLowTime = secondsLeft < 300; // Less than 5 mins

  const formatTime = (val: number) => String(val).padStart(2, "0");

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3.5 py-1.5 font-mono text-sm font-semibold transition-colors ${
      isLowTime
        ? "border-red-300 bg-red-50 text-red-700 animate-pulse dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
        : "border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
    }`}>
      {isLowTime ? <AlertTriangle className="h-4 w-4 text-red-600" /> : <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
      <span>
        {hours > 0 ? `${formatTime(hours)}:` : ""}{formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </div>
  );
}
