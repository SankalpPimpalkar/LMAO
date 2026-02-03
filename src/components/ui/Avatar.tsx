import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, src, alt, fallback, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-800", className)}
            {...props}
        >
            {src ? (
                <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-400">
                    {fallback}
                </div>
            )}
        </div>
    );
});
Avatar.displayName = "Avatar";

export { Avatar };
