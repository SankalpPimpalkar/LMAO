"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Heart, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Caption } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CaptionService } from "@/services/firebase/caption.service";

const CaptionList = ({ captions }: { captions: Caption[] }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [localCaptions, setLocalCaptions] = useState(captions);

    useEffect(() => {
        setLocalCaptions(captions);
    }, [captions]);

    const handleVote = async (id: string) => {
        if (!user) {
            router.push("/login");
            return;
        }

        const caption = localCaptions.find(c => c.id === id);
        if (!caption) return;

        const alreadyVoted = caption.votedByMe;

        // Optimistic update
        setLocalCaptions(prev => prev.map(c =>
            c.id === id ? {
                ...c,
                votes: alreadyVoted ? c.votes - 1 : c.votes + 1,
                votedByMe: !alreadyVoted
            } : c
        ));

        try {
            if (alreadyVoted) {
                await CaptionService.unvoteCaption(id, user.uid!);
            } else {
                await CaptionService.voteCaption(id, user.uid!);
            }
        } catch (error) {
            console.error("Failed to vote:", error);
            // Revert optimistic update
            setLocalCaptions(prev => prev.map(c =>
                c.id === id ? {
                    ...c,
                    votes: alreadyVoted ? c.votes + 1 : c.votes - 1,
                    votedByMe: alreadyVoted
                } : c
            ));
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {localCaptions.map((caption, index) => (
                <div key={caption.id} className="flex gap-3 p-3 rounded-md bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-colors">
                    {/* Vote Column */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVote(caption.id)}
                            className={cn(
                                "h-8 w-8 rounded-full transition-colors",
                                caption.votedByMe ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" : "text-zinc-500 hover:bg-zinc-800 hover:text-red-500"
                            )}
                        >
                            <Heart className={cn("h-5 w-5", caption.votedByMe && "fill-current")} />
                        </Button>
                        <span className={cn("text-sm font-bold", caption.votedByMe ? "text-red-500" : "text-zinc-300")}>{caption.votes}</span>
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
                            <span className="text-xs text-zinc-500">• {new Date(caption.createdAt).toLocaleDateString()}</span>
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
