import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import BattleCard from "@/components/BattleCard";
import { Settings, Trophy, Zap, Calendar } from "lucide-react";

export default async function UserProfile({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params;
    // Mock user data
    const decodeUsername = decodeURIComponent(username);
    const isOwnProfile = decodeUsername === "me" || decodeUsername === "meme_lord";

    // Mock User battles
    const userBattles = [
        {
            id: "1",
            title: "When your boss says 'one more task' right before 5 PM",
            creator: {
                username: "meme_lord",
                displayName: "Meme Lord",
                avatar: "ML"
            },
            image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN5aG15Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55/ASd0Ukj0y3qMM/giphy.gif",
            topCaption: "I accept my fate.",
            stats: {
                captionCount: 248,
                viewCount: 1200
            },
            endsAt: "2024-05-20T12:00:00Z"
        }
    ];

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full py-6 px-4 flex flex-col gap-4">

                {/* Profile Header */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-md p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar fallback={decodeUsername.substring(0, 2).toUpperCase()} className="h-24 w-24 text-2xl border-4 border-zinc-900 ring-1 ring-zinc-800 bg-zinc-900 text-zinc-300" />

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-zinc-100">u/{decodeUsername}</h1>
                            {isOwnProfile && (
                                <Link href="/settings">
                                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800">
                                        <Settings className="h-3 w-3" />
                                        Settings
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-zinc-500 mb-4 items-center">
                            <div className="flex items-center gap-1.5">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="text-zinc-300 font-bold">12</span> Wins
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <span className="text-zinc-300 font-bold">4,320</span> Points
                            </div>
                            <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-800 pl-4">
                                <Calendar className="h-3 w-3 text-zinc-600" />
                                <span>Joined May 12, 2024</span>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-300 max-w-lg leading-relaxed">
                            Just here to post memes and vote on the best captions. Professional procrastinator.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-zinc-800 overflow-x-auto no-scrollbar">
                    <button className="px-4 py-2 text-sm font-bold text-zinc-100 border-b-2 border-zinc-100 whitespace-nowrap">Overview</button>
                    <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 whitespace-nowrap">Posts</button>
                    <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 whitespace-nowrap">Comments</button>
                    <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 whitespace-nowrap">Saved</button>
                    <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 whitespace-nowrap">Upvoted</button>
                </div>

                {/* Content Feed */}
                <div className="flex flex-col gap-2 mt-2">
                    {userBattles.map(battle => (
                        <BattleCard key={battle.id} battle={battle} />
                    ))}

                    {/* Empty State Mock */}
                    {userBattles.length === 0 && (
                        <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-900 rounded-md bg-zinc-950/50">
                            hmm... u/{decodeUsername} hasn't posted anything yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
