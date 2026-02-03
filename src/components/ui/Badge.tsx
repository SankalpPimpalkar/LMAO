import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2",
                variant === "default" && "border-transparent bg-zinc-50 text-zinc-900 hover:bg-zinc-50/80",
                variant === "secondary" && "border-transparent bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
                variant === "destructive" && "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
                variant === "outline" && "text-zinc-50",
                className
            )}
            {...props}
        />
    );
});
Badge.displayName = "Badge";

export { Badge };
