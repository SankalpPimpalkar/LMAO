"use client";

import { useState, useEffect } from "react";

const Timer = ({ endsAt, compact = false }: { endsAt: string, compact?: boolean }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endsAt).getTime() - new Date().getTime();

            if (difference <= 0) {
                return "Expired";
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);

            if (days > 0) {
                return `${days}d ${hours}h`;
            } else if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const result = calculateTimeLeft();
            setTimeLeft(result);
            if (result === "Expired") clearInterval(timer);
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [endsAt]);

    if (!timeLeft) return null;

    return (
        <div className={`flex gap-1 items-center ${compact ? 'text-[10px] md:text-xs' : 'text-xs md:text-base'}`}>
            <span className="text-zinc-500 whitespace-nowrap">
                {timeLeft === "Expired" ? "" : "Ends in"}
            </span>
            <span className={`font-bold whitespace-nowrap ${timeLeft === "Expired" ? "text-red-500/80" : "text-zinc-200"}`}>
                {timeLeft}
            </span>
        </div>
    );
};

export default Timer;
