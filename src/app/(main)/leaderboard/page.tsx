import { Avatar } from "@/components/ui/Avatar";
import { Trophy, Flame, Medal } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
    const users = [
        { rank: 1, name: "meme_lord", wins: 45, points: 12450, avatar: "ML" },
        { rank: 2, name: "caption_king", wins: 38, points: 10200, avatar: "CK" },
        { rank: 3, name: "lmao_zedong", wins: 32, points: 9800, avatar: "LZ" },
        { rank: 4, name: "pun_intended", wins: 28, points: 8500, avatar: "PI" },
        { rank: 5, name: "doge_to_moon", wins: 25, points: 7200, avatar: "DM" },
        { rank: 6, name: "rick_roller", wins: 20, points: 6000, avatar: "RR" },
        { rank: 7, name: "pepe_frog", wins: 18, points: 5400, avatar: "PF" },
        { rank: 8, name: "hide_the_pain", wins: 15, points: 4800, avatar: "HP" },
    ];

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full py-6 px-0 md:px-4 flex flex-col gap-6">

                <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h1 className="text-xl font-medium text-zinc-100">Hall of Fame</h1>
                </div>

                {/* Top 3 Podium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* 2nd Place */}
                    <Link href={`/u/${users[1].name}`} className="order-2 md:order-1 bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col items-center hover:border-zinc-700 transition-colors mt-0 md:mt-4">
                        <div className="relative mb-3">
                            <Avatar fallback={users[1].avatar} className="h-16 w-16 border-2 border-zinc-400" />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-400 text-zinc-950 text-xs font-bold px-2 rounded-full border border-zinc-950">#2</div>
                        </div>
                        <span className="font-bold text-zinc-100 text-lg mb-1">u/{users[1].name}</span>
                        <span className="text-xs text-zinc-500 mb-3">{users[1].wins} Wins</span>
                        <span className="font-mono text-zinc-300 font-bold">{users[1].points.toLocaleString()} pts</span>
                    </Link>

                    {/* 1st Place */}
                    <Link href={`/u/${users[0].name}`} className="order-1 md:order-2 bg-gradient-to-b from-yellow-900/20 to-zinc-950 border border-yellow-500/30 rounded-lg p-8 flex flex-col items-center hover:border-yellow-500/50 transition-colors shadow-lg shadow-yellow-900/10">
                        <div className="relative mb-4">
                            <Avatar fallback={users[0].avatar} className="h-20 w-20 border-2 border-yellow-500" />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                <Trophy className="h-6 w-6 text-yellow-500 fill-current" />
                            </div>
                        </div>
                        <span className="font-bold text-yellow-500 text-xl mb-1">u/{users[0].name}</span>
                        <span className="text-xs text-yellow-500/70 mb-3">{users[0].wins} Wins</span>
                        <span className="font-mono text-2xl text-white font-bold">{users[0].points.toLocaleString()} pts</span>
                    </Link>

                    {/* 3rd Place */}
                    <Link href={`/u/${users[2].name}`} className="order-3 md:order-3 bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col items-center hover:border-zinc-700 transition-colors mt-0 md:mt-4">
                        <div className="relative mb-3">
                            <Avatar fallback={users[2].avatar} className="h-16 w-16 border-2 border-orange-700" />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-700 text-zinc-950 text-xs font-bold px-2 rounded-full border border-zinc-950">#3</div>
                        </div>
                        <span className="font-bold text-zinc-100 text-lg mb-1">u/{users[2].name}</span>
                        <span className="text-xs text-zinc-500 mb-3">{users[2].wins} Wins</span>
                        <span className="font-mono text-zinc-300 font-bold">{users[2].points.toLocaleString()} pts</span>
                    </Link>
                </div>

                {/* Rest of the list */}
                <div className="flex flex-col gap-2">
                    {users.slice(3).map((user) => (
                        <Link href={`/u/${user.name}`} key={user.rank} className="flex items-center p-4 bg-zinc-900/30 border border-zinc-900 rounded-lg hover:bg-zinc-900 hover:border-zinc-800 transition-colors">
                            <div className="w-8 text-center font-bold text-zinc-500">#{user.rank}</div>
                            <Avatar fallback={user.avatar} className="h-8 w-8 mx-4" />
                            <div className="flex-1 font-medium text-zinc-200">u/{user.name}</div>
                            <div className="flex items-center gap-6 text-right">
                                <div className="hidden sm:block text-sm text-zinc-500">{user.wins} Wins</div>
                                <div className="font-mono font-bold text-zinc-300 w-20">{user.points.toLocaleString()}</div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
