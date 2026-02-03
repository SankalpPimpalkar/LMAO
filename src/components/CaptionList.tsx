"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Heart, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Caption } from "@/types";

const CaptionList = ({ captions }: { captions: Caption[] }) => {
    const [localCaptions, setLocalCaptions] = useState(captions);

    // In a real implementation this would call an API
    const handleVote = (id: string) => {
        setLocalCaptions(prev => prev.map(c =>
            c.id === id ? { ...c, votes: c.votes + 1 } : c
        ));
    };

    return (
        <div className="flex flex-col gap-4">
            {localCaptions.map((caption, index) => (
                <div key={caption.id} className="flex gap-3 p-3 rounded-md bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVote(caption.id)}
                            className="h-8 w-8 text-zinc-500 hover:bg-zinc-800 hover:text-red-500 rounded-full"
                        >
                            <Heart className={cn("h-5 w-5", caption.votes > 10 && "fill-current text-red-500")} />
                        </Button>
                        <span className="text-sm font-bold text-zinc-300">{caption.votes}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-zinc-300">u/{caption.author.username}</span>
                            {index === 0 && (
                                <span className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                    <Trophy className="h-3 w-3" /> Leading
                                </span>
                            )}
                            <span className="text-xs text-zinc-500">• 4h ago</span>
                        </div>
                        <p className="text-sm text-zinc-100 leading-relaxed">
                            {caption.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CaptionList;
