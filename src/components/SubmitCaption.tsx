"use client";

import { Button } from "@/components/ui/Button";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";

const SubmitCaption = () => {
    return (
        <div className="mb-8 border border-zinc-800 rounded-md bg-zinc-950 overflow-hidden focus-within:ring-1 focus-within:ring-zinc-700">
            <textarea
                className="w-full bg-zinc-950 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none min-h-[100px] resize-y"
                placeholder="Write a funny caption..."
            ></textarea>

            <div className="bg-zinc-900/50 p-2 flex justify-between items-center border-t border-zinc-800">
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
                        <Bold className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
                        <Italic className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
                        <LinkIcon className="h-3 w-3" />
                    </Button>
                </div>
                <Button size="sm" className="h-7 text-xs font-bold bg-zinc-100 text-zinc-900 hover:bg-zinc-200 rounded-full">
                    Post Caption
                </Button>
            </div>
        </div>
    );
};

export default SubmitCaption;
