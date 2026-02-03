"use client";
import { HTMLAttributes, forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, src, alt, fallback, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    // Reset error state when src changes
    useEffect(() => {
        setHasError(false);
    }, [src]);

    const isValidSrc = src && src !== "undefined" && src !== "null" && src !== "";

    return (
        <div
            ref={ref}
            className={cn("relative flex shrink-0 overflow-hidden rounded-full bg-zinc-900 border border-zinc-800", className)}
            {...props}
        >
            {(isValidSrc && !hasError) ? (
                <img
                    src={src}
                    alt={alt}
                    className="aspect-square h-full w-full object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 font-bold text-zinc-500 uppercase tracking-tighter">
                    {fallback}
                </div>
            )}
        </div>
    );
});
Avatar.displayName = "Avatar";

export { Avatar };
