"use client";

const Timer = ({ endsAt, compact = false }: { endsAt: string, compact?: boolean }) => {
    // Mock display
    return (
        <div className={`flex gap-1 ${compact ? 'text-xs' : 'text-base font-mono'}`}>
            <span className="text-zinc-400">Ends in</span>
            <span className="text-zinc-100 font-bold">15h 10m</span>
        </div>
    );
};

export default Timer;
