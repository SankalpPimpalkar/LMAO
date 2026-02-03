import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    // Variants
                    variant === "default" && "bg-zinc-50 text-zinc-900 hover:bg-zinc-50/90",
                    variant === "destructive" && "bg-red-500 text-zinc-50 hover:bg-red-500/90",
                    variant === "outline" && "border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50",
                    variant === "secondary" && "bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
                    variant === "ghost" && "hover:bg-zinc-800 hover:text-zinc-50",
                    variant === "link" && "text-zinc-50 underline-offset-4 hover:underline",
                    // Sizes
                    size === "default" && "h-9 px-4 py-2",
                    size === "sm" && "h-8 rounded-md px-3 text-xs",
                    size === "lg" && "h-10 rounded-md px-8",
                    size === "icon" && "h-9 w-9",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
