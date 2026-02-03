"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import BattleCard from "@/components/BattleCard";
import { Settings, Trophy, Zap, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/firebase/auth.service";
import { BattleService } from "@/services/firebase/battle.service";
import { Battle, User } from "@/types";
import { doc } from "firebase/firestore";
import { db } from "@/configs/firebase.config";

export default function UserProfile() {
    const { username } = useParams<{ username: string }>()!;
    const { user: currentUser } = useAuth();
    const router = useRouter();

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [userBattles, setUserBattles] = useState<Battle[]>([]);
    const [loading, setLoading] = useState(true);

    const decodeUsername = decodeURIComponent(username || "");
    const isOwnProfile = profileUser?.uid === currentUser?.uid;

    useEffect(() => {
        const fetchData = async () => {
            if (!decodeUsername) return;
            setLoading(true);

            try {
                let targetUser: any = null;

                if (decodeUsername === "me") {
                    if (currentUser) {
                        targetUser = currentUser;
                    } else {
                        // Not logged in and trying to access /me
                        setLoading(false);
                        return;
                    }
                } else {
                    targetUser = await AuthService.getUserByUsername(decodeUsername);
                }

                if (targetUser) {
                    const formattedUser: User = {
                        uid: targetUser.uid,
                        displayName: targetUser.name || "Unknown",
                        avatar: targetUser.imageUrl || "",
                        bio: targetUser.bio || "No bio yet.",
                        stats: {
                            wins: 0,
                            points: targetUser.points || 0,
                        },
                        username: targetUser.username || decodeUsername
                    };
                    setProfileUser(formattedUser);

                    // Fetch Battles
                    const userRef = doc(db, "users", targetUser.uid);
                    const rawBattles = await BattleService.getBattlesByUser(userRef);

                    const formattedBattles = rawBattles.map(b => ({
                        id: b.id!,
                        title: b.title,
                        description: b.description,
                        image: b.imageUrl,
                        creator: {
                            uid: targetUser.uid,
                            username: formattedUser.username,
                            displayName: formattedUser.displayName,
                            avatar: formattedUser.avatar
                        },
                        stats: {
                            captionCount: b.captionCount || 0,
                            viewCount: 0
                        },
                        endsAt: b.expiresAt?.toDate().toISOString() || new Date().toISOString()
                    } as Battle));

                    setUserBattles(formattedBattles);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [decodeUsername, currentUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] w-full">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    const displayedUser = profileUser || {
        uid: "placeholder",
        username: decodeUsername,
        displayName: "Ghost User",
        avatar: "",
        bio: "This profile hasn't been claimed yet. Are you the real u/" + decodeUsername + "?",
        stats: { wins: 0, points: 0 }
    } as User;

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full py-6 px-4 flex flex-col gap-4">

                {/* Profile Header */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-md p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar
                        src={displayedUser.avatar}
                        fallback={displayedUser.displayName.substring(0, 2).toUpperCase()}
                        className="h-24 w-24 text-2xl border-4 border-zinc-900 ring-1 ring-zinc-800 bg-zinc-900 text-zinc-300"
                    />

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-zinc-100">u/{displayedUser.username}</h1>
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
                                <span className="text-zinc-300 font-bold">{displayedUser.stats.wins}</span> Wins
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap className="h-4 w-4 text-orange-500" />
                                <span className="text-zinc-300 font-bold">{displayedUser.stats.points.toLocaleString()}</span> Points
                            </div>
                        </div>

                        <p className="text-sm text-zinc-300 max-w-lg leading-relaxed italic opacity-80">
                            {displayedUser.bio}
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

                    {/* Empty State */}
                    {userBattles.length === 0 && (
                        <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-900 rounded-md bg-zinc-950/50">
                            {!profileUser ? "This user doesn't exist yet." : `hmm... u/${displayedUser.username} hasn't posted anything yet.`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
