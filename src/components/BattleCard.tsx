import Link from "next/link";
import Timer from "./Timer";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Share2, Trophy } from "lucide-react";
import { Battle } from "@/types";

const BattleCard = ({ battle }: { battle: Battle }) => {
    return (
        <Card className="hover:border-zinc-700 transition-colors bg-zinc-950 border-zinc-900 rounded-md overflow-hidden cursor-pointer">
            <div className="flex">

                {/* Content Area */}
                <div className="flex-1 p-4 pb-2">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar fallback={battle.creator.avatar} className="h-9 w-9 rounded-full ring-1 ring-zinc-800" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-200 leading-none">{battle.creator.displayName}</span>
                            <span className="text-xs text-zinc-500 mt-0.5">@{battle.creator.username}</span>
                        </div>
                        <div className="ml-auto">
                            <Timer endsAt={battle.endsAt} compact />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-medium text-zinc-100 mb-1 leading-snug">{battle.title}</h2>

                    {/* Main Content */}
                    <div className="mb-3">
                        {battle.description && (
                            <div className="text-sm text-zinc-400 mb-3 leading-relaxed">
                                {battle.description}
                            </div>
                        )}
                        {battle.image && (
                            <div className="rounded-md overflow-hidden border border-zinc-800 bg-black flex justify-center max-h-[350px]">
                                <img src={battle.image} alt="Meme content" className="object-contain max-h-full max-w-full" />
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-1 text-zinc-500 -ml-2">
                        <Link href={`/battles/${battle.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs gap-2 text-zinc-400 hover:bg-zinc-800 rounded-sm">
                                <MessageSquare className="h-4 w-4" />
                                <span className="font-bold">{battle.stats.captionCount} Captions</span>
                            </Button>
                        </Link>

                        <Button variant="ghost" size="sm" className="h-8 text-xs gap-2 text-zinc-400 hover:bg-zinc-800 rounded-sm">
                            <Share2 className="h-4 w-4" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BattleCard;
