import Link from "next/link";
import Timer from "./Timer";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MessageSquare, Share2 } from "lucide-react";
import { Battle } from "@/types";

const BattleView = ({ battle }: { battle: Battle }) => {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden flex mb-6">
            {/* Vote Sidebar */}


            {/* Content Area */}
            <div className="flex-1 p-3 md:p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Avatar src={battle.creator.avatar} fallback={battle.creator.avatar} className="h-10 w-10 rounded-full ring-1 ring-zinc-800" />
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-zinc-100 leading-none">{battle.creator.displayName}</span>
                        <span className="text-sm text-zinc-500 mt-0.5">@{battle.creator.username}</span>
                    </div>
                    <div className="ml-auto">
                        <Timer endsAt={battle.endsAt} compact />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-lg md:text-2xl font-bold text-zinc-100 mb-2 leading-snug">{battle.title}</h1>

                {/* Main Content */}
                <div className="mb-4">
                    {battle.description && (
                        <div className="text-sm text-zinc-400 mb-3 leading-relaxed">
                            {battle.description}
                        </div>
                    )}
                    {battle.image && (
                        <div className="rounded-md overflow-hidden bg-black/50 flex justify-center border border-zinc-800/50">
                            <img src={battle.image} alt="Meme content" className="w-full max-h-[450px] object-contain" />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 text-zinc-500 border-t border-zinc-900 pt-3">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-2 text-zinc-400 hover:bg-zinc-800 rounded-sm">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-bold">
                            {battle.stats.captionCount}
                        </span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-2 text-zinc-400 hover:bg-zinc-800 rounded-sm">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BattleView;
